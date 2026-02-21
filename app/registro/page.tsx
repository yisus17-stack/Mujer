"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    try {
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
      const docRef = await addDoc(regRef, registrationData);

      // Add members
      if (integrantes.length > 0) {
        const membersRef = collection(db, "registrations", docRef.id, "members");
        for (const int of integrantes) {
          await addDoc(membersRef, {
            nombre: int.nombre,
            edad: Number(int.edad),
            jersey: int.jersey,
            talla: int.talla || null,
          });
        }
      }

      setAlerta({ tipo: 'exito', mensaje: "¡Registro guardado correctamente! 🎉" });
      setJersey("no");
      setTallaPrincipal("");
      setIntegrantes([]);
      setFormData({ nombre: "", procedencia: "", edad: "" });

    } catch (err: any) {
      const permissionError = new FirestorePermissionError({
        path: "registrations",
        operation: "create",
        requestResourceData: formData,
      });
      errorEmitter.emit('permission-error', permissionError);
      setAlerta({ tipo: 'error', mensaje: "Error al guardar el registro." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] to-[#FFE4EC] flex items-center justify-center p-6">
      {alerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-t-4 ${alerta.tipo === 'exito' ? 'border-green-500' : 'border-red-500'}`}>
            <div className="text-center mb-6">
              <p className="text-gray-800 text-lg">{alerta.mensaje}</p>
            </div>
            <button onClick={() => setAlerta(null)} className="w-full py-3 bg-[#9F1239] text-white rounded-lg font-semibold">
              Aceptar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-[#9F1239] mb-6">Registro al Evento</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="nombre" placeholder="Nombre completo" required value={formData.nombre} onChange={handleChange} className="w-full border p-3 rounded-lg" />
          <input type="text" name="procedencia" placeholder="Lugar de procedencia" required value={formData.procedencia} onChange={handleChange} className="w-full border p-3 rounded-lg" />
          <input type="number" name="edad" placeholder="Edad" required value={formData.edad} onChange={handleChange} className="w-full border p-3 rounded-lg" />
          
          <div>
            <label className="block text-sm font-semibold mb-2">¿Desea jersey?</label>
            <select value={jersey} onChange={(e) => setJersey(e.target.value)} className="w-full border p-3 rounded-lg">
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {jersey === "si" && (
            <select value={tallaPrincipal} onChange={(e) => setTallaPrincipal(e.target.value)} required className="w-full border p-3 rounded-lg">
              <option value="">Selecciona talla</option>
              {Object.keys(PRECIOS).map((t) => <option key={t} value={t}>{t} - ${PRECIOS[t]} MXN</option>)}
            </select>
          )}

          <button type="button" onClick={agregarIntegrante} className="bg-[#9F1239] text-white px-4 py-2 rounded-lg">+ Agregar integrante</button>

          {integrantes.map((int, index) => (
            <div key={index} className="bg-pink-50 p-4 rounded-lg space-y-3 border border-pink-200">
              <input type="text" placeholder="Nombre" value={int.nombre} onChange={(e) => handleIntegranteChange(index, "nombre", e.target.value)} className="w-full border p-2 rounded-lg" />
              <input type="number" placeholder="Edad" value={int.edad} onChange={(e) => handleIntegranteChange(index, "edad", e.target.value)} className="w-full border p-2 rounded-lg" />
              <select value={int.jersey} onChange={(e) => handleIntegranteChange(index, "jersey", e.target.value)} className="w-full border p-2 rounded-lg">
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
              {int.jersey === "si" && (
                <select value={int.talla} onChange={(e) => handleIntegranteChange(index, "talla", e.target.value)} className="w-full border p-2 rounded-lg">
                  <option value="">Selecciona talla</option>
                  {Object.keys(PRECIOS).map((t) => <option key={t} value={t}>{t} - ${PRECIOS[t]} MXN</option>)}
                </select>
              )}
              <button type="button" onClick={() => eliminarIntegrante(index)} className="text-red-600 text-sm">Eliminar integrante</button>
            </div>
          ))}

          {totalJerseys > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-gray-700">Jerseys: {totalJerseys}</p>
              <p className="font-bold text-lg text-green-700">Total: ${totalPagar} MXN</p>
            </div>
          )}

          <button type="submit" className="w-full bg-gradient-to-r from-[#9F1239] to-[#FFB6CD] text-white py-3 rounded-lg font-semibold">Enviar Registro</button>
          <Link href="/" className="block text-center border border-[#9F1239] text-[#9F1239] py-3 rounded-lg font-semibold">← Regresar al Inicio</Link>
        </form>
      </div>
    </div>
  );
}