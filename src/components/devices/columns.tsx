'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Device, DeviceStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowUpDown, MoreHorizontal, Truck, Power, WifiOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useFirestore, useUser } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

const statusConfig: Record<
  DeviceStatus,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  Active: {
    icon: Truck,
    color: 'text-green-500',
    badgeVariant: 'outline',
  },
  Stopped: {
    icon: Power,
    color: 'text-yellow-500',
    badgeVariant: 'secondary',
  },
  Offline: {
    icon: WifiOff,
    color: 'text-red-500',
    badgeVariant: 'destructive',
  },
};

const ActionsCell = ({ row }: { row: { original: Device } }) => {
  const device = row.original;
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to delete a device.',
      });
      return;
    }
    const deviceRef = doc(firestore, 'users', user.uid, 'devices', device.id);
    await deleteDoc(deviceRef);
    toast({
      title: 'Device Deleted',
      description: `"${device.name}" has been removed.`,
    });
  };

  return (
    <AlertDialog>
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(device.id)}
            >
              Copy device ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/devices/${device.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit device</DropdownMenuItem>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => e.preventDefault()} // Prevents DropdownMenu from closing
                >
                Delete device
                </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the device
            "{device.name}" and all its associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Yes, delete device
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


export const columns: ColumnDef<Device>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Device Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link href={`/devices/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue('name')}
        </Link>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as DeviceStatus;
      if (!status) return null;
      const config = statusConfig[status];
      if (!config) return <span>{status}</span>;
      const { icon: Icon, color, badgeVariant } = config;
      return (
        <Badge variant={badgeVariant} className="flex w-fit items-center gap-2">
          <Icon className={`h-3 w-3 ${color}`} />
          <span>{status}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: 'lastLocation',
    header: 'Last Known Location',
    cell: ({ row }) => {
      const location = row.getValue('lastLocation') as { lat: number; lng: number };
      if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') return 'N/A';
      
      return (
        <a
          href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=16/${location.lat}/${location.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-primary"
        >
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </a>
      );
    }
  },
  {
    accessorKey: 'firmwareVersion',
    header: 'Firmware',
    cell: ({ row }) => {
        return <span className="font-code">{row.getValue('firmwareVersion')}</span>
    }
  },
  {
    accessorKey: 'lastSeen',
    header: 'Last Seen',
    cell: ({ row }) => {
      const lastSeenValue = row.getValue('lastSeen');
      if (!lastSeenValue) return 'Never';
      
      // Handle both string and Timestamp object
      try {
        const date = typeof lastSeenValue === 'string' 
          ? new Date(lastSeenValue)
          // @ts-ignore
          : new Date(lastSeenValue.seconds * 1000);
          
        return <span>{formatDistanceToNow(date, { addSuffix: true })}</span>;
      } catch (e) {
        return 'Invalid Date';
      }
    },
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
];
