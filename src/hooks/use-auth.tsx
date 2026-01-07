'use client';

import { useContext } from 'react';
import { FirebaseContext, type FirebaseContextState } from '@/firebase';

export const useAuth = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context;
};

    