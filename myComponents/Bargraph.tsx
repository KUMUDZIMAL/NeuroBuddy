"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, YAxis, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define the type for chart data items
interface ChartDataItem {
  entry: string;
  mood: string;
  label: string; // This will correspond to mood labels in the chart
  count: number;
}

interface Mood {
  emoji: string;
  label: string;
}

const chartConfig = {
  mood: {
    label: "Mental Wellbeing",
    color: "hsl(258.3 89.5% 66.3%)",
  },
} satisfies ChartConfig;

export default function Component() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Moods array with corresponding emojis
  const moods: Mood[] = [
    { emoji: "🌟", label: "Awesome" },
    { emoji: "😊", label: "Great" },
    { emoji: "😍", label: "Loved" },
    { emoji: "🙂", label: "Okay" },
    { emoji: "😕", label: "Meh" },
    { emoji: "😥", label: "Anxious" },
    { emoji: "☹️", label: "Bad" },
    { emoji: "😖", label: "Terrible" },
    { emoji: "😡", label: "Upset" },
  ];
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await fetch("/api/auth/mood"); // Fetch mood data from your API
        if (!response.ok) {
          throw new Error("Failed to fetch mood data");
        }
        const result = await response.json();
        setChartData(result.analysis); // Set chart data based on the backend response
      } catch (error) {
        console.error("Error fetching mood data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  if (loading) return <p>Loading...</p>;

  // Update chartData to map `mood` to corresponding emoji and label
  const updatedChartData = chartData.map((data) => {
    const mood = moods.find((m) => m.label === data.mood); // Find matching mood
    return {
      ...data,
      label: mood?.label || "Unknown", // If no match, fallback to "Unknown"
    };
  });

  return (
    <Card className="shadow-none p-0 border-0 w-full">
      <CardHeader>
        <CardTitle>MENTAL WELLNESS TRACKER</CardTitle>
        <CardDescription>Track your emotional journey</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            width={900} // Increase the width of the graph
            height={500} // Increase the height of the graph
            data={updatedChartData}
            margin={{ bottom: 50 }} // Increase bottom margin to give space for labels
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="entry"
              tickLine={false}
              axisLine={false}
              tick={({ x, y, payload }) => {
                const dataIndex = payload.index;
                const moodLabel = updatedChartData[dataIndex]?.label;
                const mood = moods.find((m) => m.label === moodLabel);

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      y={15} // Adjust vertical position of the emoji
                      x={0}
                      textAnchor="middle"
                      fill="#666"
                      fontSize={16}
                    >
                      {mood?.emoji || "❓"}
                    </text>
                    <text
                      y={40} // Adjust the vertical spacing between the emoji and label
                      x={0}
                      textAnchor="middle"
                      fill="#666"
                      fontSize={12}
                    >
                      {moodLabel || "Unknown"}
                    </text>
                  </g>
                );
              }}
            />
            <YAxis
              type="number"
              domain={[0, 7]} // Setting Y-axis scale from 0 to 7
              tickCount={7}
              axisLine={false}
              tickLine={false}
            />
            <YAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="count"
              fill="hsl(258.3 89.5% 66.3%)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
