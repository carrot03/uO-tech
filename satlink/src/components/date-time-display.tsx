"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState<string>("")
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    // Function to update the date and time
    const updateDateTime = () => {
      const now = new Date()
      setDateTime(now.toLocaleString())
      setTime(now.toLocaleTimeString()) // Ensure consistent rendering
    }

    // Update initially
    updateDateTime()

    // Update every second
    const interval = setInterval(updateDateTime, 1000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <Clock className="h-4 w-4" />
      <span className="hidden sm:inline">{dateTime}</span>
      <span className="sm:hidden">{time}</span> {/* Prevent mismatch */}
    </div>
  )
}
