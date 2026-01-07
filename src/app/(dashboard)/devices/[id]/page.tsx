'use client';

import { DeviceDetails } from '@/components/devices/device-details';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import type { Device, Trip } from '@/types';
import { doc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { mockTrips } from '@/lib/mock-data'; // Using mock trips for now

export default function DeviceDetailPage({ params }: { params: { id: string } }) {
  const { user } = useUser();
  const firestore = useFirestore();

  const deviceRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'devices', params.id);
  }, [firestore, user, params.id]);

  const { data: device, isLoading } = useDoc<Device>(deviceRef);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!device) {
    notFound();
  }

  // In a real app, you would fetch trips from Firestore as well.
  // We'll use mock trips filtered for this device for now.
  const trips = mockTrips.filter((t) => t.deviceId === device.id);

  return <DeviceDetails device={device} trips={trips} />;
}
