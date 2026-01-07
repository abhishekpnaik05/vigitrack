'use server';

/**
 * @fileOverview A flow that summarizes a device's journey from its GPS data.
 *
 * - summarizeDeviceTrip - A function that handles the summarization process.
 * - SummarizeDeviceTripInput - The input type for the summarizeDeviceTrip function.
 * - SummarizeDeviceTripOutput - The return type for the summarizeDeviceTrip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDeviceTripInputSchema = z.object({
  deviceId: z.string().describe('The ID of the device to summarize the trip for.'),
  gpsData: z.array(
    z.object({
      latitude: z.number().describe('The latitude of the device at this point.'),
      longitude: z.number().describe('The longitude of the device at this point.'),
      timestamp: z.string().describe('The timestamp of the GPS data point (ISO format).'),
    })
  ).describe('An array of GPS data points for the device.'),
});
export type SummarizeDeviceTripInput = z.infer<typeof SummarizeDeviceTripInputSchema>;

const SummarizeDeviceTripOutputSchema = z.object({
  summary: z.string().describe('A human-readable summary of the device trip.'),
});
export type SummarizeDeviceTripOutput = z.infer<typeof SummarizeDeviceTripOutputSchema>;

export async function summarizeDeviceTrip(input: SummarizeDeviceTripInput): Promise<SummarizeDeviceTripOutput> {
  return summarizeDeviceTripFlow(input);
}

const summarizeDeviceTripPrompt = ai.definePrompt({
  name: 'summarizeDeviceTripPrompt',
  input: {schema: SummarizeDeviceTripInputSchema},
  output: {schema: SummarizeDeviceTripOutputSchema},
  prompt: `You are an AI assistant that summarizes device trips based on GPS data.

  Given the following GPS data for device ID {{{deviceId}}}, generate a concise and readable summary of the device's journey:

  GPS Data:
  {{#each gpsData}}
  - Timestamp: {{{timestamp}}}, Latitude: {{{latitude}}}, Longitude: {{{longitude}}}
  {{/each}}

  Summary:`,
});

const summarizeDeviceTripFlow = ai.defineFlow(
  {
    name: 'summarizeDeviceTripFlow',
    inputSchema: SummarizeDeviceTripInputSchema,
    outputSchema: SummarizeDeviceTripOutputSchema,
  },
  async input => {
    const {output} = await summarizeDeviceTripPrompt(input);
    return output!;
  }
);
