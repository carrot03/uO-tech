import { useState, useEffect, useCallback } from 'react';
import { ModemClient } from '@/services/modemClient';
import { USE_MOCK_PING_LATENCY } from '../../config';

interface HwInfo {
  hwVersion: string | null;
  serialNumber: string | null;
  imei: string | null;
  paTemp: number | null;
  boardTemp: number | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useHWModem(pollInterval = 10000): HwInfo {
  const [hwVersion, setHwVersion] = useState<string | null>(null);
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [imei, setImei] = useState<string | null>(null);
  const [paTemp, setPaTemp] = useState<number | null>(null);
  const [boardTemp, setBoardTemp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data generator
  const generateMockData = useCallback(() => ({
    hwVersion: "1.0",
    serialNumber: "SN12345",
    imei: "123456789012345",
    paTemp: 25 + Math.floor(Math.random() * 10),
    boardTemp: 30 + Math.floor(Math.random() * 10)
  }), []);

  // Real data fetcher - now returns the full hardware info object
  const fetchRealData = useCallback(async () => {
    try {
      const modem = new ModemClient();
      const response = await modem.sendCommand('GET', 'hwinfo');
      
      return {
        hwVersion: response.data.hw_version,
        serialNumber: response.data.serial_number,
        imei: response.data.imei,
        paTemp: response.data.pa_temp,
        boardTemp: response.data.board_temp
      };
    } catch (err) {
      throw new Error('Failed to fetch hardware information');
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = USE_MOCK_PING_LATENCY 
        ? generateMockData()
        : await fetchRealData();

      setHwVersion(data.hwVersion);
      setSerialNumber(data.serialNumber);
      setImei(data.imei);
      setPaTemp(data.paTemp);
      setBoardTemp(data.boardTemp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHwVersion(null);
      setSerialNumber(null);
      setImei(null);
      setPaTemp(null);
      setBoardTemp(null);
    } finally {
      setLoading(false);
    }
  }, [fetchRealData, generateMockData]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, pollInterval);
    return () => clearInterval(interval);
  }, [refresh, pollInterval]);

  return {
    hwVersion,
    serialNumber,
    imei,
    paTemp,
    boardTemp,
    loading,
    error,
    refresh
  };
}