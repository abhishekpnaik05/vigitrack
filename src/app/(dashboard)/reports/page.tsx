'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Device } from '@/types';
import { Loader2, Bot } from 'lucide-react';
import { DataTable } from '@/components/devices/data-table';
import { columns as deviceColumns } from '@/components/devices/columns';
import { generateDeviceReport } from '@/ai/flows/generate-device-report';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const devicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'devices'));
  }, [firestore, user]);

  const { data: devices, isLoading: isLoadingDevices } = useCollection<Device>(devicesQuery);

  const handleGenerateReport = async (device: Device) => {
    setSelectedDevice(device);
    setIsLoadingReport(true);
    setReport(null);
    try {
      const result = await generateDeviceReport({
        deviceId: device.id,
        userId: user!.uid,
        timeframe: '30d',
      });
      setReport(result.report);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description: 'Could not generate AI report for this device.',
      });
    } finally {
      setIsLoadingReport(false);
    }
  };

  const reportColumns = useMemo(() => {
    return [
      ...deviceColumns.filter(c => c.id !== 'actions'),
      {
        id: 'actions',
        cell: ({ row }: { row: { original: Device } }) => {
          const device = row.original;
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateReport(device)}
              disabled={isLoadingReport && selectedDevice?.id === device.id}
            >
              {isLoadingReport && selectedDevice?.id === device.id ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bot className="mr-2 h-4 w-4" />
              )}
              Generate AI Report
            </Button>
          );
        },
      },
    ];
  }, [isLoadingReport, selectedDevice]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Reports</h2>
        <p className="text-muted-foreground">
          Analyze and export historical data for your fleet.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Device Report Generator</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDevices ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable columns={reportColumns} data={devices || []} />
          )}
        </CardContent>
      </Card>
      
      {isLoadingReport && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Report for {selectedDevice?.name}...</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mr-4" />
            <p>Our AI is analyzing the data. This may take a moment...</p>
          </CardContent>
        </Card>
      )}

      {report && selectedDevice && (
        <Card>
          <CardHeader>
            <CardTitle>AI Generated Report for "{selectedDevice.name}"</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 bg-secondary/50 rounded-md text-secondary-foreground border-l-4 border-primary prose prose-sm max-w-none">
                <p>{report}</p>
            </div>
             <Button onClick={() => handleGenerateReport(selectedDevice)} disabled={isLoadingReport}>
              <Bot className="mr-2 h-4 w-4" />
              Regenerate Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
