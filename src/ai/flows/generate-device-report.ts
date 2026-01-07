'use server';

/**
 * @fileOverview A flow that generates a summary report for a device over a given timeframe.
 *
 * - generateDeviceReport - A function that handles the report generation process.
 * - GenerateDeviceReportInput - The input type for the generateDeviceReport function.
 * - GenerateDeviceReportOutput - The return type for the generateDeviceReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDeviceReportInputSchema = z.object({
  deviceId: z.string().describe('The ID of the device to generate a report for.'),
  userId: z.string().describe('The ID of the user who owns the device.'),
  timeframe: z.string().describe('The timeframe for the report (e.g., "7d", "30d").'),
});
export type GenerateDeviceReportInput = z.infer<typeof GenerateDeviceReportInputSchema>;

const GenerateDeviceReportOutputSchema = z.object({
  report: z.string().describe('A comprehensive, human-readable report summarizing the device\'s activity.'),
});
export type GenerateDeviceReportOutput = z.infer<typeof GenerateDeviceReportOutputSchema>;


export async function generateDeviceReport(input: GenerateDeviceReportInput): Promise<GenerateDeviceReportOutput> {
  return generateDeviceReportFlow(input);
}


const generateDeviceReportPrompt = ai.definePrompt({
  name: 'generateDeviceReportPrompt',
  input: {schema: GenerateDeviceReportInputSchema},
  output: {schema: GenerateDeviceReportOutputSchema},
  prompt: `You are an AI assistant for a fleet tracking system called VigiTracker.
  
  Your task is to generate a summary report for a specific device based on its recent activity.
  The user wants a report for Device ID: {{{deviceId}}} for the last {{{timeframe}}}.

  Here is some example data you might receive (this is a placeholder, you should act as if you have access to real data):
  - Total distance traveled: 2,345 km
  - Number of trips: 58
  - Geofence alerts: 12 (8 entries, 4 exits)
  - Most visited geofence: "Main Warehouse"
  - Device offline instances: 2 (Total offline time: 3 hours)
  - Average trip duration: 45 minutes

  Based on this kind of data, generate a concise, professional, and easy-to-read report.
  The report should be a single paragraph. Start with a clear topic sentence summarizing the device's overall performance.
  Include key statistics and highlight any notable events or potential areas for concern (like frequent offline instances).
  Assume the device is a commercial vehicle.
  
  Example Output Structure:
  "Over the past 30 days, Device [Device Name/ID] has been highly active, covering a total distance of [Total Distance]. It completed [Number of Trips] trips with an average duration of [Average Duration]. The device triggered [Number of Geofence Alerts] geofence alerts, with the most frequent activity at "[Most Visited Geofence]". There were [Number of Offline Instances] instances of the device going offline, which may warrant further investigation."

  Now, generate the report for device {{{deviceId}}}.
  `,
});

const generateDeviceReportFlow = ai.defineFlow(
  {
    name: 'generateDeviceReportFlow',
    inputSchema: GenerateDeviceReportInputSchema,
    outputSchema: GenerateDeviceReportOutputSchema,
  },
  async input => {
    // In a real application, you would fetch real data from Firestore here
    // based on the deviceId, userId, and timeframe. For this prototype,
    // we will rely on the LLM to generate a plausible report based on the prompt's context.
    const {output} = await generateDeviceReportPrompt(input);
    return output!;
  }
);
