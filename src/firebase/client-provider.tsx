
'use client';

import React, { useState, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './init';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [services, setServices] = useState<{
    app: any;
    auth: any;
    db: any;
    storage: any;
  } | null>(null);

  useEffect(() => {
    const initialized = initializeFirebase();
    if (initialized) {
      setServices(initialized);
    }
  }, []);

  // Si no hay servicios (por ejemplo, SSR o falta de config), renderizamos el esqueleto
  if (!services) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#9F1239] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Conectando con el evento...</p>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={services.app} 
      firestore={services.db} 
      auth={services.auth}
      storage={services.storage}
    >
      {children}
    </FirebaseProvider>
  );
}
