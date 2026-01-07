'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddGeofenceDialog } from '@/components/geofences/add-geofence-dialog';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Geofence } from '@/types';
import { Loader2, MapPin } from 'lucide-react';

export default function GeofencesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const geofencesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    // Note: This query structure is simplified. In a real app, you might query
    // across all device subcollections, which requires a collection group query.
    // For this prototype, we assume geofences are directly under the user for easier listing.
    // A better path would be /users/{userId}/geofences/{geofenceId} with deviceId as a property.
    // However, we will query the first device's geofences for demonstration purposes.
    // This is a limitation of the current mock-up structure.
    return query(collection(firestore, `users/${user.uid}/geofences`));
  }, [firestore, user]);

  // A more robust implementation would require a collection group query for `geofences`.
  // Let's adjust the data fetching to query a single device's geofences for now.
  const devicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'devices'));
  },[firestore, user]);

  const { data: devices, isLoading: isLoadingDevices } = useCollection(devicesQuery);

  // For this example, we'll just fetch geofences for the *first* device.
  const firstDeviceId = devices?.[0]?.id;
  const geofencesForDeviceQuery = useMemoFirebase(() => {
    if (!user || !firestore || !firstDeviceId) return null;
    return query(collection(firestore, 'users', user.uid, 'devices', firstDeviceId, 'geofences'));
  }, [firestore, user, firstDeviceId]);

  const { data: geofences, isLoading: isLoadingGeofences } = useCollection<Geofence>(geofencesForDeviceQuery);
  const isLoading = isLoadingDevices || isLoadingGeofences;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Geofences</h2>
          <p className="text-muted-foreground">
            Create and manage virtual boundaries for your devices.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddGeofenceDialog devices={devices || []} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Geofences</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !geofences || geofences.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed border-muted rounded-lg p-12">
              <h3 className="text-xl font-semibold">No Geofences Yet</h3>
              <p className="text-muted-foreground">
                Start by creating a geofence.
              </p>
            </div>
          ) : (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {geofences.map((geofence) => (
                <Card key={geofence.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" /> {geofence.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                       <p>Device ID: {geofence.deviceId}</p>
                       <p>Coordinates: {geofence.coordinates.join(', ')}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
