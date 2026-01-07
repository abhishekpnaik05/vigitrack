# **App Name**: VigiTracker

## Core Features:

- User Authentication: Secure user authentication using Firebase Auth with Email/Password and Google Sign-In, including route protection and profile management.
- Real-Time GPS Tracking: Display near real-time device locations on maps using Firestore real-time listeners. Marker colors indicate device status (Active, Stopped, Offline).
- Device Management (CRUD): Full CRUD operations for devices, including adding new devices via manual entry or QR code scan, and updating device status in Firestore.
- AI-Powered Geofence Suggestions: Use Genkit and Gemini to analyze device GPS history and suggest structured geofence zones. This feature outputs structured JSON, with user approval required before saving as a tool.
- AI Trip Summary: Generate readable journey summaries from GPS data using Genkit and Gemini. This feature outputs structured, UI-ready JSON.
- SOS Emergency Handling: Implement an SOS emergency system where users can trigger an emergency message using their browser's GPS location and Genkit, saving the event in Firestore and notifying relevant parties as a tool.
- OTA Firmware Updates (ESP32): Implement an OTA update architecture to track firmware versions per device and store firmware metadata in Firestore. Include UI indicators for current version and update availability.

## Style Guidelines:

- Primary color: Indigo (#4F46E5) for a cool and modern feel.
- Background color: Light gray (#F9FAFB), creating a clean and spacious interface.
- Accent color: Emerald (#10B981) for CTAs and highlights, providing a touch of vibrancy.
- Headings: 'Space Grotesk' (sans-serif) for a modern and readable title.
- Body: 'Inter' (sans-serif) for clean and functional UI text.
- Code: 'Source Code Pro' (monospace) for clean representation of OTA versions or any other code on the app.
- FontAwesome or Material Icons: Consistent usage for device status, actions, and alerts.
- Clean enterprise layout with a persistent collapsible sidebar, smooth transitions, and ample spacing.
- Subtle animations using ShadCN loading skeletons for a polished user experience; focus on fast navigation without unnecessary re-renders.