# IoTron 📡

**IoT Device Management** - Register, communicate, monitor.

## Features

- **📝 Device Registry** - Register devices
- **💬 Commands** - Send commands
- **📊 Status** - Online/offline monitoring
- **🔄 Events** - Device events

## Installation

```bash
npm install iotron
```

## Usage

```typescript
import IoTron from 'iotron';

const iot = new IoTron();

// Register device
iot.register('device-001', 'Temperature Sensor');

// Send command
await iot.send('device-001', { action: 'read' });

// Check status
const status = iot.getStatus('device-001');
console.log(status); // 'online'
```

## Device States

```typescript
interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastSeen?: number;
}
```

## License

MIT
