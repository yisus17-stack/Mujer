
'use client';

import React, { useState, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './init';

/**
 * FirebaseClientProvider garantiza que Firebase solo se inicialice en el lado del cliente.
 * Esto evita errores de SSR como "auth/invalid-api-key" cuando las variables de entorno
 * no están disponibles durante la renderización en el servidor.
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

  useEffect(() => {
    try {
      const initialized = initializeFirebase();
      setServices(initialized);
    } catch (error) {
      console.error("Error al inicializar Firebase:", error);
    }
  }, []);

  // Mientras se inicializa en el cliente, mostramos un estado de carga ligero
  // para evitar que los hooks de Firebase en los hijos fallen por falta de contexto.
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
