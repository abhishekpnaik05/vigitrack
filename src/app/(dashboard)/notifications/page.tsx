'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, MapPin, Truck, WifiOff, Loader2 } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/types';

const iconMap = {
  MapPin: MapPin,
  Truck: Truck,
  WifiOff: WifiOff,
  Bell: Bell,
};

export default function NotificationsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const notificationsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/notifications`),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
  }, [firestore, user]);
  
  const { data: notifications, isLoading } = useCollection<Notification>(notificationsQuery);
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Notifications</h2>
        <p className="text-muted-foreground">
          View recent alerts and events from your devices.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {notifications && notifications.map((notification) => {
                const Icon = iconMap[notification.icon] || Bell;
                const date = notification.timestamp?.toDate ? notification.timestamp.toDate() : new Date();
                return (
                  <div key={notification.id} className="flex items-start gap-4">
                    <div className={`rounded-full bg-secondary p-3 ${notification.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">
                           {notification.timestamp ? formatDistanceToNow(date, { addSuffix: true }) : 'Just now'}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Device: <Badge variant="secondary">{notification.deviceName}</Badge></span>
                        <span>Status: <Badge variant="outline">{notification.deviceStatus}</Badge></span>
                      </div>
                    </div>
                  </div>
                )
              })}
              {(!notifications || notifications.length === 0) && (
                  <div className="flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed border-muted rounded-lg p-12">
                      <Bell className="h-10 w-10 text-muted-foreground" />
                      <h3 className="text-xl font-semibold">No New Notifications</h3>
                      <p className="text-muted-foreground">
                      All your devices are quiet. We'll let you know when something happens.
                      </p>
                  </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
