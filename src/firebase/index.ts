'use client';

import { firebaseConfig as hardcodedConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length > 0) {
    return getSdks(getApp());
  }

  // Vercel deployment will use environment variables
  const envConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const hasEnvConfig = Object.values(envConfig).every(Boolean);

  let firebaseApp;
  try {
    // Prefer App Hosting auto-initialization first
    firebaseApp = initializeApp();
  } catch (e) {
    // If that fails, use environment variables if available (for Vercel)
    if (hasEnvConfig) {
      firebaseApp = initializeApp(envConfig);
    } else {
      // Finally, fall back to the hardcoded config for local development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic and environment variable initialization failed. Falling back to hardcoded firebase config.');
      }
      firebaseApp = initializeApp(hardcodedConfig);
    }
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
