import { useState, useEffect, useCallback } from 'react';
import { ModemClient } from '@/services/modemClient';
import { USE_MOCK_PING_LATENCY } from '../../config'; // Optional mock flag

interface PingResult {
  latency: number | null;  // in milliseconds
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useModemPing(pollInterval = 10000): PingResult {
  const [latency, setLatency] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data generator
  const generateMockPing = useCallback((): number => {
    // Base latency with small random fluctuations
    const baseLatency = 25 + Math.random() * 10; // 25-35ms
    // Occasionally simulate latency spikes (20% chance)
    return Math.random() > 0.8 ? baseLatency * 3 : baseLatency;
  }, []);

  // Real ping measurement
  const measureRealPing = useCallback(async (): Promise<number> => {
    const modem = new ModemClient();
    const startTime = Date.now();
    
    try {
      await modem.sendCommand('GET', 'operationalState');
      return Date.now() - startTime;
    } catch (err) {
      throw new Error('Failed to measure ping');
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const measuredLatency = USE_MOCK_PING_LATENCY
        ? generateMockPing()
        : await measureRealPing();
      setLatency(measuredLatency);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLatency(null);
    } finally {
      setLoading(false);
    }
  }, [measureRealPing, generateMockPing]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, pollInterval);
    return () => clearInterval(interval);
  }, [refresh, pollInterval]);

  return {
    latency,
    loading,
    error,
    refresh
  };
}