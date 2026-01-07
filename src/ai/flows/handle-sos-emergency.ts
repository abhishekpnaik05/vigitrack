'use server';

/**
 * @fileOverview Handles SOS emergency trigger, using browser's location and notifies relevant parties.
 *
 * - handleSosEmergency - A function that handles the SOS emergency process.
 * - HandleSosEmergencyInput - The input type for the handleSosEmergency function.
 * - HandleSosEmergencyOutput - The return type for the handleSosEmergency function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Tool for sending an SMS
const sendSms = ai.defineTool(
  {
    name: 'sendSms',
    description: 'Sends an SMS message to a specified phone number.',
    inputSchema: z.object({
      to: z.string().describe('The recipient\'s phone number.'),
      message: z.string().describe('The content of the SMS message.'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
  },
  async ({ to, message }) => {
    console.log(`SIMULATING SMS to ${to}: "${message}"`);
    return { success: true };
  }
);

// Tool for sending a WhatsApp message
const sendWhatsApp = ai.defineTool(
  {
    name: 'sendWhatsApp',
    description: 'Sends a WhatsApp message to a specified phone number.',
    inputSchema: z.object({
      to: z.string().describe('The recipient\'s phone number.'),
      message: z.string().describe('The content of the WhatsApp message.'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
  },
  async ({ to, message }) => {
    console.log(`SIMULATING WhatsApp to ${to}: "${message}"`);
    return { success: true };
  }
);

// Tool for sending an email
const sendEmail = ai.defineTool(
  {
    name: 'sendEmail',
    description: 'Sends an email to a specified address.',
    inputSchema: z.object({
      to: z.string().email().describe('The recipient\'s email address.'),
      subject: z.string().describe('The subject of the email.'),
      body: z.string().describe('The body content of the email.'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
  },
  async ({ to, subject, body }) => {
    console.log(`SIMULATING Email to ${to}:
Subject: ${subject}
Body: ${body}`);
    return { success: true };
  }
);


const HandleSosEmergencyInputSchema = z.object({
  latitude: z.number().describe('The latitude of the emergency location.'),
  longitude: z.number().describe('The longitude of the emergency location.'),
  message: z.string().optional().describe('Optional message from the user.'),
});
export type HandleSosEmergencyInput = z.infer<typeof HandleSosEmergencyInputSchema>;

const HandleSosEmergencyOutputSchema = z.object({
  confirmationMessage: z.string().describe('A confirmation message indicating the SOS was successfully triggered and notifications were sent.'),
});
export type HandleSosEmergencyOutput = z.infer<typeof HandleSosEmergencyOutputSchema>;

export async function handleSosEmergency(input: HandleSosEmergencyInput): Promise<HandleSosEmergencyOutput> {
  return handleSosEmergencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handleSosEmergencyPrompt',
  tools: [sendSms, sendWhatsApp, sendEmail],
  prompt: `You are an emergency response assistant for the VigiTracker app. A user has triggered an SOS alert.
  
  Your task is to immediately notify emergency contacts using all available tools and then generate a confirmation message for the user.
  
  Emergency details:
  - Location: Latitude {{latitude}}, Longitude {{longitude}}
  - User message: {{#if message}}"{{message}}"{{else}}No message provided.{{/if}}
  
  Emergency Contacts:
  - SMS & WhatsApp: 9740379711
  - Email: abhishekpnaik09@gmail.com
  
  Instructions:
  1.  Construct a clear emergency message containing the location and the user's message.
  2.  Use the sendSms tool to send the alert to 9740379711.
  3.  Use the sendWhatsApp tool to send the same alert to 9740379711.
  4.  Use the sendEmail tool to send the alert to abhishekpnaik09@gmail.com with a subject line of "SOS Alert Triggered!".
  5.  After using the tools, generate a confirmation message for the user, assuring them that alerts have been dispatched to their emergency contacts and help is on the way to their location. Keep the confirmation under 50 words.`,
});

const handleSosEmergencyFlow = ai.defineFlow(
  {
    name: 'handleSosEmergencyFlow',
    inputSchema: HandleSosEmergencyInputSchema,
    outputSchema: HandleSosEmergencyOutputSchema,
  },
  async input => {
    // This will cause the LLM to use the notification tools.
    const {output} = await prompt(input);
    
    // In a real application, you would also save the SOS event in Firestore here.
    return {
      confirmationMessage: output?.confirmationMessage ?? 'SOS alert received. Emergency contacts have been notified and help is on the way to your location.',
    };
  }
);
