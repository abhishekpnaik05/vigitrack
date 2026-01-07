'use server';
/**
 * @fileOverview Analyzes device GPS history to suggest geofence zones.
 *
 * - suggestGeofencesFromHistory - A function that suggests geofence zones based on GPS history.
 * - SuggestGeofencesFromHistoryInput - The input type for the suggestGeofencesFromHistory function.
 * - SuggestGeofencesFromHistoryOutput - The return type for the suggestGeofencesFromHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGeofencesFromHistoryInputSchema = z.object({
  deviceId: z.string().describe('The ID of the device.'),
  gpsHistory: z.array(
    z.object({
      latitude: z.number().describe('The latitude coordinate.'),
      longitude: z.number().describe('The longitude coordinate.'),
      timestamp: z.string().describe('The timestamp of the GPS reading (ISO 8601 format).'),
    })
  ).describe('The GPS history of the device.'),
});
export type SuggestGeofencesFromHistoryInput = z.infer<typeof SuggestGeofencesFromHistoryInputSchema>;

const SuggestGeofencesFromHistoryOutputSchema = z.object({
  geofenceSuggestions: z.array(
    z.object({
      name: z.string().describe('The name of the geofence suggestion.'),
      latitude: z.number().describe('The latitude of the geofence center.'),
      longitude: z.number().describe('The longitude of the geofence center.'),
      radius: z.number().describe('The radius of the geofence in meters.'),
      description: z.string().optional().describe('Optional description of the geofence suggestion.'),
    })
  ).describe('The suggested geofence zones.'),
});
export type SuggestGeofencesFromHistoryOutput = z.infer<typeof SuggestGeofencesFromHistoryOutputSchema>;

export async function suggestGeofencesFromHistory(input: SuggestGeofencesFromHistoryInput): Promise<SuggestGeofencesFromHistoryOutput> {
  return suggestGeofencesFromHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGeofencesFromHistoryPrompt',
  input: {schema: SuggestGeofencesFromHistoryInputSchema},
  output: {schema: SuggestGeofencesFromHistoryOutputSchema},
  prompt: `You are an expert system for suggesting geofences based on device GPS history data.

  Analyze the provided GPS history and identify potential areas where the device frequently visits or stays for extended periods.
  These areas are good candidates for geofences. Suggest at least three geofences, but no more than five.

  The GPS history is provided as an array of latitude, longitude, and timestamp values.

  Format your output as a JSON array of geofence suggestions, including the name, latitude, longitude, radius (in meters), and a brief description for each suggestion.

  Here is the GPS history data:
  Device ID: {{{deviceId}}}
  GPS History: {{{JSON.stringify gpsHistory}}}

  Ensure the output is a valid JSON according to the following schema:
  ${JSON.stringify(SuggestGeofencesFromHistoryOutputSchema.describe)}
  `,
});

const suggestGeofencesFromHistoryFlow = ai.defineFlow(
  {
    name: 'suggestGeofencesFromHistoryFlow',
    inputSchema: SuggestGeofencesFromHistoryInputSchema,
    outputSchema: SuggestGeofencesFromHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
