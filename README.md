# uO-tech

# Iridium Certus 9770 JSPR Commands Reference

## GET Requests

### 1. apiVersion
**Request:**  
```json
GET apiVersion {}

200 apiVersion {
  "supported_versions": [
    {"major": 1, "minor": 2, "patch": 0},
    {"major": 1, "minor": 1, "patch": 0}
  ],
  "active_version": {"major": 1, "minor": 2, "patch": 0}
}

GET serialPortConfig {}
200 serialPortConfig {
  "port": "b",
  "enabled": true,
  "baud": 230400
}

GET simConfig {}
200 simConfig {
  "interface": "local"
}

GET radioConfig {}
200 radioConfig {
  "tx_power_reduction": 0,
  "tx_ind_lead_time": 10,
  "tx_ind_lag_time": 10
}

GET gnssPosition {}
200 gnssPosition {
  "fix": true,
  "latitude": 45.0,
  "longitude": -75.0,
  "altitude": 100,
  "late_responses": 0
}

GET operationalState {}
200 operationalState {
  "state": "active",
  "reason": 0
}

GET hwTestReport {}
200 hwTestReport {
  "passed": true,
  "warnings": 0,
  "report": "All tests passed"
}
GET rfTestReport {}
200 rfTestReport {
  "report": [-110, -108, ...] // Array of 252 RSSI values
}

GET hwinfo {}
200 hwinfo {
  "hw_version": "1.0",
  "serial_number": "SN12345",
  "imei": "123456789012345",
  "pa_temp": 25,
  "board_temp": 30
}

GET constellationState {}
200 constellationState {
  "constellation_visible": true,
  "signal_bars": 5,
  "signal_level": -108
}

GET provisioningStatus {}
200 provisioningStatus {
  "provisioning_valid": true,
  "fully_compatible": true,
  "voice": true,
  "packet_data": true,
  "messaging": true
}

GET packetDataServiceProvisioning {}
200 packetDataServiceProvisioning {
  "packet_data_services": [
    {
      "service": "postpaid",
      "gw_subnet": "0.0.0.0/0",
      "dial_string": "*99#"
    }
  ]
}

GET simStatus {}
200 simStatus {
  "card_present": true,
  "sim_connected": true,
  "iccid": "8931080012345678901"
}

GET firmware {"slot": "primary"}
200 firmware {
  "slot": "primary",
  "validity": true,
  "version": {"major": 1, "minor": 2, "patch": 0},
  "hash": "a1b2c3d4e5f6"
}

GET voiceProvisioning {}
200 voiceProvisioning {
  "line": [
    {
      "line_type": "post-paid",
      "msisdn": "1234567890",
      "channel": "line1"
    }
  ]
}

GET callAgent {"channel": "line1"}

200 callAgent {
  "channel": "line1",
  "state": "idle"
}

GET messageOriginateQueue {"report": "status"}

200 messageOriginateQueue {
  "status": [
    {
      "topic_id": 64,
      "queue_length": 2,
      "status": [
        {"message_id": 1, "status": "queued"},
        {"message_id": 2, "status": "transferring"}
      ]
    }
  ]
}

GET messageProvisioning {}
200 messageProvisioning {
  "provisioning": [
    {
      "topic_id": 64,
      "topic_name": "weather",
      "priority": "high",
      "discard_time_seconds": 3600,
      "max_queue_depth": 10
    }
  ]
}

GET powerManagement {}
200 powerManagement {
  "interface_mode": "always_on"
}

GET hwTestReport {}
200 hwTestReport {
  "passed": true,
  "warnings": 0,
  "report": "All tests passed"
}

GET rfTestReport {}
200 rfTestReport {
  "report": [-110, -108, ...] // Array of 252 RSSI values
}

GET hwinfo {}
200 hwinfo {
  "hw_version": "1.0",
  "serial_number": "SN12345",
  "imei": "123456789012345",
  "pa_temp": 25,
  "board_temp": 30
}

GET constellationState {}
200 constellationState {
  "constellation_visible": true,
  "signal_bars": 5,
  "signal_level": -108
}

GET provisioningStatus {}
200 provisioningStatus {
  "provisioning_valid": true,
  "fully_compatible": true,
  "voice": true,
  "packet_data": true,
  "messaging": true
}

GET packetDataServiceProvisioning {}
200 packetDataServiceProvisioning {
  "packet_data_services": [
    {
      "service": "postpaid",
      "gw_subnet": "0.0.0.0/0",
      "dial_string": "*99#"
    }
  ]
}

GET simStatus {}
200 simStatus {
  "card_present": true,
  "sim_connected": true,
  "iccid": "8931080012345678901"
}

GET firmware {"slot": "primary"}
200 firmware {
  "slot": "primary",
  "validity": true,
  "version": {"major": 1, "minor": 2, "patch": 0},
  "hash": "a1b2c3d4e5f6"
}

GET voiceProvisioning {}
200 voiceProvisioning {
  "line": [
    {
      "line_type": "post-paid",
      "msisdn": "1234567890",
      "channel": "line1"
    }
  ]
}

GET callAgent {"channel": "line1"}
200 callAgent {
  "channel": "line1",
  "state": "idle"
}

GET messageOriginateQueue {"report": "status"}
200 messageOriginateQueue {
  "status": [
    {
      "topic_id": 64,
      "queue_length": 2,
      "status": [
        {"message_id": 1, "status": "queued"},
        {"message_id": 2, "status": "transferring"}
      ]
    }
  ]
}

GET messageProvisioning {}
200 messageProvisioning {
  "provisioning": [
    {
      "topic_id": 64,
      "topic_name": "weather",
      "priority": "high",
      "discard_time_seconds": 3600,
      "max_queue_depth": 10
    }
  ]
}

GET powerManagement {}
200 powerManagement {
  "interface_mode": "always_on"
}


```
## PUT Requests

