"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";

export default function AdminPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    
    // Check specific admin email
    if (!isLoading && user && user.email !== "EventoMujer@gmail.com") {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Verificando acceso...</div>;
  if (!user || user.email !== "EventoMujer@gmail.com") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-24 px-6">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-[#0F172A] mb-4">
            Panel de Administrador 🔐
          </h1>
          <p className="text-gray-600 mb-8">
            Bienvenida, {user.email}. Aquí podrás gestionar los registros del evento.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#9F1239]/5 p-6 rounded-2xl border border-[#9F1239]/10">
              <h3 className="text-[#9F1239] font-bold text-lg mb-2">Registros Totales</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-blue-700 font-bold text-lg mb-2">Jerseys Vendidos</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
              <h3 className="text-green-700 font-bold text-lg mb-2">Ingresos Estimados</h3>
              <p className="text-3xl font-bold">$0 MXN</p>
            </div>
          </div>
          
          <div className="mt-12 text-center text-gray-400 italic">
            El listado detallado de registros se mostrará aquí próximamente.
          </div>
        </div>
      </main>
    </div>
  );
}