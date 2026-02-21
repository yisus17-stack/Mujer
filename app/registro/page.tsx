
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

interface Integrante {
  nombre: string;
  edad: string;
  jersey: string;
  talla: string;
}

const PRECIOS: Record<string, number> = {
  XS: 280,
  CH: 280,
  M: 280,
  G: 280,
  XL: 280,
  XXL: 280,
  XXXL: 280,
};

export default function Registro() {
  const db = useFirestore();
  const [jersey, setJersey] = useState("no");
  const [tallaPrincipal, setTallaPrincipal] = useState("");
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error' | 'advertencia'; mensaje: string } | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    procedencia: "",
    edad: "",
  });

  const totalPagar = useMemo(() => {
    let total = 0;
    if (jersey === "si" && tallaPrincipal) total += PRECIOS[tallaPrincipal] || 0;
    integrantes.forEach((int) => {
      if (int.jersey === "si" && int.talla) total += PRECIOS[int.talla] || 0;
    });
    return total;
  }, [jersey, tallaPrincipal, integrantes]);

  const totalJerseys = useMemo(() => {
    let count = 0;
    if (jersey === "si") count++;
    integrantes.forEach((int) => {
      if (int.jersey === "si") count++;
    });
    return count;
  }, [jersey, integrantes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const agregarIntegrante = () => {
    setIntegrantes([...integrantes, { nombre: "", edad: "", jersey: "no", talla: "" }]);
  };

  const handleIntegranteChange = (index: number, field: keyof Integrante, value: string) => {
    const nuevos = [...integrantes];
    nuevos[index][field] = value;
    setIntegrantes(nuevos);
  };

  const eliminarIntegrante = (index: number) => {
    setIntegrantes(integrantes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    const registrationData = {
      nombre: formData.nombre,
      lugar_procedencia: formData.procedencia,
      edad: Number(formData.edad),
      jersey_principal: jersey,
      talla_principal: tallaPrincipal || null,
      total_jerseys: totalJerseys,
      total_pagar: totalPagar,
      createdAt: serverTimestamp(),
    };

    const regRef = collection(db, "registrations");
    
    // Mutación no bloqueante según las guías de Firestore
    addDoc(regRef, registrationData)
      .then(async (docRef) => {
        if (integrantes.length > 0) {
          const membersRef = collection(db, "registrations", docRef.id, "members");
          integrantes.forEach((int) => {
            addDoc(membersRef, {
              nombre: int.nombre,
              edad: Number(int.edad),
              jersey: int.jersey,
              talla: int.talla || null,
            }).catch(async (err) => {
              const permissionError = new FirestorePermissionError({
                path: membersRef.path,
                operation: "create",
                requestResourceData: int,
              } satisfies SecurityRuleContext);
              errorEmitter.emit('permission-error', permissionError);
            });
          });
        }
        setAlerta({ tipo: 'exito', mensaje: "¡Registro guardado correctamente! 🎉" });
        setJersey("no");
        setTallaPrincipal("");
        setIntegrantes([]);
        setFormData({ nombre: "", procedencia: "", edad: "" });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: regRef.path,
          operation: "create",
          requestResourceData: registrationData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        setAlerta({ tipo: 'error', mensaje: "Error al guardar el registro. Intenta de nuevo." });
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] to-[#FFE4EC] flex items-center justify-center p-6">
      {alerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setAlerta(null)}></div>
          <div className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-t-4 ${alerta.tipo === 'exito' ? 'border-green-500' : 'border-red-500'}`}>
            <div className="text-center mb-6">
              <p className="text-gray-800 text-lg">{alerta.mensaje}</p>
            </div>
            <button onClick={() => setAlerta(null)} className="w-full py-3 bg-[#9F1239] text-white rounded-lg font-semibold hover:bg-[#7F0F2F] transition-colors">
              Aceptar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-[#9F1239] mb-6">Registro al Evento</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="nombre" placeholder="Nombre completo" required value={formData.nombre} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#9F1239] outline-none" />
          <input type="text" name="procedencia" placeholder="Lugar de procedencia" required value={formData.procedencia} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#9F1239] outline-none" />
          <input type="number" name="edad" placeholder="Edad" required value={formData.edad} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#9F1239] outline-none" />
          
          <div>
            <label className="block text-sm font-semibold mb-2">¿Deseas el jersey oficial?</label>
            <select value={jersey} onChange={(e) => setJersey(e.target.value)} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#9F1239] outline-none">
              <option value="no">No, gracias</option>
              <option value="si">Sí, lo quiero</option>
            </select>
          </div>

          {jersey === "si" && (
            <select value={tallaPrincipal} onChange={(e) => setTallaPrincipal(e.target.value)} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#9F1239] outline-none">
              <option value="">Selecciona tu talla</option>
              {Object.keys(PRECIOS).map((t) => <option key={t} value={t}>{t} - ${PRECIOS[t]} MXN</option>)}
            </select>
          )}

          <div className="pt-4">
            <button type="button" onClick={agregarIntegrante} className="bg-[#9F1239]/10 text-[#9F1239] px-4 py-2 rounded-lg font-semibold hover:bg-[#9F1239]/20 transition-colors">
              + Agregar acompañante
            </button>
          </div>

          {integrantes.map((int, index) => (
            <div key={index} className="bg-pink-50/50 p-4 rounded-lg space-y-3 border border-pink-100 relative">
              <button 
                type="button" 
                onClick={() => eliminarIntegrante(index)} 
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                ✕
              </button>
              <input type="text" placeholder="Nombre del acompañante" value={int.nombre} onChange={(e) => handleIntegranteChange(index, "nombre", e.target.value)} className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#9F1239] outline-none bg-white" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Edad" value={int.edad} onChange={(e) => handleIntegranteChange(index, "edad", e.target.value)} className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#9F1239] outline-none bg-white" />
                <select value={int.jersey} onChange={(e) => handleIntegranteChange(index, "jersey", e.target.value)} className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#9F1239] outline-none bg-white">
                  <option value="no">Sin Jersey</option>
                  <option value="si">Con Jersey</option>
                </select>
              </div>
              {int.jersey === "si" && (
                <select value={int.talla} onChange={(e) => handleIntegranteChange(index, "talla", e.target.value)} className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#9F1239] outline-none bg-white">
                  <option value="">Selecciona talla</option>
                  {Object.keys(PRECIOS).map((t) => <option key={t} value={t}>{t} - ${PRECIOS[t]} MXN</option>)}
                </select>
              )}
            </div>
          ))}

          {totalJerseys > 0 && (
            <div className="bg-[#9F1239]/5 p-4 rounded-lg border border-[#9F1239]/10">
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>Jerseys solicitados:</span>
                <span className="font-bold">{totalJerseys}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-[#9F1239]">
                <span>Total a pagar:</span>
                <span>${totalPagar} MXN</span>
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-gradient-to-r from-[#9F1239] to-[#FFB6CD] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            Confirmar Registro
          </button>
          
          <Link href="/" className="block text-center text-gray-500 hover:text-[#9F1239] transition-colors text-sm font-medium">
            ← Volver al Inicio
          </Link>
        </form>
      </div>
    </div>
  );
}