### 1. apiVersion
**Request:**  
```json

PUT apiVersion {"active_version": {"major": 1, "minor": 2, "patch": 0}}
200 apiVersion {
  "active_version": {"major": 1, "minor": 2, "patch": 0}
}

PUT serialPortConfig {"port": "b", "enabled": true, "baud": 230400}
200 serialPortConfig {
  "port": "b",
  "enabled": true,
  "baud": 230400
}

PUT simConfig {"interface": "local"}
200 simConfig {
  "interface": "local"
}

PUT radioConfig {"tx_power_reduction": 0, "tx_ind_lead_time": 10, "tx_ind_lag_time": 10}
200 radioConfig {
  "tx_power_reduction": 0,
  "tx_ind_lead_time": 10,
  "tx_ind_lag_time": 10
}

PUT gnssPosition {"fix": true, "latitude": 45.0, "longitude": -75.0, "altitude": 100}
200 gnssPosition {
  "fix": true,
  "latitude": 45.0,
  "longitude": -75.0,
  "altitude": 100
}

PUT operationalState {"state": "active"}
200 operationalState {
  "state": "active",
  "reason": 0
}




PUT apiVersion {"active_version": {"major": 1, "minor": 2, "patch": 0}}
200 apiVersion {
  "active_version": {"major": 1, "minor": 2, "patch": 0}
}

PUT serialPortConfig {"port": "b", "enabled": true, "baud": 230400}
200 serialPortConfig {
  "port": "b",
  "enabled": true,
  "baud": 230400
}

PUT simConfig {"interface": "local"}
200 simConfig {
  "interface": "local"
}

PUT radioConfig {"tx_power_reduction": 0, "tx_ind_lead_time": 10, "tx_ind_lag_time": 10}
200 radioConfig {
  "tx_power_reduction": 0,
  "tx_ind_lead_time": 10,
  "tx_ind_lag_time": 10
}

PUT gnssPosition {"fix": true, "latitude": 45.0, "longitude": -75.0, "altitude": 100}
200 gnssPosition {
  "fix": true,
  "latitude": 45.0,
  "longitude": -75.0,
  "altitude": 100
}

PUT operationalState {"state": "active"}
200 operationalState {
  "state": "active"
}

PUT firmware {"slot": "primary"}
200 firmware {}

PUT remoteSimState {"power": true, "state": "active"}
200 remoteSimState {}

PUT remoteSimInstruction {"command": "A0A40000", "data": "9000", "state": "active"}
200 remoteSimInstruction {}

PUT callAgent {"channel": "line1", "user_action": "dial", "dial_string": "1234567890"}
200 callAgent {
  "channel": "line1",
  "dial_string": "1234567890",
  "state": "dialing"
}

PUT keyPress {"channel": "line1", "key": "1"}
200 keyPress {}

PUT messageOriginate {"topic_id": 64, "message_length": 10, "request_reference": 1}
200 messageOriginate {
  "topic_id": 64,
  "request_reference": 1,
  "message_id": 1,
  "message_response": "message_accepted"
}

PUT messageOriginateSegment {"topic_id": 64, "message_id": 1, "segment_length": 10, "segment_start": 0, "data": "SGVsbG8="}
200 messageOriginateSegment {}

PUT messageOriginateStatus {"topic_id": 64, "message_id": 1, "action": "cancel"}
200 messageOriginateStatus {
  "topic_id": 64,
  "message_id": 1,
  "cancellation_response": "cancelling_message"
}

PUT powerManagement {"interface_mode": "hardware_flow_control"} 
200 powerManagement {
  "interface_mode": "hardware_flow_control"
}  

```