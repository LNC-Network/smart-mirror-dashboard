"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, TrendingDown } from "lucide-react"

const locationData = [
  {
    id: 1,
    name: "Main Lobby",
    faces: 156,
    sentiment: 8.2,
    trend: "up",
    engagement: "high",
    mirrors: 4,
    status: "online",
  },
  {
    id: 2,
    name: "Reception Area",
    faces: 89,
    sentiment: 7.1,
    trend: "up",
    engagement: "medium",
    mirrors: 2,
    status: "online",
  },
  {
    id: 3,
    name: "Conference Room A",
    faces: 45,
    sentiment: 7.8,
    trend: "stable",
    engagement: "medium",
    mirrors: 1,
    status: "online",
  },
  {
    id: 4,
    name: "Break Room",
    faces: 34,
    sentiment: 6.3,
    trend: "down",
    engagement: "low",
    mirrors: 2,
    status: "partial",
  },
  {
    id: 5,
    name: "Conference Room B",
    faces: 12,
    sentiment: 6.8,
    trend: "stable",
    engagement: "low",
    mirrors: 1,
    status: "online",
  },
  {
    id: 6,
    name: "Executive Floor",
    faces: 67,
    sentiment: 8.5,
    trend: "up",
    engagement: "high",
    mirrors: 3,
    status: "online",
  },
]

export function LocationHeatmap() {
  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case "high":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "partial":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {locationData.map((location) => (
        <Card key={location.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-base">{location.name}</CardTitle>
              </div>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(location.status)}`} />
            </div>
            <CardDescription>
              {location.mirrors} mirror{location.mirrors !== 1 ? "s" : ""} deployed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Faces Today</span>
              <span className="font-semibold">{location.faces}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sentiment</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{location.sentiment}/10</span>
                {location.trend === "up" && <TrendingUp className="w-3 h-3 text-green-600" />}
                {location.trend === "down" && <TrendingDown className="w-3 h-3 text-red-600" />}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Engagement</span>
              <Badge variant="outline" className={getEngagementColor(location.engagement)}>
                {location.engagement}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
