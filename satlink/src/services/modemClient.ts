import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import { v4 as uuidv4 } from 'uuid';

// =====================
// Type Definitions
// =====================
export type ModemCommandAction = 'GET' | 'PUT' | 'POST' | 'DELETE';

export interface ModemCommandPayload {
  action: ModemCommandAction;
  path: string;
  params?: Record<string, any>;
  request_id: string;
  expected_code?: number;
}

export interface ModemResponse {
  status: number;
  data: any;
  timestamp: string;
}

export interface ModemError {
  code: number;
  message: string;
  details?: any;
}

// =====================
// Configuration
// =====================
const DEFAULT_CONFIG = {
  BROKER_URL: 'mqtt://10.1.1.252:1883',
  COMMAND_TOPIC: 'modem/commands',
  RESPONSE_TOPIC: 'modem/responses/#',
  ERROR_TOPIC: 'modem/errors',
  DEFAULT_TIMEOUT: 5000, // 5 seconds
};

// =====================
// Main Client Class
// =====================
export class ModemClient {
  private client: MqttClient;
  private pendingRequests: Map<string, { resolve: (value: any) => void; reject: (reason?: any) => void }>;
  private connected: boolean = false;

  constructor(config: Partial<typeof DEFAULT_CONFIG> = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    
    this.pendingRequests = new Map();
    this.client = mqtt.connect(finalConfig.BROKER_URL, this.getMqttOptions());
    
    this.setupEventListeners(finalConfig);
  }

  // =====================
  // Public Methods
  // =====================
  public async sendCommand(
    action: ModemCommandAction,
    path: string,
    params: Record<string, any> = {},
    timeout: number = DEFAULT_CONFIG.DEFAULT_TIMEOUT
  ): Promise<ModemResponse> {
    if (!this.connected) {
      throw new Error('MQTT client not connected');
    }

    const requestId = uuidv4();
    const command: ModemCommandPayload = {
      action,
      path,
      params,
      request_id: requestId,
      expected_code: 200,
    };

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`Request timed out after ${timeout}ms`));
      }, timeout);

      this.pendingRequests.set(requestId, {
        resolve: (response) => {
          clearTimeout(timeoutId);
          resolve(response);
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
      });

      this.client.publish(
        DEFAULT_CONFIG.COMMAND_TOPIC,
        JSON.stringify(command),
        { qos: 1 },
        (err) => {
          if (err) {
            this.pendingRequests.delete(requestId);
            reject(new Error(`Publish error: ${err.message}`));
          }
        }
      );
    });
  }

  public disconnect(): Promise<void> {
    return new Promise((resolve) => {
      this.client.end(false, () => {
        this.connected = false;
        resolve();
      });
    });
  }

  // =====================
  // Private Methods
  // =====================
  private getMqttOptions(): IClientOptions {
    return {
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    };
  }

  private setupEventListeners(config: typeof DEFAULT_CONFIG): void {
    this.client.on('connect', () => {
      this.connected = true;
      console.log('Connected to MQTT broker');
      this.client.subscribe(
        [config.RESPONSE_TOPIC, config.ERROR_TOPIC],
        { qos: 1 },
        (err) => {
          if (err) {
            console.error('Subscription error:', err);
          }
        }
      );
    });

    this.client.on('message', (topic, message) => {
      try {
        const parsed = JSON.parse(message.toString());
        
        if (topic.startsWith('modem/responses/')) {
          this.handleResponse(topic, parsed);
        } else if (topic === 'modem/errors') {
          this.handleError(parsed);
        }
      } catch (err) {
        console.error('Message parsing error:', err);
      }
    });

    this.client.on('error', (err) => {
      console.error('MQTT client error:', err);
    });

    this.client.on('close', () => {
      this.connected = false;
      console.log('Disconnected from MQTT broker');
    });
  }

  private handleResponse(topic: string, response: any): void {
    const requestId = topic.split('/')[2];
    const pendingRequest = this.pendingRequests.get(requestId);

    if (pendingRequest) {
      if (response.status >= 200 && response.status < 300) {
        pendingRequest.resolve(response);
      } else {
        pendingRequest.reject(response);
      }
      this.pendingRequests.delete(requestId);
    }
  }

  private handleError(error: ModemError): void {
    console.error('Modem error:', error);
    // Optionally reject all pending requests on critical errors
    if (error.code >= 500) {
      this.pendingRequests.forEach((request) => {
        request.reject(error);
      });
      this.pendingRequests.clear();
    }
  }
}

// =====================
// Utility Functions
// =====================
export function createModemClient(config?: Partial<typeof DEFAULT_CONFIG>): ModemClient {
  return new ModemClient(config);
}