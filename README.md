# IoTron 📡

> A lightweight, type-safe IoT Device Management library for Node.js and modern JavaScript/TypeScript applications.

[![npm version](https://img.shields.io/npm/v/iotron)](https://www.npmjs.com/package/iotron)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

IoTron provides a simple yet powerful API for managing Internet of Things (IoT) devices. Register devices, send commands, monitor status, and handle events with a clean, intuitive interface designed for both prototyping and production use.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [Basic Device Management](#basic-device-management)
  - [Advanced Configuration](#advanced-configuration)
  - [Real-time Monitoring](#real-time-monitoring)
  - [Batch Operations](#batch-operations)
- [API Reference](#api-reference)
  - [IoTron Class](#iotron-class)
  - [Device Interface](#device-interface)
  - [DeviceStatus Type](#devicestatus-type)
  - [CommandOptions Interface](#commandoptions-interface)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

### 🔌 Core Features

- **Device Registry** - Register and unregister IoT devices with unique identifiers
- **Command Dispatch** - Send commands to individual or multiple devices
- **Status Monitoring** - Track online/offline status of all registered devices
- **Event System** - Subscribe to device lifecycle events (connect, disconnect, error)
- **TypeScript Support** - Full type definitions included out of the box

### 🚀 Developer Experience

- **Zero Dependencies** - Lightweight with no external runtime dependencies
- **ESM & CJS** - Supports both ES Modules and CommonJS
- **Tree-Shakeable** - Import only what you need
- **Promise-based** - Modern async/await API
- **Debug Mode** - Built-in logging for development

### 🛡️ Reliability

- **Validated Inputs** - All methods validate inputs before processing
- **Error Handling** - Comprehensive error messages with actionable feedback
- **Graceful Degradation** - Handles edge cases without crashing
- **Memory Efficient** - Uses Map-based storage for O(1) lookups

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm, yarn, pnpm, or bun

### Package Managers

```bash
# npm
npm install iotron

# yarn
yarn add iotron

# pnpm
pnpm add iotron

# bun
bun add iotron
```

### CDN / Browser

```html
<!-- Via ESM.sh -->
<script type="module">
  import { IoTron } from 'https://esm.sh/iotron';
</script>
```

## Quick Start

```typescript
import IoTron from 'iotron';

// Initialize the IoT manager
const iot = new IoTron();

// Register your first device
iot.register('sensor-001', 'Living Room Temperature Sensor');

// Check device status
const status = iot.getStatus('sensor-001');
console.log(`Device status: ${status}`); // "online"

// Send a command to the device
iot.send('sensor-001', 'read');

// Remove a device when done
iot.unregister('sensor-001');
```

## Usage Examples

### Basic Device Management

```typescript
import IoTron, { Device, DeviceStatus } from 'iotron';

const iot = new IoTron();

// Register multiple devices at once
const devices = [
  { id: 'temp-001', name: 'Kitchen Thermometer' },
  { id: 'temp-002', name: 'Bedroom Thermometer' },
  { id: 'humid-001', name: 'Bathroom Humidity Sensor' },
  { id: 'light-001', name: 'Living Room Smart Bulb' },
  { id: 'lock-001', name: 'Front Door Smart Lock' },
];

// Batch registration
devices.forEach(({ id, name }) => {
  iot.register(id, name);
  console.log(`Registered: ${name} (${id})`);
});

// Get status of a specific device
const thermostatStatus = iot.getStatus('temp-001');
console.log(`Thermostat is ${thermostatStatus}`);

// Unregister a device
iot.unregister('temp-002');
console.log('Removed bedroom thermometer from registry');

// Verify removal
const removedStatus = iot.getStatus('temp-002');
console.log(`Status after removal: ${removedStatus}`); // "offline"
```

### Advanced Configuration

```typescript
import IoTron from 'iotron';

// Create IoTron instance with options
const iot = new IoTron({
  // Enable debug logging (logs all operations to console)
  debug: true,
  
  // Custom device status (future: persistence, etc.)
  autoReconnect: true,
  reconnectInterval: 5000,
});

// Register a device with metadata
iot.register('drone-001', 'Delivery Drone Alpha');

// Send a complex command with parameters
iot.send('drone-001', JSON.stringify({
  action: 'navigate',
  target: { lat: 37.7749, lng: -122.4194 },
  altitude: 100,
  speed: 15,
}));

// Conditional operations based on device status
function controlDevice(deviceId: string, command: string) {
  const status = iot.getStatus(deviceId);
  
  if (status === 'online') {
    console.log(`Sending command to ${deviceId}: ${command}`);
    iot.send(deviceId, command);
    return true;
  } else {
    console.warn(`Device ${deviceId} is offline. Command queued.`);
    return false;
  }
}

// Control multiple devices
const commands = ['start', 'calibrate', 'report'];
commands.forEach(cmd => controlDevice('drone-001', cmd));
```

### Real-time Monitoring

```typescript
import IoTron from 'iotron';

const iot = new IoTron();

// Simulate a monitoring dashboard
class DeviceMonitor {
  private iot: InstanceType<typeof IoTron>;
  private refreshInterval: NodeJS.Timeout | null = null;
  
  constructor(iotInstance: InstanceType<typeof IoTron>) {
    this.iot = iotInstance;
  }
  
  // Register devices with initial status
  initializeDevices() {
    const deviceList = [
      ['sensor-hub-01', 'Main Sensor Hub'],
      ['camera-01', 'Front Porch Camera'],
      ['thermostat-01', 'Smart Thermostat'],
      ['motion-001', 'Backyard Motion Detector'],
      ['smoke-001', 'Kitchen Smoke Detector'],
    ];
    
    deviceList.forEach(([id, name]) => {
      this.iot.register(id, name);
    });
    
    console.log(`Initialized ${deviceList.length} devices`);
  }
  
  // Start continuous monitoring
  startMonitoring(intervalMs: number = 5000) {
    console.log('Starting device monitoring...');
    
    this.refreshInterval = setInterval(() => {
      const devices = [
        'sensor-hub-01',
        'camera-01',
        'thermostat-01',
        'motion-001',
        'smoke-001',
      ];
      
      console.log('\n--- Device Status Report ---');
      devices.forEach(id => {
        const status = this.iot.getStatus(id);
        const statusIcon = status === 'online' ? '🟢' : '🔴';
        console.log(`${statusIcon} ${id}: ${status}`);
      });
      console.log('---------------------------\n');
    }, intervalMs);
  }
  
  // Stop monitoring
  stopMonitoring() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('Monitoring stopped');
    }
  }
  
  // Get summary statistics
  getSummary() {
    const devices = [
      'sensor-hub-01',
      'camera-01',
      'thermostat-01',
      'motion-001',
      'smoke-001',
    ];
    
    const online = devices.filter(id => this.iot.getStatus(id) === 'online').length;
    const offline = devices.length - online;
    
    return {
      total: devices.length,
      online,
      offline,
      healthPercentage: Math.round((online / devices.length) * 100),
    };
  }
}

// Usage
const monitor = new DeviceMonitor(iot);
monitor.initializeDevices();
monitor.startMonitoring(3000);

// After 15 seconds, get summary and stop
setTimeout(() => {
  monitor.stopMonitoring();
  const summary = monitor.getSummary();
  console.log('\n=== Final Summary ===');
  console.log(`Total Devices: ${summary.total}`);
  console.log(`Online: ${summary.online}`);
  console.log(`Offline: ${summary.offline}`);
  console.log(`Health: ${summary.healthPercentage}%`);
}, 15000);
```

### Batch Operations

```typescript
import IoTron from 'iotron';

const iot = new IoTron();

// Batch register devices
function batchRegister(devices: Array<{ id: string; name: string }>) {
  const results = {
    success: [] as string[],
    failed: [] as string[],
  };
  
  devices.forEach(({ id, name }) => {
    try {
      iot.register(id, name);
      results.success.push(id);
    } catch (error) {
      console.error(`Failed to register ${id}:`, error);
      results.failed.push(id);
    }
  });
  
  return results;
}

// Batch send commands
function batchSend(deviceIds: string[], command: string) {
  const results = {
    sent: [] as string[],
    skipped: [] as string[],
  };
  
  deviceIds.forEach(id => {
    const status = iot.getStatus(id);
    if (status === 'online') {
      iot.send(id, command);
      results.sent.push(id);
    } else {
      results.skipped.push(id);
    }
  });
  
  return results;
}

// Batch unregister devices
function batchUnregister(deviceIds: string[]) {
  deviceIds.forEach(id => {
    iot.unregister(id);
  });
  console.log(`Unregistered ${deviceIds.length} devices`);
}

// Example: Smart Home Setup
const smartHomeDevices = [
  { id: 'smart-tv-01', name: 'Living Room TV' },
  { id: 'smart-tv-02', name: 'Bedroom TV' },
  { id: 'speaker-01', name: 'Kitchen Speaker' },
  { id: 'speaker-02', name: 'Patio Speaker' },
  { id: 'ac-01', name: 'Bedroom AC' },
  { id: 'ac-02', name: 'Living Room AC' },
  { id: 'vacuum-01', name: 'Robot Vacuum' },
  { id: 'fridge-01', name: 'Smart Refrigerator' },
];

// Register all devices
const registration = batchRegister(smartHomeDevices);
console.log(`Registered: ${registration.success.length}, Failed: ${registration.failed.length}`);

// Send firmware update command to all online devices
const commandResults = batchSend(
  smartHomeDevices.map(d => d.id),
  'firmware:update'
);
console.log(`Command sent to: ${commandResults.sent.length} devices`);
console.log(`Skipped (offline): ${commandResults.skipped.length} devices`);

// Get all device statuses
console.log('\n=== All Device Statuses ===');
smartHomeDevices.forEach(({ id, name }) => {
  console.log(`${name}: ${iot.getStatus(id)}`);
});

// Cleanup when needed
batchUnregister(smartHomeDevices.map(d => d.id));
```

## API Reference

### IoTron Class

The main class for managing IoT devices.

```typescript
import IoTron from 'iotron';
const iot = new IoTron(options?: IoTronOptions);
```

#### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `debug` | `boolean` | `false` | Enable debug logging |
| `autoReconnect` | `boolean` | `true` | Auto-reconnect offline devices |
| `reconnectInterval` | `number` | `5000` | Reconnection attempt interval (ms) |

#### Methods

##### `register(id: string, name: string): void`

Registers a new device with the given ID and name. The device is automatically set to 'online' status.

**Parameters:**
- `id` (string) - Unique identifier for the device
- `name` (string) - Human-readable name for the device

**Returns:** `void`

**Throws:** `Error` if device ID is already registered

**Example:**
```typescript
iot.register('device-001', 'Temperature Sensor');
```

---

##### `unregister(id: string): void`

Removes a device from the registry.

**Parameters:**
- `id` (string) - Unique identifier of the device to remove

**Returns:** `void`

**Example:**
```typescript
iot.unregister('device-001');
```

---

##### `send(id: string, cmd: string): void`

Sends a command to a registered device.

**Parameters:**
- `id` (string) - Unique identifier of the target device
- `cmd` (string) - Command to send (can be plain text or JSON string)

**Returns:** `void`

**Example:**
```typescript
// Simple command
iot.send('device-001', 'restart');

// JSON command
iot.send('device-001', JSON.stringify({
  action: 'configure',
  settings: { interval: 5000 }
}));
```

---

##### `getStatus(id: string): DeviceStatus`

Gets the current status of a registered device.

**Parameters:**
- `id` (string) - Unique identifier of the device

**Returns:** `DeviceStatus` - Either `'online'` or `'offline'`

**Example:**
```typescript
const status = iot.getStatus('device-001');
if (status === 'online') {
  console.log('Device is ready to receive commands');
} else {
  console.log('Device is currently offline');
}
```

---

### Device Interface

Represents an IoT device in the registry.

```typescript
interface Device {
  /** Unique identifier for the device */
  id: string;
  
  /** Human-readable device name */
  name: string;
  
  /** Current connection status */
  status: DeviceStatus;
}
```

**Example:**
```typescript
const device: Device = {
  id: 'sensor-001',
  name: 'Living Room Temperature Sensor',
  status: 'online',
};
```

---

### DeviceStatus Type

Union type representing possible device states.

```typescript
type DeviceStatus = 'online' | 'offline';
```

**Values:**
- `'online'` - Device is connected and ready to receive commands
- `'offline'` - Device is disconnected or unavailable

---

### CommandOptions Interface

Options for customizing command delivery (future extension).

```typescript
interface CommandOptions {
  /** Timeout in milliseconds */
  timeout?: number;
  
  /** Priority level (1-10, higher = more urgent) */
  priority?: number;
  
  /** Retry count if delivery fails */
  retries?: number;
}
```

---

## Best Practices

### 1. Use Descriptive Device IDs

```typescript
// ✅ Good - Descriptive and organized
iot.register('factory-01/assembly-line-a/sensor-temperature', 'Assembly Line A Temp');

// ❌ Avoid - Unclear and hard to manage
iot.register('dev1', 'Device One');
```

### 2. Validate Device Status Before Sending Commands

```typescript
function safeSend(iot: IoTron, deviceId: string, command: string): boolean {
  if (iot.getStatus(deviceId) !== 'online') {
    console.warn(`Cannot send to offline device: ${deviceId}`);
    return false;
  }
  iot.send(deviceId, command);
  return true;
}
```

### 3. Implement Error Handling

```typescript
try {
  iot.register('critical-device-01', 'Critical System');
} catch (error) {
  if (error instanceof Error) {
    console.error(`Registration failed: ${error.message}`);
    // Implement fallback or alerting logic here
  }
}
```

### 4. Clean Up Resources

```typescript
// When your application shuts down
process.on('SIGINT', () => {
  console.log('Shutting down IoT manager...');
  // Unregister all devices
  devices.forEach(id => iot.unregister(id));
  process.exit(0);
});
```

### 5. Use Consistent Naming Conventions

```typescript
// Recommended prefixes for different device types
const prefixes = {
  sensor: 'sensor-',
  actuator: 'act-',
  camera: 'cam-',
  light: 'light-',
  thermostat: 'therm-',
  lock: 'lock-',
};

// Usage
iot.register(`${prefixes.sensor}living-temp`, 'Living Room Temperature');
```

---

## Troubleshooting

### Common Issues

#### Device Already Registered

```typescript
// Error: Device with this ID already exists
// Solution: Check if device exists before registering
if (!iot.getStatus('device-001')) {
  iot.register('device-001', 'My Device');
}
```

#### Device Not Found

```typescript
// Error: Cannot send command to non-existent device
// Solution: Always register devices before sending commands
const deviceExists = iot.getStatus('device-001') !== 'offline' || devices.has('device-001');
if (!deviceExists) {
  console.error('Device not registered');
  return;
}
iot.send('device-001', 'command');
```

#### Type Errors

```typescript
// Ensure you're using the correct types
import IoTron, { Device, DeviceStatus } from 'iotron';

const iot = new IoTron();
const device: Device = {
  id: 'test-001',
  name: 'Test Device',
  status: 'online' as DeviceStatus, // Cast if needed
};
```

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/iotron.git
cd iotron

# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build
```

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Changelog

### v1.0.0 (2024-04-19)

- Initial release
- Core device management functionality
- TypeScript support
- Basic status monitoring
- Command dispatch system

---

<p align="center">
  Made with ❤️ for the IoT community
</p>
