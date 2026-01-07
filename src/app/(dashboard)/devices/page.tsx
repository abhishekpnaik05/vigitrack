'use client';

import { PlusCircle, Loader2 } from 'lucide-react';
import { columns } from '@/components/devices/columns';
import { DataTable } from '@/components/devices/data-table';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Device } from '@/types';
import { AddDeviceDialog } from '@/components/devices/add-device-dialog';

export default function DevicesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const devicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'devices'));
  }, [firestore, user]);

  const { data: devices, isLoading } = useCollection<Device>(devicesQuery);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Devices</h2>
          <p className="text-muted-foreground">
            Manage your fleet of tracking devices.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddDeviceDialog />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={devices || []} />
      )}
    </div>
  );
}
