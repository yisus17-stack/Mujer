'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './init';

/**
 * FirebaseClientProvider garantiza que Firebase solo se inicialice en el lado del cliente.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [services, setServices] = useState<{
    app: any;
    auth: any;
    db: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const initialized = initializeFirebase();
      setServices(initialized);
    } catch (err: any) {
      console.error("Error al inicializar Firebase:", err);
      setError(err.message);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5] p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error de Configuración</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-400">Asegúrate de haber conectado tu proyecto de Firebase en la consola.</p>
        </div>
      </div>
    );
  }

  if (!services) {
    return <div className="min-h-screen bg-[#FFFBF5]" />;
  }

  return (
    <FirebaseProvider 
      firebaseApp={services.app} 
      firestore={services.db} 
      auth={services.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
