"use client"

import { useEffect, useState } from "react"
import mqtt from "mqtt"
import { Calendar, HardDrive, WifiIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Initial mock data (will be updated from MQTT)
const initialWan = {
  id: "wan1",
  name: "Primary WAN",
  type: "wireless",
  ipAddress: "203.0.113.45",
  macAddress: "AA:BB:CC:11:22:33",
  dataUsed: 345.8, // GB
  dataLimit: 1024, // GB
  billingCycleStart: "2025-03-15",
  billingCycleEnd: "2025-04-14",
  dailyUsage: [
    { date: "2025-03-15", download: 12.3, upload: 1.8 },
    { date: "2025-03-16", download: 15.7, upload: 2.1 },
    // ... more daily data ...
  ],
}

export function DataUsage() {
  const [wanData, setWanData] = useState(initialWan)

  useEffect(() => {
    // Connect to MQTT broker
    const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt")

    // MQTT topics to subscribe to
    const topics = ["wan1/dataUsed", "wan1/dailyUsage"]

    // Subscribe to topics
    client.on("connect", () => {
      topics.forEach(topic => client.subscribe(topic))
    })

    // Handle incoming messages
    client.on("message", (topic, message) => {
      const parsedMessage = JSON.parse(message.toString())

      // Update state based on the topic
      if (topic === "wan1/dataUsed") {
        setWanData(prevState => ({
          ...prevState,
          dataUsed: parsedMessage.dataUsed,
        }))
      }

      if (topic === "wan1/dailyUsage") {
        setWanData(prevState => ({
          ...prevState,
          dailyUsage: parsedMessage.dailyUsage,
        }))
      }
    })

    // Clean up on component unmount
    return () => {
      client.end()
    }
  }, [])

  // Calculate days remaining in billing cycle
  const today = new Date()
  const endDate = new Date(wanData.billingCycleEnd)
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  // Calculate usage percentage
  const usagePercentage = (wanData.dataUsed / wanData.dataLimit) * 100

  // Calculate total download and upload
  const totalDownload = wanData.dailyUsage.reduce((sum, day) => sum + day.download, 0)
  const totalUpload = wanData.dailyUsage.reduce((sum, day) => sum + day.upload, 0)

  // Format data sizes
  const formatDataSize = (sizeInGB: number) => {
    if (sizeInGB >= 1000) {
      return `${(sizeInGB / 1000).toFixed(2)} TB`
    }
    return `${sizeInGB.toFixed(1)} GB`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">Primary WAN Data Usage</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDataSize(wanData.dataUsed)}</div>
            <p className="text-xs text-muted-foreground">of {formatDataSize(wanData.dataLimit)} limit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Download</CardTitle>
            <WifiIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDataSize(totalDownload)}</div>
            <p className="text-xs text-muted-foreground">Total downloaded this period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upload</CardTitle>
            <WifiIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDataSize(totalUpload)}</div>
            <p className="text-xs text-muted-foreground">Total uploaded this period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billing Cycle</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysRemaining} days</div>
            <p className="text-xs text-muted-foreground">Remaining in billing cycle</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Summary</CardTitle>
          <CardDescription>
            Billing period: {new Date(wanData.billingCycleStart).toLocaleDateString()} to{" "}
            {new Date(wanData.billingCycleEnd).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {formatDataSize(wanData.dataUsed)} of {formatDataSize(wanData.dataLimit)} used
              </div>
              <div className="text-sm font-medium">{usagePercentage.toFixed(1)}%</div>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>

          <div className="mt-6 space-y-1">
            <div className="text-sm font-medium">Connection Details</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-md border px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">Type</span>
                <span className="text-sm">{wanData.type}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">IP Address</span>
                <span className="text-sm">{wanData.ipAddress}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">MAC Address</span>
                <span className="text-sm">{wanData.macAddress}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">Daily Average</span>
                <span className="text-sm">
                  {formatDataSize(wanData.dataUsed / wanData.dailyUsage.length)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="text-xs text-red-600">Warning: Approaching data limit!</div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm">Date</th>
                  <th className="px-4 py-2 text-left text-sm">Download (GB)</th>
                  <th className="px-4 py-2 text-left text-sm">Upload (GB)</th>
                  <th className="px-4 py-2 text-left text-sm">Total (GB)</th>
                </tr>
              </thead>
              <tbody>
                {wanData.dailyUsage.map((day, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm">{day.date}</td>
                    <td className="px-4 py-2 text-sm">{day.download.toFixed(1)}</td>
                    <td className="px-4 py-2 text-sm">{day.upload.toFixed(1)}</td>
                    <td className="px-4 py-2 text-sm">
                      {(day.download + day.upload).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
