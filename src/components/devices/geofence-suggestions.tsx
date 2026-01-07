'use client';

import { useState } from 'react';
import type { Trip, Geofence } from '@/types';
import {
  suggestGeofencesFromHistory,
  SuggestGeofencesFromHistoryOutput,
} from '@/ai/flows/suggest-geofences-from-history';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, MapPin, Plus } from 'lucide-react';

type GeofenceSuggestionsProps = {
  deviceId: string;
  trips: Trip[];
};

export function GeofenceSuggestions({ deviceId, trips }: GeofenceSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<
    SuggestGeofencesFromHistoryOutput['geofenceSuggestions'] | null
  >(null);
  const { toast } = useToast();

  const handleSuggest = async () => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      // In a real app, you would fetch more comprehensive GPS history
      const gpsHistory = trips
        .flatMap((trip) => trip.path)
        .map((p, i) => ({
          ...p,
          latitude: p.lat,
          longitude: p.lng,
          timestamp: new Date(Date.now() - i * 60000 * 15).toISOString(),
        }));

      if (gpsHistory.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Not enough data',
          description: 'There is no trip history to analyze for this device.',
        });
        return;
      }
      
      const result = await suggestGeofencesFromHistory({
        deviceId,
        gpsHistory,
      });
      setSuggestions(result.geofenceSuggestions);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'Could not generate geofence suggestions.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGeofence = (geofence: Geofence) => {
    // Logic to add geofence to the user's list
    toast({
        title: 'Geofence Added',
        description: `"${geofence.name}" has been saved.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Geofence Suggestions</CardTitle>
        <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Analyze trip history to find frequently visited locations.
        </p>
        <Button onClick={handleSuggest} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bot className="mr-2 h-4 w-4" />
          )}
          Generate Suggestions
        </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mr-4" />
                <p>Analyzing trip data with AI...</p>
            </div>
        )}
        {!isLoading && !suggestions && (
          <div className="flex flex-col items-center justify-center gap-2 text-center border-2 border-dashed border-muted rounded-lg p-12">
            <h3 className="text-xl font-semibold">Ready to Analyze</h3>
            <p className="text-muted-foreground max-w-sm">
              Click "Generate Suggestions" to let our AI identify potential geofences based on this device's movement patterns.
            </p>
          </div>
        )}
        {suggestions && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((s) => (
              <Card key={s.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> {s.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                  <div className="text-xs">
                    <p><span className="font-semibold">Radius:</span> {s.radius} meters</p>
                    <p><span className="font-semibold">Coords:</span> {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}</p>
                  </div>
                  <Button size="sm" className="w-full" onClick={() => handleAddGeofence(s)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Geofence
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
