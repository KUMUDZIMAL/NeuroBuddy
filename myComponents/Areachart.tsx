import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
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

const chartConfig = {
  food: {
    label: "Food",
    color: "hsl(258.3 89.5% 66.3%)",
  },
  water: {
    label: "Water",
    color: "hsl(330.4 81.2% 60.4%)",
  },
} satisfies ChartConfig;

export default function Component() {
  const [chartData, setChartData] = useState<
    { food: number; water: number; entryNumber: number; createdAt: string }[] // Include createdAt field in the state
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/auth/inputCard"); // Replace with the actual endpoint
      const data = await response.json();

      if (Array.isArray(data.analysis)) {
        const transformedData = data.analysis.map((entry: any, index: number) => ({
          food: entry.calories || 0,
          water: entry.water || 0,
          entryNumber: index + 1, // Label each entry (1st, 2nd, etc.)
          createdAt: entry.createdAt && !isNaN(new Date(entry.createdAt).getTime()) 
            ? entry.createdAt // Use the valid date if it's correct
            : Date.now(), // Use current timestamp if the date is invalid
        }));

        setChartData(transformedData);
      } else {
        console.error("Invalid data format:", data.analysis);
      }
    };

    fetchData();
  }, []);

  // Calculate the maximum value for the Y-axis dynamically based on both food and water
  const maxFood = Math.max(...chartData.map((d) => d.food || 0), 10); // Ensure a minimum value of 10 for food
  const maxWater = Math.max(...chartData.map((d) => d.water || 0), 10); // Ensure a minimum value of 10 for water

  // Choose the greater of the two as the max value for the Y-axis
  const maxYAxis = Math.max(maxFood, maxWater);

  // Format the date using JavaScript's Date object
  // Format the date using JavaScript's Date object
const formatDate = (date: string | number) => {
  const d = new Date(date);

  // Check if the date is valid
  if (isNaN(d.getTime())) {
    console.error("Invalid Date:", date);
    // Return today's date in "dd MMM" format (e.g., "01 Jan")
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = today.toLocaleString('default', { month: 'short' }); // Get short month name
    return `${day} ${month}`;
  }

  // Return formatted date as "dd MMM" (e.g., "01 Dec")
  const day = d.getDate().toString().padStart(2, '0'); // Ensure two-digit day
  const month = d.toLocaleString('default', { month: 'short' }); // Get short month name
  return `${day} ${month}`;
};


  return (
    <Card className="shadow-none border-0 w-full h-1/2" style={{ marginTop: '1rem' }}>
      <CardHeader>
        <CardTitle>FOOD & WATER</CardTitle>
        <CardDescription>
          Your food and water track here<br></br> Food in Kcal <br></br>Water in L
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="createdAt"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatDate} // Format the date for X-axis
            />
            <YAxis
              type="number"
              domain={[0, maxYAxis]} // Dynamic Y-axis range based on max of food and water
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillFood" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-food)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-food)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillWater" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-water)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-water)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            {/* Food Area */}
            <Area
              dataKey="food"
              type="monotone"
              fill="url(#fillFood)"
              fillOpacity={0.4}
              stroke="var(--color-food)"
              strokeWidth={2}
            />

            {/* Water Area */}
            <Area
              dataKey="water"
              type="monotone"
              fill="url(#fillWater)"
              fillOpacity={0.4}
              stroke="var(--color-water)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
