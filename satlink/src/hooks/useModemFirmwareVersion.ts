// hooks/useModemFirmwareVersion.ts
import { useEffect, useState } from "react";
import { ModemClient } from "../services/modemClient";

interface FirmwareData {
  version: string;
}

export function useModemFirmwareVersion() {
  const [data, setData] = useState<FirmwareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFirmwareVersion = async () => {
    try {
      setLoading(true);
      setError(null);

      const modem = new ModemClient();
      const response = await modem.sendCommand(
        'GET',
        'firmwareVersion'
      );

      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch firmware version");
      console.error("Firmware fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirmwareVersion();
  }, []);

  return { data, loading, error, refresh: fetchFirmwareVersion };
}
