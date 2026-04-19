export interface Device { id: string; name: string; status: 'online' | 'offline'; }
export class IoTron {
  private devices = new Map<string, Device>();
  register(id: string, name: string) { this.devices.set(id, { id, name, status: 'online' }); }
  unregister(id: string) { this.devices.delete(id); }
  send(id: string, cmd: string) { console.log(`Sending ${cmd} to ${id}`); }
  getStatus(id: string) { return this.devices.get(id)?.status || 'offline'; }
}
export default IoTron;
