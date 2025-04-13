"use client"

import { useTheme } from "next-themes"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "@/components/ui/chart"

export function SimilarityMetricsChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const data = [
    {
      name: "Semantic",
      value: 0.83,
      threshold: 0.85,
    },
    {
      name: "N-gram",
      value: 0.001,
      threshold: 0.4,
    },
    {
      name: "Fuzzy",
      value: 0.42,
      threshold: 0.7,
    },
  ]

  const getBarColor = (value: number, threshold: number) => {
    return value >= threshold ? "var(--destructive)" : "var(--primary)"
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fill: isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))" }} />
          <YAxis
            tick={{ fill: isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))" }}
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "hsl(var(--background))" : "white",
              borderColor: "hsl(var(--border))",
            }}
            formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, "Value"]}
          />
          <Legend />
          <Bar dataKey="value" name="Similarity Score" radius={[4, 4, 0, 0]} animationDuration={1500}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.value, entry.threshold)} />
            ))}
          </Bar>
          <Bar
            dataKey="threshold"
            name="Threshold"
            fill="var(--muted-foreground)"
            fillOpacity={0.3}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
