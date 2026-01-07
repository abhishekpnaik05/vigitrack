import { Timestamp } from 'firebase/firestore';

export type DeviceStatus = 'Active' | 'Stopped' | 'Offline';

export type Device = {
  id: string;
  name: string;
  status: DeviceStatus;
  firmwareVersion: string;
  lastLocation: {
    lat: number;
    lng: number;
  };
  lastSeen: Timestamp | null;
  userId?: string;
};

export type Trip = {
  id: string;
  deviceId: string;
  startTime: string;
  endTime: string;
  startAddress: string;
  endAddress: string;
  distance: number; // in kilometers
  path: { lat: number; lng: number }[];
};

export type Geofence = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  deviceId: string; // Added deviceId
  coordinates: number[];
};

export type Firmware = {
  id: string;
  version: string;
  releaseDate: string;
  description: string;
  url: string;
};

export type Notification = {
  id: string;
  type: 'geofence-enter' | 'geofence-exit' | 'offline' | 'online' | 'sos';
  title: string;
  description: string;
  timestamp: Timestamp;
  icon: 'MapPin' | 'Truck' | 'WifiOff' | 'Bell';
  iconColor: string;
  userId: string;
  deviceId: string;
}
