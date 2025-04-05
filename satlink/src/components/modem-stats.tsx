"use client"

import { useCallback, useState } from "react"
import { Wifi, RefreshCw, Satellite } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useModemConstellation } from "../hooks/useModemConstellation"
import { useModemFirmwareVersion } from "../hooks/useModemFirmwareVersion"

interface ModemStatsProps {
  data: {
    status: string
    uptime: string
    ipAddress: string
    macAddress: string
    model: string
    firmwareVersion: string
    downloadSpeed?: number
    uploadSpeed?: number
    pingLatency?: number
    signalStrength?: number
    connectedDevices?: number
  }
  loading: boolean
  onRefresh?: () => void
}

export function ModemStats({ data, loading, onRefresh }: ModemStatsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const {
    data: constellation,
    loading: constellationLoading,
    refresh: refreshConstellation,
  } = useModemConstellation()

  const {
    data: firmware,
    loading: firmwareLoading,
    refresh: refreshFirmwareVersion,
  } = useModemFirmwareVersion()

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        onRefresh?.(), // Optional chaining in case it's undefined
        refreshConstellation(),
        refreshFirmwareVersion()
      ]);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, refreshConstellation, refreshFirmwareVersion]);

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

          {/* Constellation data */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Satellite className="h-4 w-4" /> Constellation
            </div>
            {constellationLoading ? (
              <Skeleton className="h-6 w-full" />
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant={constellation?.constellation_visible ? "default" : "destructive"}>
                  {constellation?.constellation_visible ? "Visible" : "Not Visible"}
                </Badge>
              </div>
            )}
          </div>

          {/* Uptime */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Uptime</div>
            {loading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <div className="text-sm">{data.uptime}</div>
            )}
          </div>

          {/* IP Address */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">IP Address</div>
            <div className="text-sm">10.1.1.252</div>
          </div>

          {/* MAC Address
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">MAC Address</div>
            <div className="text-sm">{data.macAddress}</div>
          </div> */}

          {/* Model */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Model</div>
            <div className="text-sm">Iridium Certus 9770</div>
          </div>

          {/* Firmware Version */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Firmware Version</div>
            {firmwareLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : firmware?.version ? (
              <Badge variant="default">{firmware.version}</Badge>
            ) : (
              <div className="text-sm text-destructive">Unavailable</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
