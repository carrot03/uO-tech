"use client"

import { useState, useEffect } from "react"
import { Laptop, Smartphone, Tv, Watch, Wifi } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import mqtt from 'mqtt'

// Mock data for connected devices (initially)
const mockDevices = [
  {
    id: 1,
    name: "Living Room TV",
    type: "tv",
    ipAddress: "192.168.1.101",
    macAddress: "AA:BB:CC:11:22:33",
    connected: true,
    lastSeen: "Now",
    bandwidth: "12.5 Mbps",
  },
  {
    id: 2,
    name: "John's Laptop",
    type: "laptop",
    ipAddress: "192.168.1.102",
    macAddress: "DD:EE:FF:44:55:66",
    connected: true,
    lastSeen: "Now",
    bandwidth: "45.2 Mbps",
  },
  {
    id: 3,
    name: "Sarah's Phone",
    type: "smartphone",
    ipAddress: "192.168.1.103",
    macAddress: "11:22:33:AA:BB:CC",
    connected: true,
    lastSeen: "Now",
    bandwidth: "8.7 Mbps",
  },
  {
    id: 4,
    name: "Smart Watch",
    type: "watch",
    ipAddress: "192.168.1.104",
    macAddress: "44:55:66:DD:EE:FF",
    connected: true,
    lastSeen: "Now",
    bandwidth: "0.3 Mbps",
  },
  {
    id: 5,
    name: "Office Laptop",
    type: "laptop",
    ipAddress: "192.168.1.105",
    macAddress: "66:77:88:99:AA:BB",
    connected: false,
    lastSeen: "2 hours ago",
    bandwidth: "0 Mbps",
  },
  {
    id: 6,
    name: "Kitchen Tablet",
    type: "smartphone",
    ipAddress: "192.168.1.106",
    macAddress: "CC:DD:EE:FF:11:22",
    connected: true,
    lastSeen: "Now",
    bandwidth: "2.1 Mbps",
  },
  {
    id: 7,
    name: "Smart Speaker",
    type: "other",
    ipAddress: "192.168.1.107",
    macAddress: "33:44:55:66:77:88",
    connected: true,
    lastSeen: "Now",
    bandwidth: "0.5 Mbps",
  },
]

interface DevicesListProps {
  connectedDevices: number
}

export function DevicesList({ connectedDevices }: DevicesListProps) {
  const [devices, setDevices] = useState(mockDevices)
  const [filter, setFilter] = useState<"all" | "connected" | "disconnected">("all")

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "tv":
        return <Tv className="h-4 w-4" />
      case "laptop":
        return <Laptop className="h-4 w-4" />
      case "smartphone":
        return <Smartphone className="h-4 w-4" />
      case "watch":
        return <Watch className="h-4 w-4" />
      default:
        return <Wifi className="h-4 w-4" />
    }
  }

  // Set up MQTT client and subscribe to device updates
  useEffect(() => {
    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt')

    client.on('connect', () => {
      console.log('Connected to MQTT broker')
      client.subscribe('devices/topic', (err) => {
        if (!err) {
          console.log('Subscribed to devices/topic')
        } else {
          console.log('Error subscribing: ', err)
        }
      })
    })

    // Handle incoming MQTT messages to update devices data
    client.on('message', (topic, message) => {
      const updatedDevice = JSON.parse(message.toString())
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.id === updatedDevice.id
            ? { ...device, ...updatedDevice }
            : device
        )
      )
    })

    // Clean up on component unmount
    return () => {
      client.end()
    }
  }, [])

  // Filter devices based on connection status
  const filteredDevices = devices.filter((device) => {
    if (filter === "all") return true
    if (filter === "connected") return device.connected
    return !device.connected
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Connected Devices</CardTitle>
            <CardDescription>{connectedDevices} devices currently connected to your network</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("all")}
            >
              All
            </Badge>
            <Badge
              variant={filter === "connected" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("connected")}
            >
              Connected
            </Badge>
            <Badge
              variant={filter === "disconnected" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("disconnected")}
            >
              Disconnected
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Last Seen</TableHead>
                <TableHead className="hidden md:table-cell">Bandwidth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <span>{device.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{device.ipAddress}</TableCell>
                  <TableCell>
                    <Badge variant={device.connected ? "default" : "secondary"}>
                      {device.connected ? "Online" : "Offline"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{device.lastSeen}</TableCell>
                  <TableCell className="hidden md:table-cell">{device.bandwidth}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
