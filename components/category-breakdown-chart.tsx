"use client"

import { useTheme } from "next-themes"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "@/components/ui/chart"

interface CategoryBreakdownChartProps {
  data?: Array<{
    name: string
    value: number
  }>
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Default mock data for the chart if no data is provided
  const chartData = data || [
    {
      name: "Hate",
      value: 0.65,
    },
    {
      name: "Offensive",
      value: 0.82,
    },
    {
      name: "Threat",
      value: 0.31,
    },
    {
      name: "Harassment",
      value: 0.58,
    },
    {
      name: "Discrimination",
      value: 0.72,
    },
  ]

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 40,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            tick={{ fill: isDark ? "hsl(var(--primary))" : "hsl(var(--primary))" }}
            width={60}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: isDark ? "hsl(var(--primary))" : "hsl(var(--primary))" }}
            width={100}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "hsl(var(--background))" : "white",
              borderColor: "hsl(var(--border))",
              color: isDark ? "white" : "black",
            }}
            formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, "Score"]}
          />
          <Legend />
          <Bar
            dataKey="value"
            name="Category Score"
            fill={isDark ? "white" : "var(--primary)"}
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
