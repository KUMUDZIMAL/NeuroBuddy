"use client";

import { useState, useEffect } from "react";
import { PolarRadiusAxis, RadialBar, RadialBarChart, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export default function Piechart() {
  const [sleepData, setSleepData] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAge, setUserAge] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSleepData() {
      try {
        const sleepRes = await fetch("/api/auth/inputCard"); // Replace with your sleep data API endpoint
        const sleepData = await sleepRes.json();
        if (sleepData && sleepData.analysis) {
          setSleepData(sleepData.analysis.reverse());
          if (sleepData.analysis.length > 0) {
            setCurrentIndex(0);
          }
        }

        const userRes = await fetch("/api/auth/user"); // Replace with user API endpoint
        const userData = await userRes.json();
        if (userData && userData.age) {
          setUserAge(userData.age);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchSleepData();
  }, []);

  const currentSleep = sleepData[currentIndex] || {};

  const getRecommendedRange = () => {
    if (userAge !== null) {
      if (userAge >= 13 && userAge <= 18) {
        return [8, 10];
      } else if (userAge >= 18 && userAge <= 64) {
        return [7, 9];
      } else if (userAge > 64) {
        return [7, 8];
      }
    }
    return [8, 8]; // Default if age is not available
  };

  const calculateEndAngle = () => {
    const maxRecommendedHours = getRecommendedRange()[1];
    const sleepHours = currentSleep.sleep || 0;
    const percentage = Math.min(sleepHours / maxRecommendedHours, 1); // Cap at 100%
    return percentage * 180; // Scale to 180° arc
  };

  const getSleepStatusMessage = () => {
    const [min, max] = getRecommendedRange();
    const sleepHours = currentSleep.sleep || 0;

    if (sleepHours < min) {
      return "Not enough sleep. Try to rest more!";
    } else if (sleepHours >= min && sleepHours <= max) {
      return "Good! You are sleeping well.";
    } else {
      return "Too much sleep. Try to balance your schedule.";
    }
  };

  const chartData = [
    {
      sleep: currentSleep.sleep || 0,
    },
  ];

  const formattedDate = currentSleep.createdAt
    ? new Date(currentSleep.createdAt).toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " " +
      new Date(currentSleep.createdAt).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : "Loading...";

  return (
    <Card className="flex flex-col shadow-none border-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>SLEEP TRACER</CardTitle>
        <CardDescription>Track your sleep</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer className="mx-auto aspect-square w-full max-w-[250px]">
          <RadialBarChart
            data={chartData}
            endAngle={calculateEndAngle()}
            innerRadius={80}
            outerRadius={130}
          >
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {currentSleep.sleep && !isNaN(Number(currentSleep.sleep))
                            ? Number(currentSleep.sleep).toLocaleString()
                            : "2"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Sleep Hours
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="sleep"
              cornerRadius={5}
              fill="hsl(263.4 70% 50.4%)"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col text-sm w-full">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, sleepData.length - 1))}
            className="bg-slate-300 rounded-full p-1 mr-0.5"
            disabled={currentIndex >= sleepData.length - 1}
          >
            &lt;
          </button>
          <div className="text-center">{formattedDate}</div>
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            className="bg-slate-300 rounded-full p-1 ml-0.5"
            disabled={currentIndex <= 0}
          >
            &gt;
          </button>
        </div>
        <div className="text-center mt-4 font-medium">{getSleepStatusMessage()}</div>
        <div className="flex items-start font-medium leading-none flex-col gap-1 mt-4">
          <div className="bg-slate-300 rounded-full p-1">13 to 18 years: 8 to 10 hours</div>
          <div className="bg-slate-300 rounded-full p-1">18 to 64 years: 7 to 9 hours</div>
          <div className="bg-slate-300 rounded-full p-1">{`>`} 64 years: 7 to 8 hours</div>
        </div>
      </CardFooter>
    </Card>
  );
}
