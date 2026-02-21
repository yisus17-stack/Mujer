
'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * Inicializa los servicios de Firebase de forma segura en el cliente.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') return null;

  if (!firebaseConfig.apiKey) {
    console.warn("Firebase API Key no configurada. Por favor, revisa tus variables de entorno.");
    return null;
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  return { app, auth, db, storage };
}
