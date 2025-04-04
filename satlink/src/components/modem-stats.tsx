"use client"

import { useCallback, useState, useEffect } from "react"
import mqtt from "mqtt"
import { Wifi, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface ModemStatsProps {
  loading: boolean
  onRefresh?: () => void
}

export function ModemStats({ loading, onRefresh }: ModemStatsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [data, setData] = useState({
    status: "offline",
    uptime: "0d 0h 0m",
    ipAddress: "0.0.0.0",
    connection: "Disconnected",
    macAddress: "00:00:00:00:00:00",
    model: "N/A",
    firmwareVersion: "N/A",
    pingLatency: 0,
    signalStrength: 0,
    connectedDevices: 0,
  })

  useEffect(() => {
    // Connect to MQTT broker
    const client = mqtt.connect("ws://your-mqtt-broker-url:port")

    // Subscribe to a single topic for all modem stats
    const topic = "modem/stats"

    // Subscribe to the topic
    client.on("connect", () => {
      client.subscribe(topic)
    })

    // Handle incoming MQTT messages
    client.on("message", (topic, message) => {
      if (topic === "modem/stats") {
        // Parse the received message and update the state
        const parsedMessage = JSON.parse(message.toString())

        setData(prevData => ({
          ...prevData,
          status: parsedMessage.status || prevData.status,
          uptime: parsedMessage.uptime || prevData.uptime,
          ipAddress: parsedMessage.ipAddress || prevData.ipAddress,
          connection: parsedMessage.connection || prevData.connection,
          macAddress: parsedMessage.macAddress || prevData.macAddress,
          model: parsedMessage.model || prevData.model,
          firmwareVersion: parsedMessage.firmwareVersion || prevData.firmwareVersion,
          pingLatency: parsedMessage.pingLatency || prevData.pingLatency,
          signalStrength: parsedMessage.signalStrength || prevData.signalStrength,
          connectedDevices: parsedMessage.connectedDevices || prevData.connectedDevices,
        }))
      }
    })

    // Cleanup MQTT client when the component is unmounted
    return () => {
      client.end()
    }
  }, [])

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
