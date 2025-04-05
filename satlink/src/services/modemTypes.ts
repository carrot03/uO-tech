// modemTypes.ts
export type ModemStatusPayload = {
    downloadSpeed?: number;
    uploadSpeed?: number;
    pingLatency?: number;
    signalStrength?: number;
    connectedDevices?: number;
  };
  
  export type ModemCommand = {
    action: 'GET' | 'PUT' | 'POST' | 'DELETE';
    path: string;
    params?: Record<string, any>;
  };