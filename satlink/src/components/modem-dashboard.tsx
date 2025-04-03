"use client"

import { useEffect, useState } from "react"
import { Activity, ArrowDown, ArrowUp, Signal } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SystemMetrics } from "@/components/system-metrics"
import { ConnectionQuality } from "@/components/connection-quality"
import { DevicesList } from "@/components/devices-list"
import { ModemStats } from "@/components/modem-stats"
import { DataUsage } from "@/components/data-usage"

// Mock data - in a real app, this would come from an API
const mockModemData = {
  status: "online",
  uptime: "3 days, 7 hours",
  ipAddress: "192.168.1.1",
  connection: "Satellite",
  macAddress: "00:1A:2B:3C:4D:5E",
  model: "Netgear CM1000",
  firmwareVersion: "V1.3.1.0",
  downloadSpeed: 235.6, // Mbps
  uploadSpeed: 15.2, // Mbps
  pingLatency: 18, // ms
  signalStrength: 92, // percentage
  connectedDevices: 7,
}

export default function ModemDashboard() {
  const [modemData, setModemData] = useState(mockModemData)
  const [loading, setLoading] = useState(true)

  // Simulate fetching data
  useEffect(() => {
    const fetchData = () => {
      // In a real app, this would be an API call
      setLoading(true)
      setTimeout(() => {
        // Simulate small changes in the data to make it look "live"
        setModemData((prev) => ({
          ...prev,
          downloadSpeed: +(prev.downloadSpeed + (Math.random() * 10 - 5)).toFixed(1),
          uploadSpeed: +(prev.uploadSpeed + (Math.random() * 2 - 1)).toFixed(1),
          pingLatency: Math.max(5, Math.min(100, Math.floor(prev.pingLatency + (Math.random() * 6 - 3)))),
          signalStrength: Math.max(60, Math.min(100, Math.floor(prev.signalStrength + (Math.random() * 4 - 2)))),
        }))
        setLoading(false)
      }, 1000)
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Download Speed</CardTitle>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modemData.downloadSpeed} Mbps</div>
            <p className="text-xs text-muted-foreground">Current download bandwidth</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upload Speed</CardTitle>
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modemData.uploadSpeed} Mbps</div>
            <p className="text-xs text-muted-foreground">Current upload bandwidth</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ping Latency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modemData.pingLatency} ms</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signal Strength</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modemData.signalStrength}%</div>
            <p className="text-xs text-muted-foreground">Connection quality</p>
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
            data={modemData}
            loading={loading}
            onRefresh={() => {
              setLoading(true)
              // Simulate fetching fresh data
              setTimeout(() => {
                setModemData((prev) => ({
                  ...prev,
                  downloadSpeed: +(prev.downloadSpeed + (Math.random() * 15 - 5)).toFixed(1),
                  uploadSpeed: +(prev.uploadSpeed + (Math.random() * 3 - 1)).toFixed(1),
                  pingLatency: Math.max(5, Math.min(100, Math.floor(prev.pingLatency + (Math.random() * 10 - 5)))),
                  signalStrength: Math.max(
                    60,
                    Math.min(100, Math.floor(prev.signalStrength + (Math.random() * 6 - 3))),
                  ),
                }))
                setLoading(false)
              }, 1000)
            }}
          />
          <ConnectionQuality signalStrength={modemData.signalStrength} pingLatency={modemData.pingLatency} />
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

