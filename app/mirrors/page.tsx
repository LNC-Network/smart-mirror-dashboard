"use client";
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MirrorGrid } from "@/components/mirror-grid"
import { MirrorStats } from "@/components/mirror-stats"
import { MirrorFilters } from "@/components/mirror-filters"
import { Search, RefreshCw } from "lucide-react"
import { useGlobalContext } from "@/context/global-context-manager"

export default function MirrorsPage() {
  const {
    totalMirrorCount,
    activeMirrors,
    offlineMirrors,
    totalFaceCount,
    mirrors
  } = useGlobalContext();

  return (
    <DashboardLayout currentPage="Mirrors">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search mirrors..." className="pl-10 w-64" />
            </div>
            <MirrorFilters />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Select defaultValue="grid">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mirror Stats Overview */}
        <MirrorStats
          totalMirrors={totalMirrorCount}
          onlineMirrors={activeMirrors}
          offlineMirrors={offlineMirrors}
          activeDetections={totalFaceCount}
        />

        {/* Mirror Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Mirror Network</CardTitle>
            <CardDescription>Real-time status and performance of all smart mirrors</CardDescription>
          </CardHeader>
          <CardContent>
            <MirrorGrid mirrors={mirrors} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}