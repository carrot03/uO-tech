"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Generate mock data for the bandwidth chart
const generateMockData = () => {
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

export function BandwidthChart() {
  const [data, setData] = useState(generateMockData())

  // Update data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...data.slice(1)]
      const now = new Date()

      newData.push({
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        download: Number.parseFloat((230 + Math.random() * 30).toFixed(1)),
        upload: Number.parseFloat((15 + Math.random() * 5).toFixed(1)),
      })

      setData(newData)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [data])

  return (
    <Card className="col-span-4">
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
              data={data}
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
  )
}

