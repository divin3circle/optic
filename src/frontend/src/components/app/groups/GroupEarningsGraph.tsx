import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", earnings: 4 },
  { month: "February", earnings: 2 },
  { month: "March", earnings: 8 },
  { month: "April", earnings: 1 },
  { month: "May", earnings: 5 },
  { month: "June", earnings: 10 },
];

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function GroupEarningsGraph() {
  return (
    <Card className="shadow-none bg-[#faf6f9] border border-gray-200 rounded-3xl mt-4">
      <CardHeader className="text-center">
        <CardTitle className="text-lg text-gray-600 font-karla">
          Room Earnings Graph
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart
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
                  formatter={(value) => `Earnings: $${value}`}
                />
              }
            />
            <Bar dataKey="earnings" fill="var(--color-earnings)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
