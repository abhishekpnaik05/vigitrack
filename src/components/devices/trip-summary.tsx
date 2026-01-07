'use client';

import { useState } from 'react';
import type { Trip } from '@/types';
import { summarizeDeviceTrip } from '@/ai/flows/summarize-device-trip';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Route, Calendar, Clock } from 'lucide-react';
import { format, formatDistance } from 'date-fns';

type TripSummaryProps = {
  trip: Trip;
};

export function TripSummary({ trip }: TripSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch detailed GPS data for the trip
      const gpsData = trip.path.map((p, i) => ({
        ...p,
        timestamp: new Date(new Date(trip.startTime).getTime() + i * 60000).toISOString(),
      }));

      const result = await summarizeDeviceTrip({
        deviceId: trip.deviceId,
        gpsData: gpsData,
      });
      setSummary(result.summary);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: 'Could not generate trip summary.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const tripDuration = formatDistance(new Date(trip.startTime), new Date(trip.endTime));

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-lg flex items-center gap-2">
            <Route className="w-5 h-5 text-primary" /> Trip on {format(new Date(trip.startTime), 'MMMM d, yyyy')}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {tripDuration}</span>
            <span className="flex items-center gap-1.5"><Route className="w-3.5 h-3.5" /> {trip.distance.toFixed(1)} km</span>
          </div>
        </div>
        <Button size="sm" onClick={handleSummarize} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bot className="mr-2 h-4 w-4" />
          )}
          {summary ? 'Re-summarize' : 'Summarize with AI'}
        </Button>
      </div>
      
      {summary && (
        <div className="p-3 bg-secondary/50 rounded-md text-sm text-secondary-foreground border-l-4 border-primary">
          <p className="font-semibold mb-1">AI Summary:</p>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
