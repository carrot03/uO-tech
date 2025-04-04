"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import mqtt from "mqtt"

// Define types for hardware data
type HardwareData = {
  time: string;
  voltage: number;
  current: number;
  temperature: number;
}

// Generate mock data for the bandwidth chart
const generateBandwidthData = () => {
  const data = []
  const now = new Date()

  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000) // 1 minute intervals
    const downloadBase = 230 + Math.random() * 30
    const uploadBase = 15 + Math.random() * 5

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      download: Number.parseFloat(downloadBase.toFixed(1)),
      upload: Number.parseFloat(uploadBase.toFixed(1)),
    })
  }

  return data
}

export function SystemMetrics() {
  const [bandwidthData, setBandwidthData] = useState(generateBandwidthData())
  const [hardwareData, setHardwareData] = useState<HardwareData[]>([])

  useEffect(() => {
    // MQTT Client setup
    const client = mqtt.connect("ws://your-mqtt-broker-url:port") // Change the URL as needed
    const topic = "metrics/topic"

    client.on("connect", () => {
      console.log("Connected to MQTT broker")
      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Failed to subscribe to topic:", err)
        }
      })
    })

    client.on("message", (topic, message) => {
      const payload = JSON.parse(message.toString())

      // Process the received payload to update metrics
      if (payload.type === "bandwidth") {
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        setBandwidthData((prev) => {
          const newData = [...prev.slice(1)]
          newData.push({
            time,
            download: payload.download,
            upload: payload.upload,
          })
          return newData
        })
      } else if (payload.type === "hardware") {
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        setHardwareData((prev) => {
          const newData = [...prev.slice(1)]
          newData.push({
            time,
            voltage: payload.voltage,
            current: payload.current,
            temperature: payload.temperature,
          })
          return newData
        })
      }
    })

    return () => {
      client.end()
    }
  }, [])

  // Get the latest hardware values
  const latestHardware = hardwareData[hardwareData.length - 1]

  return (
    <div className="space-y-6">
      {/* Hardware metrics cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voltage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestHardware?.voltage} V</div>
            <p className="text-xs text-muted-foreground">Power supply voltage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestHardware?.current} A</div>
            <p className="text-xs text-muted-foreground">Power consumption</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestHardware?.temperature} °C</div>
            <p className="text-xs text-muted-foreground">Internal temperature</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="bandwidth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bandwidth">Bandwidth</TabsTrigger>
          <TabsTrigger value="hardware">Hardware Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="bandwidth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bandwidth Usage</CardTitle>
              <CardDescription>Download and upload speeds over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] pt-4 pb-6">
              <ChartContainer
                config={{
                  download: {
                    label: "Download",
                    color: "hsl(210, 100%, 50%)",
                  },
                  upload: {
                    label: "Upload",
                    color: "hsl(210, 100%, 70%)",
                  },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={bandwidthData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 10,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} tickMargin={10} />
                    <YAxis
                      label={{
                        value: "Mbps",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                        offset: -5,
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ paddingTop: 10, bottom: 0 }} />
                    <Area
                      type="monotone"
                      dataKey="download"
                      stroke="hsl(210, 100%, 50%)"
                      fill="hsl(210, 100%, 50%)"
                      fillOpacity={0.2}
                    />
                    <Area
                      type="monotone"
                      dataKey="upload"
                      stroke="hsl(210, 100%, 70%)"
                      fill="hsl(210, 100%, 70%)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hardware" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hardware Metrics</CardTitle>
              <CardDescription>Voltage, current, and temperature over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] pt-4 pb-6">
              <ChartContainer
                config={{
                  voltage: {
                    label: "Voltage (V)",
                    color: "hsl(210, 100%, 50%)",
                  },
                  current: {
                    label: "Current (A)",
                    color: "hsl(210, 100%, 70%)",
                  },
                  temperature: {
                    label: "Temperature (°C)",
                    color: "hsl(0, 100%, 65%)",
                  },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hardwareData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} tickMargin={10} />
                    <YAxis
                      label={{
                        value: "Units",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                        offset: -5,
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ paddingTop: 10, bottom: 0 }} />
                    <Line
                      type="monotone"
                      dataKey="voltage"
                      stroke="hsl(210, 100%, 50%)"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="current"
                      stroke="hsl(210, 100%, 70%)"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="hsl(0, 100%, 65%)"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
