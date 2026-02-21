'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './init';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Inicializar servicios solo una vez en el cliente
  const services = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return initializeFirebase();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar desajustes de hidratación
  if (!mounted || !services) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#9F1239] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Conectando con el evento...</p>
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
