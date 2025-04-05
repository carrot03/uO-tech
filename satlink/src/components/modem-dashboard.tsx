 "use client"

import { useEffect, useState } from "react"
import { Activity, ArrowDown, ArrowUp, Signal, Wifi } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SystemMetrics } from "@/components/system-metrics"
import { ConnectionQuality } from "@/components/connection-quality"
import { DevicesList } from "@/components/devices-list"
import { ModemStats } from "@/components/modem-stats"
import { DataUsage } from "@/components/data-usage"
import { useModemPing } from '../hooks/usePingModem';
import { useModemSignalStrength } from '@/hooks/useModemSignalStrength';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";


// Mock data - will be replaced with real data where available
const mockModemData = {
  status: "online",
  uptime: "3 days, 7 hours",
  ipAddress: "192.168.1.1",
  macAddress: "00:1A:2B:3C:4D:5E",
  model: "Netgear CM1000",
  firmwareVersion: "V1.3.1.0",
  downloadSpeed: 235.6, // Mbps
  uploadSpeed: 15.2, // Mbps
  signalStrength: 92, // percentage
  connectedDevices: 7,
}

export default function ModemDashboard() {
  const [modemData, setModemData] = useState(mockModemData)
  const [loading, setLoading] = useState(true)
  const { latency, loading: pingLoading, refresh: refreshPing } = useModemPing()
  const { signalStrength, error } = useModemSignalStrength();


  // Simulate fetching data
  useEffect(() => {
    const fetchData = () => {
      setLoading(true)
      setTimeout(() => {
        setModemData((prev) => ({
          ...prev,
          downloadSpeed: +(prev.downloadSpeed + (Math.random() * 10 - 5)).toFixed(1),
          uploadSpeed: +(prev.uploadSpeed + (Math.random() * 2 - 1)).toFixed(1),
          signalStrength: Math.max(60, Math.min(100, Math.floor(prev.signalStrength + (Math.random() * 4 - 2)))),
        }))
        setLoading(false)
      }, 1000)
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    await Promise.all([
      refreshPing(),
      new Promise(resolve => {
        setTimeout(() => {
          setModemData((prev) => ({
            ...prev,
            downloadSpeed: +(prev.downloadSpeed + (Math.random() * 15 - 5)).toFixed(1),
            uploadSpeed: +(prev.uploadSpeed + (Math.random() * 3 - 1)).toFixed(1),
            signalStrength: Math.max(60, Math.min(100, Math.floor(prev.signalStrength + (Math.random() * 6 - 3)))),
          }))
          resolve(null)
        }, 1000)
      })
    ])
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ping Latency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pingLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                latency ? `${latency} ms` : "N/A"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {pingLoading ? "Measuring..." : "Network response time"}
            </p>
          </CardContent>
        </Card>
        
        {/* Signal Strength Card */}
        <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Signal Strength</CardTitle>
        <Wifi className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-6 w-full" />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : signalStrength ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* Signal Bars (Visual Indicator) */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-1 rounded-full ${
                      i < signalStrength.signalBars
                        ? 'bg-green-500'  // Active bars
                        : 'bg-gray-200'   // Inactive bars
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">
                {signalStrength.signalBars}/5 bars
              </span>
            </div>
            <div className="text-sm">
              {signalStrength.signalLevel} dBm
            </div>
            <Badge
              variant={
                signalStrength.signalLevel > -80 ? 'default' :   // Excellent
                signalStrength.signalLevel > -100 ? 'secondary' : // Good
                'destructive'                                    // Poor
              }
            >
              {signalStrength.constellationVisible ? 'Connected' : 'No Signal'}
            </Badge>
          </div>
        ) : (
          <div className="text-destructive">No signal data</div>
        )}
      </CardContent>
    </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System Metrics</TabsTrigger>
          <TabsTrigger value="data-usage">Data Usage</TabsTrigger>
          <TabsTrigger value="devices">Connected Devices</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <ModemStats
            data={{
              ...modemData,
              pingLatency: latency || 0 // Use real latency or fallback to 0
            }}
            loading={loading || pingLoading}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        <TabsContent value="system" className="space-y-4">
          <SystemMetrics />
        </TabsContent>
        <TabsContent value="data-usage" className="space-y-4">
          <DataUsage />
        </TabsContent>
        <TabsContent value="devices" className="space-y-4">
          <DevicesList connectedDevices={modemData.connectedDevices} />
        </TabsContent>
      </Tabs>
    </div>
  )
}