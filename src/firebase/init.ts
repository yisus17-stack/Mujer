'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

/**
 * Inicializa los servicios de Firebase de forma segura.
 * Solo debe ser llamada en el lado del cliente.
 */
export function initializeFirebase() {
  // Verificamos si la configuración es mínima antes de inicializar
  if (!firebaseConfig.apiKey) {
    throw new Error("Firebase API Key no encontrada. Por favor, configura las variables de entorno.");
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  const auth = getAuth(app);
  const db = getFirestore(app);

  return { app, auth, db };
}
