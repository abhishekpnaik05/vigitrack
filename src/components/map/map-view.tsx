'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Device } from '@/types';

type MapViewProps = {
  devices: Device[];
};

export default function MapView({ devices }: MapViewProps) {
  const centerDevice = devices.length > 0 ? devices[0] : null;
  const lat = centerDevice?.lastLocation.lat ?? 34.0522;
  const lng = centerDevice?.lastLocation.lng ?? -118.2437;
  const zoom = 13;

  // Using a free static map image service
  const staticMapUrl = `https://api.maptiler.com/maps/streets/static/${lng},${lat},${zoom}/800x600.png?key=get-your-own-key`;
  const interactiveMapUrl = `https://www.openstreetmap.org/#map=${zoom}/${lat}/${lng}`;

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
              <p className="font-semibold">Map View</p>
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
