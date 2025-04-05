import { useState, useEffect, useCallback } from 'react';
import { ModemClient } from '../services/modemClient';
import { USE_MOCK_SIGNAL_STRENGTH } from '../../config';

// Type definition for signal strength data
interface SignalStrengthData {
  signalLevel: number;  // in dBm (-120 to -30 typical)
  signalBars: number;   // 0-5
  constellationVisible: boolean;
}

export function useModemSignalStrength(pollInterval = 10000) {
  const [signalStrength, setSignalStrength] = useState<SignalStrengthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data generator
  const generateMockSignal = useCallback((): SignalStrengthData => {
    const baseSignal = -85 + (Math.random() * 20 - 10); // -95 to -75 dBm
    const simulatedDrop = Math.random() > 0.9 ? -115 : baseSignal;
    const bars = Math.min(5, Math.max(0, Math.floor((simulatedDrop + 120) / 30 * 5)));
    
    return {
      signalLevel: Math.round(simulatedDrop),
      signalBars: bars,
      constellationVisible: simulatedDrop > -110,
    };
  }, []);

  // Real data fetcher
  const fetchRealSignal = useCallback(async (): Promise<SignalStrengthData> => {
    try {
      const modem = new ModemClient();
      const response = await modem.sendCommand('GET', 'constellationState');
      return {
        signalLevel: response.data.signal_level,
        signalBars: response.data.signal_bars,
        constellationVisible: response.data.constellation_visible,
      };
    } catch (err) {
      throw new Error('Failed to fetch signal strength data');
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = USE_MOCK_SIGNAL_STRENGTH
        ? generateMockSignal()
        : await fetchRealSignal();
      setSignalStrength(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchRealSignal, generateMockSignal]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, pollInterval);
    return () => clearInterval(interval);
  }, [refresh, pollInterval]);

  return { 
    signalStrength, 
    loading, 
    error, 
    refresh 
  };
}