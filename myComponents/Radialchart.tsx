import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export default function Component({ score }: { score: number }) {
  // Set maxScore to 100
  const maxScore = 100; // Set maxScore to 100
  const scorePercentage = Math.round((score / maxScore) * 100); // Round the score percentage to an integer

  // Update chartData to reflect the rounded percentage score
  const chartData = [{ value: scorePercentage, fill: "hsl(var(--chart-2))" }];

  // Calculate endAngle based on score percentage
  const endAngle = 270 + (scorePercentage * 3.6); // 3.6 degrees per percentage point, start at 270 (bottom)

  return (
    <Card className="flex flex-col shadow-none border-0">
      <CardHeader className="items-center p-0">
        <CardTitle>Overall Score</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer className="mx-auto aspect-square max-h-[250px] mt-8">
          <RadialBarChart
            data={chartData}
            startAngle={270} // Start from the bottom (270 degrees)
            endAngle={endAngle} // Dynamic end angle based on score
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={10}
              fill="var(--color-safari)" // Set fill color for the radial bar
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {score} / {maxScore} {/* Display score as integer */}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Score
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground text-transparent">
          Showing your overall score
        </div>
      </CardFooter>
    </Card>
  );
}