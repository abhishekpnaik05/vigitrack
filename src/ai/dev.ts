import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-geofences-from-history.ts';
import '@/ai/flows/summarize-device-trip.ts';
import '@/ai/flows/handle-sos-emergency.ts';
import '@/ai/flows/generate-device-report.ts';
