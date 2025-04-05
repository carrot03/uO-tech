import { useState, useEffect, useCallback } from 'react';
import { ModemClient } from '../services/modemClient';
import type { ModemResponse } from '@/types/modem';

export function useModemQuery<T>(command: string, params?: object) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const modem = new ModemClient();
      const response: ModemResponse<T> = await modem.sendCommand(
        'GET',
        command,
        params
      );
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }, [command, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}