import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ModemData } from "../interfaces/modem"; 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const generateDummyModemData = (): ModemData => {
  return {
  modemId: `modem-${Math.floor(Math.random() * 10000)}`,
  signalStrength: Math.floor(Math.random() * 100), // 0 - 100
  status: Math.random() > 0.5 ? "Online" : "Offline",
  bandwidthUsage: (Math.random() * 100).toFixed(2) + " Mbps",
  uptime: "",
  ipAddress: "",
  connection: "",
  macAddress: "",
  model: "",
  firmwareVersion: "",
  downloadSpeed: 0,
  uploadSpeed: 0,
  pingLatency: 0,
  connectedDevices: 0,
};
};
