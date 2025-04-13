"use client"

import { useTheme } from "next-themes"
import { PieChart, Pie, Cell, ResponsiveContainer } from "@/components/ui/chart"
import { motion } from "framer-motion"

interface HateSpeechScoreChartProps {
  scores: {
    hateSpeech: number
    offensive: number
    neutral: number
  }
}

export function HateSpeechScoreChart({ scores }: HateSpeechScoreChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const data = [
    { name: "Hate Speech", value: scores.hateSpeech },
    { name: "Offensive", value: scores.offensive },
    { name: "Neutral", value: scores.neutral },
  ]

  const COLORS = isDark
    ? ["hsl(var(--destructive))", "hsl(var(--warning))", "hsl(var(--primary))"]
    : ["hsl(var(--destructive))", "hsl(var(--warning))", "hsl(var(--primary))"]

  const isHateSpeech = scores.hateSpeech > 0.5

  return (
    <div className="relative h-60 w-60">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <span className={`text-4xl font-bold ${isHateSpeech ? "text-destructive" : "text-primary"}`}>
          {isHateSpeech ? "Unsafe" : "Safe"}
        </span>
        <span className="text-sm text-muted-foreground">Content</span>
      </motion.div>
    </div>
  )
}
