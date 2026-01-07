'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { handleSosEmergency } from '@/ai/flows/handle-sos-emergency';
import { Siren, Loader2 } from 'lucide-react';

export function SosButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const triggerSos = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation.',
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const result = await handleSosEmergency({ latitude, longitude });
          toast({
            title: 'SOS Sent',
            description: result.confirmationMessage,
          });
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'SOS Failed',
            description: 'Could not send emergency signal. Please try again.',
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        toast({
          variant: 'destructive',
          title: 'Geolocation Error',
          description: error.message,
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Siren className="mr-2 h-4 w-4" />
          SOS
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Emergency SOS</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately send an emergency alert with your current
            location to your emergency contacts and our monitoring center. Are
            you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={triggerSos}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Siren className="mr-2 h-4 w-4" />
            )}
            Confirm SOS
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
