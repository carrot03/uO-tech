"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

// Generate mock data for hardware metrics
const generateHardwareData = () => {
  const data = []
  const now = new Date()

  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000) // 1 minute intervals

    // Generate realistic values with small variations
    const voltage = Number.parseFloat((12 + Math.random() * 0.4 - 0.2).toFixed(2)) // Around 12V
    const current = Number.parseFloat((0.8 + Math.random() * 0.3).toFixed(2)) // 0.8-1.1A
    const temperature = Number.parseFloat((42 + Math.random() * 5 - 2).toFixed(1)) // 40-47°C

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      voltage,
      current,
      temperature,
    })
  }

  return data
}

export function SystemMetrics() {
  const [bandwidthData, setBandwidthData] = useState(generateBandwidthData())
  const [hardwareData, setHardwareData] = useState(generateHardwareData())

  // Update data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      // Update bandwidth data
      setBandwidthData((prev) => {
        const newData = [...prev.slice(1)]
        newData.push({
          time: timeString,
          download: Number.parseFloat((230 + Math.random() * 30).toFixed(1)),
          upload: Number.parseFloat((15 + Math.random() * 5).toFixed(1)),
        })
        return newData
      })

      // Update hardware data
      setHardwareData((prev) => {
        const newData = [...prev.slice(1)]
        newData.push({
          time: timeString,
          voltage: Number.parseFloat((12 + Math.random() * 0.4 - 0.2).toFixed(2)),
          current: Number.parseFloat((0.8 + Math.random() * 0.3).toFixed(2)),
          temperature: Number.parseFloat((42 + Math.random() * 5 - 2).toFixed(1)),
        })
        return newData
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
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
            <div className="text-2xl font-bold">{latestHardware.voltage} V</div>
            <p className="text-xs text-muted-foreground">Power supply voltage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestHardware.current} A</div>
            <p className="text-xs text-muted-foreground">Power consumption</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestHardware.temperature} °C</div>
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
                  <LineChart
                    data={hardwareData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 10,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} tickMargin={10} />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      domain={[11, 13]}
                      label={{
                        value: "Voltage",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                        offset: -5,
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      domain={[0, 2]}
                      label={{
                        value: "Current",
                        angle: 90,
                        position: "insideRight",
                        style: { textAnchor: "middle" },
                        offset: 5,
                      }}
                    />
                    <YAxis yAxisId="temp" orientation="right" tick={{ fontSize: 12 }} domain={[30, 60]} hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ paddingTop: 10, bottom: 0 }} />
                    <Line yAxisId="left" type="monotone" dataKey="voltage" stroke="hsl(210, 100%, 50%)" dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="current" stroke="hsl(210, 100%, 70%)" dot={false} />
                    <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="hsl(0, 100%, 65%)" dot={false} />
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

