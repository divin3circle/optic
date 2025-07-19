import { AreaChart, Area, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", contributions: 186 },
  { month: "February", contributions: 305 },
  { month: "March", contributions: 237 },
  { month: "April", contributions: 73 },
  { month: "May", contributions: 209 },
  { month: "June", contributions: 214 },
];

const chartConfig = {
  contributions: {
    label: "Contributions",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function GroupContributionGraph() {
  return (
    <Card className="shadow-none bg-[#faf6f9] border border-gray-200 rounded-3xl mt-4">
      <CardHeader className="text-center">
        <CardTitle className="text-lg text-gray-600 font-karla">
          Room Contributions Graph
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => `Contributions: ${value}`}
                />
              }
            />
            <Area
              dataKey="contributions"
              fill="var(--color-contributions)"
              type="natural"
              strokeWidth={2}
              stroke="var(--color-contributions)"
              fillOpacity={0.3}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Area>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
