
"use client";

import { useEffect, useMemo } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import { Download, Users, Ticket, DollarSign, Calendar } from "lucide-react";

export default function AdminPage() {
  const { user, isLoading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // Redirección si no es el administrador autorizado
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
    if (!userLoading && user && user.email !== "EventoMujer@gmail.com") {
      router.push("/");
    }
  }, [user, userLoading, router]);

  // Consulta de registros ordenados por fecha de creación
  const registrationsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "registrations"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: registrations, isLoading: regsLoading } = useCollection(registrationsQuery);

  // Cálculo de estadísticas
  const stats = useMemo(() => {
    if (!registrations) return { total: 0, jerseys: 0, revenue: 0 };
    return registrations.reduce((acc, reg: any) => ({
      total: acc.total + 1,
      jerseys: acc.jerseys + (reg.total_jerseys || 0),
      revenue: acc.revenue + (reg.total_pagar || 0)
    }), { total: 0, jerseys: 0, revenue: 0 });
  }, [registrations]);

  if (userLoading || regsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#9F1239] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#9F1239] font-medium">Cargando registros del evento...</p>
        </div>
      </div>
    );
  }

  if (!user || user.email !== "EventoMujer@gmail.com") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto pt-24 pb-12 px-6">
        {/* Cabecera del Panel */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-[#FFB6CD]/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A] flex items-center gap-3">
                Panel de Control 🔐
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenida, <span className="font-semibold text-[#9F1239]">{user.email}</span>.
              </p>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 bg-[#9F1239] text-white px-6 py-3 rounded-full hover:bg-[#7F0F2F] transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <Download size={18} />
              <span>Exportar Reporte</span>
            </button>
          </div>
          
          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#9F1239]/5 to-transparent p-6 rounded-2xl border border-[#9F1239]/10">
              <div className="flex items-center gap-3 text-[#9F1239] mb-3">
                <Users size={22} />
                <h3 className="font-bold text-lg">Registros Totales</h3>
              </div>
              <p className="text-4xl font-black text-[#0F172A]">{stats.total}</p>
              <p className="text-sm text-gray-500 mt-2">Personas inscritas</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-transparent p-6 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 text-blue-700 mb-3">
                <Ticket size={22} />
                <h3 className="font-bold text-lg">Jerseys Apartados</h3>
              </div>
              <p className="text-4xl font-black text-[#0F172A]">{stats.jerseys}</p>
              <p className="text-sm text-gray-500 mt-2">Unidades solicitadas</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-transparent p-6 rounded-2xl border border-green-100">
              <div className="flex items-center gap-3 text-green-700 mb-3">
                <DollarSign size={22} />
                <h3 className="font-bold text-lg">Ingresos Previstos</h3>
              </div>
              <p className="text-4xl font-black text-[#0F172A]">${stats.revenue.toLocaleString()} MXN</p>
              <p className="text-sm text-gray-500 mt-2">Monto total a recaudar</p>
            </div>
          </div>
        </div>

        {/* Tabla Detallada */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0F172A]">Listado de Asistentes</h2>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Calendar size={14} />
              Actualizado en tiempo real
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-widest">
                  <th className="px-8 py-5">Nombre / Procedencia</th>
                  <th className="px-8 py-5 text-center">Edad</th>
                  <th className="px-8 py-5 text-center">Jerseys</th>
                  <th className="px-8 py-5">Talla Principal</th>
                  <th className="px-8 py-5">Total Pago</th>
                  <th className="px-8 py-5">Fecha Reg.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {registrations?.map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-900 group-hover:text-[#9F1239] transition-colors">
                        {reg.nombre}
                      </div>
                      <div className="text-xs text-gray-400">{reg.lugar_procedencia}</div>
                    </td>
                    <td className="px-8 py-5 text-center text-gray-600 font-medium">
                      {reg.edad}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${reg.total_jerseys > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                        {reg.total_jerseys}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-semibold uppercase text-gray-600">
                        {reg.talla_principal || "—"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-black text-[#9F1239]">
                        ${reg.total_pagar?.toLocaleString()} MXN
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-xs text-gray-400">
                        {reg.createdAt?.toDate 
                          ? reg.createdAt.toDate().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) 
                          : 'Procesando...'}
                      </div>
                    </td>
                  </tr>
                ))}
                {registrations?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-300">
                        <Users size={48} strokeWidth={1} />
                        <p className="italic text-lg">No hay registros confirmados todavía.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
