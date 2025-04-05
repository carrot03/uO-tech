export interface ModemResponse<T> {
    status: number;
    data: T;
    timestamp: string;
  }
  
  export interface HwInfo {
    hw_version: string;
    serial_number: string;
    imei: string;
    pa_temp: number;
    board_temp: number;
  }
  
  export interface GnssPosition {
    fix: boolean;
    latitude: number;
    longitude: number;
    altitude: number;
  }
  
  export interface ConstellationState {
    constellation_visible: boolean;
    signal_bars: number;
    signal_level: number;
  }
  
  export interface ModemBasicInfo {
    status: 'online' | 'offline' | 'booting' | string;
    uptime: string;
    ipAddress: string;
    macAddress: string;
    model: string;
    firmwareVersion: string;
    downloadSpeed?: number;
    uploadSpeed?: number;
    pingLatency?: number;
    signalStrength?: number;
    connectedDevices?: number;
    
    // Add these from your GET commands
    constellationState?: {
      constellation_visible: boolean;
      signal_bars: number;
      signal_level: number;
    };
    hwInfo?: {
      hw_version: string;
      serial_number: string;
      imei: string;
      pa_temp: number;
      board_temp: number;
    };
    gnssPosition?: {
      fix: boolean;
      latitude: number;
      longitude: number;
      altitude: number;
    };
  }

  export interface BandwidthInfo {
    downloadSpeed: number; // in Mbps
    uploadSpeed: number;   // in Mbps
    timestamp: string;
  }