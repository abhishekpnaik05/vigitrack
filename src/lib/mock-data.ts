import type { Device, Trip, Geofence, Firmware } from '@/types';

export const mockDevices: Device[] = [
  {
    id: 'dev-001',
    name: 'Cargo Truck 1',
    status: 'Active',
    firmwareVersion: '1.2.3',
    lastLocation: { lat: 34.0522, lng: -118.2437 },
    lastSeen: '2 minutes ago',
  },
  {
    id: 'dev-002',
    name: 'Delivery Van A',
    status: 'Stopped',
    firmwareVersion: '1.2.1',
    lastLocation: { lat: 34.055, lng: -118.25 },
    lastSeen: '30 minutes ago',
  },
  {
    id: 'dev-003',
    name: 'Service Vehicle 7',
    status: 'Offline',
    firmwareVersion: '1.1.0',
    lastLocation: { lat: 34.048, lng: -118.24 },
    lastSeen: '5 hours ago',
  },
  {
    id: 'dev-004',
    name: 'Cargo Truck 2',
    status: 'Active',
    firmwareVersion: '1.2.3',
    lastLocation: { lat: 34.06, lng: -118.26 },
    lastSeen: '5 minutes ago',
  },
];

export const mockTrips: Trip[] = [
  {
    id: 'trip-001',
    deviceId: 'dev-001',
    startTime: '2023-10-27T09:00:00Z',
    endTime: '2023-10-27T10:30:00Z',
    startAddress: '123 Warehouse St, Los Angeles, CA',
    endAddress: '456 Distribution Ave, Los Angeles, CA',
    distance: 25.5,
    path: [
      { lat: 34.0522, lng: -118.2437 },
      { lat: 34.053, lng: -118.245 },
      { lat: 34.054, lng: -118.248 },
      { lat: 34.055, lng: -118.25 },
    ],
  },
  {
    id: 'trip-002',
    deviceId: 'dev-001',
    startTime: '2023-10-27T11:00:00Z',
    endTime: '2023-10-27T12:00:00Z',
    startAddress: '456 Distribution Ave, Los Angeles, CA',
    endAddress: '789 Client Rd, Beverly Hills, CA',
    distance: 15.2,
    path: [
      { lat: 34.055, lng: -118.25 },
      { lat: 34.06, lng: -118.3 },
      { lat: 34.0736, lng: -118.4004 },
    ],
  },
];

export const mockGeofences: Geofence[] = [
  {
    id: 'geo-001',
    name: 'Main Warehouse',
    latitude: 34.0522,
    longitude: -118.2437,
    radius: 500,
  },
  {
    id: 'geo-002',
    name: 'Port of LA',
    latitude: 33.7292,
    longitude: -118.262,
    radius: 2000,
  },
];

export const mockFirmwares: Firmware[] = [
    {
        id: 'fw-001',
        version: '1.2.3',
        releaseDate: '2023-10-15',
        description: 'Improved GPS accuracy and battery life.',
        url: '/firmware/v1.2.3.bin'
    },
    {
        id: 'fw-002',
        version: '1.2.1',
        releaseDate: '2023-09-01',
        description: 'Security patches and minor bug fixes.',
        url: '/firmware/v1.2.1.bin'
    },
    {
        id: 'fw-003',
        version: '1.1.0',
        releaseDate: '2023-07-20',
        description: 'Initial stable release.',
        url: '/firmware/v1.1.0.bin'
    }
]
