import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ConnectionQualityProps {
  signalStrength: number
  pingLatency: number
}

export function ConnectionQuality({ signalStrength, pingLatency }: ConnectionQualityProps) {
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

