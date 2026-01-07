import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export default function OtaUpdatesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">OTA Firmware Updates</h2>
          <p className="text-muted-foreground">
            Manage and deploy firmware updates to your devices.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload Firmware
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Firmware Versions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed border-muted rounded-lg p-12">
            <h3 className="text-xl font-semibold">No Firmware Uploaded</h3>
            <p className="text-muted-foreground">
              Upload your first firmware binary to start managing OTA updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
