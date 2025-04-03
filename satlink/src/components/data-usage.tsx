"use client"

import { Calendar, HardDrive, WifiIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Mock data for Primary WAN
const primaryWan = {
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
    { date: "2025-03-17", download: 10.2, upload: 1.5 },
    { date: "2025-03-18", download: 18.9, upload: 2.4 },
    { date: "2025-03-19", download: 14.5, upload: 1.9 },
    { date: "2025-03-20", download: 22.1, upload: 3.2 },
    { date: "2025-03-21", download: 25.8, upload: 3.5 },
    { date: "2025-03-22", download: 19.3, upload: 2.7 },
    { date: "2025-03-23", download: 16.4, upload: 2.2 },
    { date: "2025-03-24", download: 13.7, upload: 1.8 },
    { date: "2025-03-25", download: 17.9, upload: 2.3 },
    { date: "2025-03-26", download: 21.2, upload: 2.9 },
    { date: "2025-03-27", download: 18.6, upload: 2.5 },
    { date: "2025-03-28", download: 15.3, upload: 2.0 },
    { date: "2025-03-29", download: 14.1, upload: 1.9 },
    { date: "2025-03-30", download: 12.8, upload: 1.7 },
    { date: "2025-03-31", download: 16.5, upload: 2.2 },
    { date: "2025-04-01", download: 19.7, upload: 2.6 },
    { date: "2025-04-02", download: 22.3, upload: 3.0 },
    { date: "2025-04-03", download: 18.9, upload: 2.5 },
  ],
}

export function DataUsage() {
  // Calculate days remaining in billing cycle
  const today = new Date()
  const endDate = new Date(primaryWan.billingCycleEnd)
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  // Calculate usage percentage
  const usagePercentage = (primaryWan.dataUsed / primaryWan.dataLimit) * 100

  // Calculate total download and upload
  const totalDownload = primaryWan.dailyUsage.reduce((sum, day) => sum + day.download, 0)
  const totalUpload = primaryWan.dailyUsage.reduce((sum, day) => sum + day.upload, 0)

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
            <div className="text-2xl font-bold">{formatDataSize(primaryWan.dataUsed)}</div>
            <p className="text-xs text-muted-foreground">of {formatDataSize(primaryWan.dataLimit)} limit</p>
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
            Billing period: {new Date(primaryWan.billingCycleStart).toLocaleDateString()} to{" "}
            {new Date(primaryWan.billingCycleEnd).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {formatDataSize(primaryWan.dataUsed)} of {formatDataSize(primaryWan.dataLimit)} used
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
                <span className="text-sm">{primaryWan.type}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">IP Address</span>
                <span className="text-sm">{primaryWan.ipAddress}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">MAC Address</span>
                <span className="text-sm">{primaryWan.macAddress}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">Daily Average</span>
                <span className="text-sm">{formatDataSize(primaryWan.dataUsed / primaryWan.dailyUsage.length)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="text-xs text-muted-foreground">
            {usagePercentage > 90 ? (
              <span className="text-red-500 font-medium">Warning: You are approaching your data limit.</span>
            ) : usagePercentage > 75 ? (
              <span className="text-yellow-500 font-medium">Note: You have used over 75% of your data limit.</span>
            ) : (
              <span>Your data usage is within normal limits.</span>
            )}
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Usage Breakdown</CardTitle>
          <CardDescription>Last 20 days of activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium">Date</th>
                  <th className="text-right py-2 px-4 font-medium">Download</th>
                  <th className="text-right py-2 px-4 font-medium">Upload</th>
                  <th className="text-right py-2 px-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...primaryWan.dailyUsage].reverse().map((day) => (
                  <tr key={day.date} className="border-b">
                    <td className="py-2 px-4">{new Date(day.date).toLocaleDateString()}</td>
                    <td className="text-right py-2 px-4">{day.download.toFixed(1)} GB</td>
                    <td className="text-right py-2 px-4">{day.upload.toFixed(1)} GB</td>
                    <td className="text-right py-2 px-4 font-medium">{(day.download + day.upload).toFixed(1)} GB</td>
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

