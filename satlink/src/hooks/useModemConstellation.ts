// hooks/useModemConstellation.ts
import { useEffect, useState } from "react";
import { ModemClient } from "../services/modemClient"; // Your ModemClient implementation

interface ConstellationData {
  constellation_visible: boolean;
  signal_bars: number;
  signal_level: number;
}

export function useModemConstellation() {
  const [data, setData] = useState<ConstellationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConstellation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const modem = new ModemClient();
      const response = await modem.sendCommand(
        'GET',
        'constellationState'
      );
      
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch constellation data");
      console.error("Constellation fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConstellation();
  }, []);

  return { data, loading, error, refresh: fetchConstellation };
}