"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useGlobalContext } from "@/context/global-context-manager"

interface ChatEmotionType {
  name: string
  value: number
  color: string
}

function getEmotionColor(emotion: string) {
  switch (emotion) {
    case "happy": return "#4ade80"
    case "sad": return "#60a5fa"
    case "angry": return "#f87171"
    case "neutral": return "#fbbf24"
    case "surprised": return "#a78bfa"
    case "disgusted": return "#f472b6"
    default: return "#d1d5db"
  }
}

export function EmotionChart() {
  const { locations } = useGlobalContext()

  const emotionMap: Record<string, number> = {}

  locations.forEach(location => {
    location.mirrors.forEach(mirror => {
      const emo = (mirror as any).emotion || "neutral"
      emotionMap[emo] = (emotionMap[emo] || 0) + 1
    })
  })

  let emotionData: ChatEmotionType[] = Object.entries(emotionMap).map(([name, value]) => ({
    name,
    value,
    color: getEmotionColor(name),
  }))

  // Fallback if no data
  if (emotionData.length === 0) {
    emotionData = [{
      name: "No Data",
      value: 1,
      color: "#d1d5db"
    }]
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={emotionData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {emotionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
