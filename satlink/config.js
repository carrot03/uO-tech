// config.js
const config = {
    mqttBroker: 'ws://10.1.1.252:1883/mqtt',
    mqttTestTopic: 'test/topic',
    mqttModemInfoTopic: 'modem/info',
    mqttHardwareTopic: 'modem/info',
    mqttPingLatencyTopic: 'ping',
    mqttSignalStrengthTopic: 'signal',
    MODEMCOMMANDSHT: "modem/commands/#",
    MODEMRESPONSESHT: "modem/responses/#",
    MODEMCOMMANDS: "modem/commands",
    MODEMRESPONSES: "modem/responses",
  };
  
  export default config;
  // Set this to false to use real modem data
export const USE_MOCK_SIGNAL_STRENGTH = true;
export const USE_MOCK_PING_LATENCY = true;