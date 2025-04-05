// app/types/modem.ts

export interface ModemData {
    modemId: string,
    status: string;
    uptime: string;
    ipAddress: string;
    connection: string;
    macAddress: string;
    model: string;
    firmwareVersion: string;
    downloadSpeed: number;
    uploadSpeed: number;
    pingLatency: number;
    signalStrength: number;
    connectedDevices: number;
    bandwidthUsage: string
  }
  
  export interface ModemStatusData {
    status: string;
    reason?: number;
  }

export interface ModemStatsProps {
  data: ModemData;
  status: ModemStatusData;
  loading: boolean;
  onRefresh: () => void;
}

export interface ModemRequestPayload {
    request_id: string;
    action: string;
    path: string;
    params: {};
}

export interface modemStatusPayload {
    request_id: "status_fetch",
    action: "GET",
    path: "constellationState",
    params: {}
  }