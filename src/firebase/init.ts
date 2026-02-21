'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * Inicializa los servicios de Firebase de forma segura en el cliente.
 * Verifica que la configuración mínima (apiKey) esté presente antes de intentar inicializar.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') return null;

  // Evitamos el error "invalid-api-key" si la variable no está configurada aún
  if (!firebaseConfig.apiKey) {
    console.warn("Aviso: NEXT_PUBLIC_FIREBASE_API_KEY no encontrada. Configura tu .env.local para activar las funciones de base de datos.");
    return null;
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  return { app, auth, db, storage };
}
