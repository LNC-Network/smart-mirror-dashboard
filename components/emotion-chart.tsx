"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useGlobalContext } from "@/context/global-context-manager"
const emotionData = [
  { name: "Happy", value: 42, color: "hsl(var(--chart-1))" },
  { name: "Neutral", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Surprised", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Sad", value: 10, color: "hsl(var(--chart-4))" },
  { name: "Angry", value: 5, color: "hsl(var(--chart-5))" },
]

export function EmotionChart() {

  const GlobalContext = useGlobalContext();
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={emotionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
          {emotionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
