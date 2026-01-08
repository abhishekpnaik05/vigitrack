'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Device } from '@/types';
import { useState, useEffect } from 'react';

type MapViewProps = {
  devices: Device[];
};

export default function MapView({ devices }: MapViewProps) {
  const [currentUserLocation, setCurrentUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Could not get location, do nothing. We'll use fallbacks.
        }
      );
    }
  }, []);

  const firstDevice = devices?.[0];

  // Determine the map center: 1. First device, 2. User's location, 3. Fallback to Sir M.
  const lat = firstDevice?.lastLocation.lat ?? currentUserLocation?.lat ?? 13.150940;
  const lng = firstDevice?.lastLocation.lng ?? currentUserLocation?.lng ?? 77.610027;
  const zoom = (firstDevice || currentUserLocation) ? 13 : 15;


  const buildOpenStreetMapUrl = () => {
    const baseUrl = 'https://www.openstreetmap.org/';
    const markers = [];

    if (currentUserLocation) {
      // Marker format for OSM is lat,lon. A blue marker is default.
      markers.push(`marker=${currentUserLocation.lat},${currentUserLocation.lng}`);
    }

    devices.forEach(device => {
      if (device.lastLocation) {
        // You can add different colored markers if you want, but for now, we use default red.
        markers.push(`marker=${device.lastLocation.lat},${device.lastLocation.lng}`);
      }
    });

    if (markers.length > 0) {
      return `${baseUrl}?${markers.join('&')}#map=${zoom}/${lat}/${lng}`;
    }
    
    // Fallback if no locations, just center the map
    return `${baseUrl}#map=${zoom}/${lat}/${lng}`;
  };
  
  const interactiveMapUrl = buildOpenStreetMapUrl();

  return (
    <a href={interactiveMapUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
      <div className="relative h-full w-full bg-muted">
        <Image
          src={`https://picsum.photos/seed/map/800/600`}
          alt="Map showing device locations"
          fill
          className="object-cover"
          data-ai-hint="map satellite"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Card className="bg-background/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="font-semibold">Live Fleet View</p>
              <p className="text-sm text-muted-foreground">
                Click to open interactive map
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </a>
  );
}
