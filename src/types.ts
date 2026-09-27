export interface DeviceLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Device {
  id: string;
  name: string;
  model: string;
  phoneNumber: string;
  pinCode: string;
  status: 'online' | 'offline';
  battery: number;
  signalStrength: number;
  lastKnownLocation: DeviceLocation;
  isAlarming: boolean;
  isLocked: boolean;
  isWiped: boolean;
  lockMessage: string;
  lockContact: string;
  chipId: string;
  meshNeighbors: string[];
  routeHistory: DeviceLocation[];
}

export type EventType =
  | 'tracking_query'
  | 'manual_relocation'
  | 'status_change'
  | 'emergency_trigger'
  | 'security_action'
  | 'device_registered'
  | 'alarm_triggered'
  | 'lock_applied'
  | 'wipe_initiated'
  | 'pin_search';

export type Severity = 'critical' | 'warning' | 'info';

export interface ActivityLogEntry {
  id: string;
  deviceId: string;
  deviceName: string;
  timestamp: number;
  eventType: EventType;
  severity: Severity;
  description: string;
  coordinates?: DeviceLocation;
}

export interface TriangulationPhase {
  name: string;
  duration: number;
  description: string;
}

export type MapViewMode = 'tactical' | 'satellite' | 'street';
