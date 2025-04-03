"use client"

import { useCallback, useState } from "react"
import { Wifi, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface ModemStatsProps {
  data: {
    status: string
    uptime: string
    ipAddress: string
    connection: string
    macAddress: string
    model: string
    firmwareVersion: string
    pingLatency?: number
    signalStrength?: number
    connectedDevices?: number
  }
  loading: boolean
  onRefresh?: () => void
}

export function ModemStats({ data, loading, onRefresh }: ModemStatsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      setIsRefreshing(true)

      // Call the refresh function
      onRefresh()

      // Reset the refreshing state after 1 second to show the animation
      setTimeout(() => {
        setIsRefreshing(false)
      }, 1000)
    }
  }, [onRefresh])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Modem Information</CardTitle>
          <CardDescription>Basic details about your modem</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Wifi className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            {loading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <Badge variant={data.status === "online" ? "default" : "destructive"} className="capitalize">
                {data.status}
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Uptime</div>
            <div className="text-sm">{data.uptime}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">IP Address</div>
            {loading ? <Skeleton className="h-6 w-32" /> : <div className="text-sm">{data.ipAddress}</div>}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Connection</div>
            {loading ? <Skeleton className="h-6 w-32" /> : <div className="text-sm">{data.connection}</div>}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">MAC Address</div>
            <div className="text-sm">{data.macAddress}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Model</div>
            <div className="text-sm">{data.model}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium ">Firmware Version</div>
            <div className="text-sm">{data.firmwareVersion}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

