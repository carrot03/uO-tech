'use client';

import { useState, useEffect } from "react";
import ModemDashboard from "@/components/modem-dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import { DateTimeDisplay } from "@/components/date-time-display";
import { usePolling } from '../hooks/use-polling';
import { useModemQuery } from "../hooks/use-modem-query";
import {ModemBasicInfo} from "@/types/modem"

// Define the modem data type
type ModemData = {
  modemId: string;
  signalStrength: number;
  status: string;
  bandwidthUsage: string;
};

export default function Home() {
  const [modemData, setModemData] = useState<ModemData | null>(null); // State to hold modem data

  const { data, loading, refresh } = useModemQuery<ModemBasicInfo>('status');
  
  // Refresh critical data every 10 seconds
  usePolling(() => {
    refresh();
  }, 10000);
  
  interface MyComponentProps {
    data: ModemBasicInfo | null;
    loading: boolean;
    onRefresh: () => Promise<void>;
  }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Modem Monitor</h1>
        <div className="flex items-center gap-4">
          <DateTimeDisplay />
          <ThemeToggle />
        </div>
      </div>
      <ModemDashboard
      {...{
        data,
        loading,
        onRefresh: refresh
      } as any}
    />
      {/* <div>
        <h2>Modem Dashboard</h2>
        <button onClick={handleRequest} className="bg-blue-500 text-white p-2 rounded">
          Get Modem Data
        </button>
        {modemData && (
          <div>
            <h3>Modem Data</h3>
            <pre>{JSON.stringify(modemData, null, 2)}</pre>
          </div>
        )}
      </div> */}
    </main>
  );
}
