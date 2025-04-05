import { useEffect } from 'react';

export function usePolling(callback: () => void, interval: number) {
  useEffect(() => {
    const timer = setInterval(callback, interval);
    return () => clearInterval(timer);
  }, [callback, interval]);
}