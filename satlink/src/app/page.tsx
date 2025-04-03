import ModemDashboard from "@/components/modem-dashboard"
import { ThemeToggle } from "@/components/theme-toggle"
import { DateTimeDisplay } from "@/components/date-time-display"

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Modem Monitor</h1>
        <div className="flex items-center gap-4">
          <DateTimeDisplay />
          <ThemeToggle />
        </div>
      </div>
      <ModemDashboard />
    </main>
  )
}

