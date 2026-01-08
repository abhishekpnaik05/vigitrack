'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

const deviceFormSchema = z.object({
  id: z.string().min(1, 'Device ID is required'),
  name: z.string().min(1, 'Device name is required'),
  firmwareVersion: z.string().min(1, 'Firmware version is required'),
  latitude: z.number({ coerce: true }).min(-90, "Invalid latitude").max(90, "Invalid latitude"),
  longitude: z.number({ coerce: true }).min(-180, "Invalid longitude").max(180, "Invalid longitude"),
});

const DEFAULT_LOCATION = { lat: 13.150940, lng: 77.610027 }; // Sir M Visvesvaraya Institute of Technology

export function AddDeviceDialog() {
  const [open, setOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof deviceFormSchema>>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      id: '',
      name: '',
      firmwareVersion: '1.0.0',
      latitude: '' as any,
      longitude: '' as any,
    },
  });

  const { formState, handleSubmit, reset, setValue } = form;
  const { isSubmitting } = formState;

  async function onSubmit(values: z.infer<typeof deviceFormSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to add a device.',
      });
      return;
    }

    try {
        const devicesRef = collection(firestore, 'users', user.uid, 'devices');
        const newDeviceData = {
            id: values.id,
            name: values.name,
            firmwareVersion: values.firmwareVersion,
            userId: user.uid,
            status: 'Active',
            lastLocation: { lat: values.latitude, lng: values.longitude },
            lastSeen: new Date(),
        };

        const deviceDocRef = await addDoc(devicesRef, newDeviceData);

        toast({
          title: 'Device Added',
          description: `Device "${values.name}" has been added successfully.`,
        });

        // Add a sample notification
        const notificationsRef = collection(firestore, 'users', user.uid, 'notifications');
        const newNotification = {
            type: 'online',
            title: 'Device Online',
            description: `Device "${values.name}" has been added and is now online.`,
            timestamp: new Date(),
            icon: 'Truck',
            iconColor: 'text-green-500',
            userId: user.uid,
            deviceId: deviceDocRef.id,
            deviceName: values.name,
            deviceStatus: 'Active',
        };
        
        await addDoc(notificationsRef, newNotification);

        reset();
        setOpen(false);
    } catch(e: any) {
        // The global error handler in FirebaseProvider will catch permission errors
        console.error("Error adding document: ", e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "Could not save device.",
        });
    }
  }
  
  const fetchLocation = () => {
    setIsLocating(true);

     if (!navigator.geolocation) {
        toast({
            variant: 'destructive',
            title: 'Geolocation not supported',
            description: 'Your browser does not support geolocation. Using default location.',
        });
        setValue('latitude', DEFAULT_LOCATION.lat);
        setValue('longitude', DEFAULT_LOCATION.lng);
        setIsLocating(false);
        return;
    }

     navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setValue('latitude', latitude);
            setValue('longitude', longitude);
             toast({
                title: 'Location Found',
                description: 'Current location has been fetched. You can edit it if needed.',
            });
            setIsLocating(false);
        },
        (error) => {
            toast({
                variant: 'destructive',
                title: 'Location Error',
                description: 'Could not get your location. Please ensure location services are enabled. You can enter it manually.',
            });
            setValue('latitude', DEFAULT_LOCATION.lat);
            setValue('longitude', DEFAULT_LOCATION.lng);
            setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            reset();
        }
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>
            Enter device details. Fetch location or enter it manually. A sample notification will be created.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., dev-005" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Refrigerated Truck 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firmwareVersion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firmware Version</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1.2.4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className='flex justify-between items-center'>
                <FormLabel>Device Location</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={fetchLocation} disabled={isLocating}>
                      {isLocating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="mr-2 h-4 w-4" />
                    )}
                    Fetch
                </Button>
              </div>
              <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="number" placeholder="Latitude" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="number" placeholder="Longitude" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Add Device
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
