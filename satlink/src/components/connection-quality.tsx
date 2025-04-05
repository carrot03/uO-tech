"use client"

import { useEffect, useState } from "react"
import mqtt from "mqtt"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import config from '../../config';

// Interface to define the expected data structure
interface ConnectionQualityProps {
  signalStrength: number
  pingLatency: number
}


const brokerUrl = config.mqttBroker;
if (typeof brokerUrl !== 'string' || brokerUrl.trim() === '') {
  throw new Error("Missing or invalid MQTT broker URL");
}

export function ConnectionQuality() {
  const [signalStrength, setSignalStrength] = useState<number>(80) // Default mock data
  const [pingLatency, setPingLatency] = useState<number>(30) // Default mock data

  useEffect(() => {
    // Connect to MQTT broker
    const client = mqtt.connect(brokerUrl)

    // MQTT topics to subscribe to
    const topics = ["connection/signalStrength", "connection/pingLatency"]

    // Subscribe to topics
    client.on("connect", () => {
      topics.forEach(topic => client.subscribe(topic))
    })

    // Handle incoming messages
    client.on("message", (topic, message) => {
      const parsedMessage = JSON.parse(message.toString())

      // Update state based on the topic
      if (topic === "connection/signalStrength") {
        setSignalStrength(parsedMessage.signalStrength)
      }

      if (topic === "connection/pingLatency") {
        setPingLatency(parsedMessage.pingLatency)
      }
    })

    // Clean up on component unmount
    return () => {
      client.end()
    }
  }, [])

  // Determine connection quality based on signal strength and ping latency
  const getQualityText = () => {
    if (signalStrength > 90 && pingLatency < 20) return "Excellent"
    if (signalStrength > 75 && pingLatency < 40) return "Good"
    if (signalStrength > 60 && pingLatency < 60) return "Fair"
    return "Poor"
  }

  const getQualityColor = () => {
    const quality = getQualityText()
    switch (quality) {
      case "Excellent":
        return "bg-blue-500"
      case "Good":
        return "bg-blue-400"
      case "Fair":
        return "bg-yellow-500"
      case "Poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Quality</CardTitle>
        <CardDescription>Signal strength and connection stability</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Signal Strength</div>
            <div className="text-sm font-medium">{signalStrength}%</div>
          </div>
          <Progress value={signalStrength} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Ping Latency</div>
            <div className="text-sm font-medium">{pingLatency} ms</div>
          </div>
          <Progress value={100 - (pingLatency / 100) * 100} className="h-2" />
        </div>
        <div className="rounded-md border p-4">
          <div className="text-sm font-medium">Overall Quality</div>
          <div className="mt-2 flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${getQualityColor()}`} />
            <div className="text-lg font-semibold">{getQualityText()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
