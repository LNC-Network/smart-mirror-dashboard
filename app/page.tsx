"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { EmotionChart } from "@/components/emotion-chart"
import { ActivityTimeline } from "@/components/activity-timeline"
import { LocationHeatmap } from "@/components/location-heatmap"
import { Monitor as MirrorIcon, Smile, TrendingUp, AlertTriangle, Activity, Eye, Users, Clock, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { MirrorType } from "@/context/global-context-type"
import { io } from "socket.io-client";

export default function DashboardPage() {

  const [mirrors, setMirrors] = useState<MirrorType[]>([]);
  const [socket, setSocket] = useState<any>(null);

  const topEmotion = mirrors.length > 0
    ? Object.entries(
      mirrors.reduce((acc, mirror) => {
        acc[mirror.emotion] = (acc[mirror.emotion] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1])[0][0]
    : "N/A";

  const topEmotionPercentage = mirrors.length > 0
    ? Math.round(
      (mirrors.filter(m => m.emotion === topEmotion).length / mirrors.length) * 100
    )
    : 0;

  useEffect(() => {
    // Connect to the server
    const socketClient = io({
      path: "/api/socket_io",
    });

    setSocket(socketClient);

    socketClient.on("connect", () => {
      console.log("Connected with ID:", socketClient.id);

      // Example: send mirror info on connect
      const mirror: MirrorType = {
        id: "mirror1",
        ipAddress: "192.168.1.100",
        totalFaceDetected: 100,
        description: "Living Room Mirror",
        cpuUsage: 20,
        memoryUsage: 50,
        storageUsage: 100,
        emotion: "happy",
        avgBodyTemperature: 36.5
      };
      socketClient.emit("addMirror", mirror);
    });

    socketClient.on("mirrorAdded", (mirror: MirrorType) => {
      setMirrors(prev => {
        // Avoid duplicates
        if (prev.find(m => m.id === mirror.id)) return prev;
        return [...prev, mirror];
      });
    });

    socketClient.on("mirrorUpdate", (data: MirrorType) => {
      setMirrors(prev =>
        prev.map(m => (m.id === data.id ? data : m))
      );
    });

    socketClient.on("mirrorDisconnected", (id: string) => {
      setMirrors(prev => prev.filter(m => m.id !== id));
    });


    return () => socketClient.disconnect();
  }, []);




  return (
    <DashboardLayout currentPage="Overview">
      <div className="space-y-6">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mirrors</CardTitle>
              <MirrorIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mirrors.length}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {mirrors.filter(m => m.cpuUsage > 0).length} Online
                </Badge>
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  {mirrors.filter(m => m.cpuUsage === 0).length} Offline
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faces Detected Today</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mirrors.reduce((acc, m) => acc + m.totalFaceDetected, 0)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Emotion</CardTitle>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topEmotion}</div>
              <p className="text-xs text-muted-foreground">{topEmotionPercentage}% of all detections</p>
            </CardContent>
          </Card>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Emotion Distribution</CardTitle>
              <CardDescription>Today's emotion breakdown across all mirrors</CardDescription>
            </CardHeader>
            <CardContent>
              <EmotionChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Face detection and sentiment trends over 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTimeline />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Location Heatmap</CardTitle>
            <CardDescription>Real-time sentiment and engagement across all locations</CardDescription>
          </CardHeader>
          <CardContent>
            <LocationHeatmap />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">Peak Hours</p>
                      <p className="text-sm text-muted-foreground">12:00 - 14:00</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">89</p>
                    <p className="text-xs text-muted-foreground">avg faces/hour</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-secondary" />
                    <div>
                      <p className="font-medium">Avg Session</p>
                      <p className="text-sm text-muted-foreground">Per detection</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">2.3s</p>
                    <p className="text-xs text-muted-foreground">duration</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-accent" />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-sm text-muted-foreground">System latency</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">45ms</p>
                    <p className="text-xs text-muted-foreground">avg response</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div>No notification</div>
              <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm">
                View All Alerts
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Overall system status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mirror Connectivity</span>
                  <div className="flex items-center gap-2">
                    <Progress value={92} className="w-20" />
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Processing</span>
                  <div className="flex items-center gap-2">
                    <Progress value={98} className="w-20" />
                    <span className="text-sm font-medium">98%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">API Response</span>
                  <div className="flex items-center gap-2">
                    <Progress value={95} className="w-20" />
                    <span className="text-sm font-medium">95%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage Usage</span>
                  <div className="flex items-center gap-2">
                    <Progress value={67} className="w-20" />
                    <span className="text-sm font-medium">67%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-green-900">All Systems Operational</span>
                </div>
                <p className="text-xs text-green-700 mt-1">Last updated: 30 seconds ago</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
