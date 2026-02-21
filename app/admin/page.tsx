"use client";

import { useEffect, useMemo } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import { Download, Users, Ticket, DollarSign, Calendar, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const { user, isLoading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Redirección si no es el administrador autorizado
  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.email !== ADMIN_EMAIL) {
        console.warn("Acceso denegado: el correo no coincide con el admin.");
        router.push("/");
      }
    }
  }, [user, userLoading, router, ADMIN_EMAIL]);

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

  // Si no hay usuario o el email no coincide, no renderizamos nada (el useEffect redirige)
  if (!user || user.email !== ADMIN_EMAIL) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto pt-24 pb-12 px-6">
        {/* Cabecera del Panel */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-[#FFB6CD]/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#9F1239]"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={18} className="text-[#9F1239]" />
                <span className="text-xs font-black uppercase tracking-widest text-[#9F1239]">Sesión Segura</span>
              </div>
              <h1 className="text-3xl font-bold text-[#0F172A]">
                Panel de Control ✨
              </h1>
              <p className="text-gray-500">
                Bienvenida, <span className="font-semibold text-[#9F1239]">{user.email}</span>
              </p>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 bg-[#0F172A] text-white px-6 py-3 rounded-2xl hover:bg-[#1E293B] transition-all shadow-lg hover:scale-105 active:scale-95 font-bold"
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
                <h3 className="font-bold text-lg">Inscritas</h3>
              </div>
              <p className="text-4xl font-black text-[#0F172A]">{stats.total}</p>
              <p className="text-xs text-gray-400 mt-2 uppercase tracking-tighter">Personas totales</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-transparent p-6 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 text-blue-700 mb-3">
                <Ticket size={22} />
                <h3 className="font-bold text-lg">Jerseys</h3>
              </div>
              <p className="text-4xl font-black text-[#0F172A]">{stats.jerseys}</p>
              <p className="text-xs text-gray-400 mt-2 uppercase tracking-tighter">Unidades vendidas</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-transparent p-6 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-3 text-emerald-700 mb-3">
                <DollarSign size={22} />
                <h3 className="font-bold text-lg">Recaudación</h3>
              </div>
              <p className="text-4xl font-black text-[#0F172A]">${stats.revenue.toLocaleString()} MXN</p>
              <p className="text-xs text-gray-400 mt-2 uppercase tracking-tighter">Total por jerseys</p>
            </div>
          </div>
        </div>

        {/* Tabla Detallada */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0F172A]">Listado de Asistentes</h2>
            <div className="text-xs text-gray-400 flex items-center gap-2 font-bold uppercase tracking-widest">
              <Calendar size={14} />
              Actualización en tiempo real
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-8 py-5">Nombre / Procedencia</th>
                  <th className="px-8 py-5 text-center">Edad</th>
                  <th className="px-8 py-5 text-center">Jerseys</th>
                  <th className="px-8 py-5">Talla / Pago</th>
                  <th className="px-8 py-5">Comprobante</th>
                  <th className="px-8 py-5">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {registrations?.map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-900 group-hover:text-[#9F1239] transition-colors">
                        {reg.nombre}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{reg.lugar_procedencia}</div>
                    </td>
                    <td className="px-8 py-5 text-center text-gray-600 font-medium">
                      {reg.edad}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${reg.total_jerseys > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                        {reg.total_jerseys} JRS
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-xs font-bold text-gray-900 uppercase">
                        {reg.talla_principal || "—"}
                      </div>
                      <div className="text-sm font-black text-[#9F1239]">
                        ${reg.total_pagar?.toLocaleString()} MXN
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {reg.comprobante_url ? (
                        <a 
                          href={reg.comprobante_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-tighter bg-blue-50 px-2 py-1 rounded-md"
                        >
                          Ver Imagen 🖼️
                        </a>
                      ) : (
                        <span className="text-[10px] font-black text-gray-300 uppercase">Sin Pago</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-[10px] font-bold text-gray-400 uppercase">
                        {reg.createdAt?.toDate 
                          ? reg.createdAt.toDate().toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) 
                          : '...'}
                      </div>
                    </td>
                  </tr>
                ))}
                {registrations?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center gap-4 text-gray-300">
                        <Users size={64} strokeWidth={1} />
                        <p className="text-lg font-bold">No hay registros confirmados todavía.</p>
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
