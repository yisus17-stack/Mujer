
"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useFirestore, useStorage } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";

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
  const storage = useStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jersey, setJersey] = useState("no");
  const [tallaPrincipal, setTallaPrincipal] = useState("");
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error' | 'advertencia'; mensaje: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
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
    if (!db || !storage || isSubmitting) return;

    setIsSubmitting(true);
    let comprobanteUrl = "";

    try {
      // Subir comprobante si existe y hay jerseys solicitados
      if (file && totalJerseys > 0) {
        setUploading(true);
        const storageRef = ref(storage, `comprobantes/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        comprobanteUrl = await getDownloadURL(snapshot.ref);
        setUploading(false);
      }

      const registrationData = {
        nombre: formData.nombre,
        lugar_procedencia: formData.procedencia,
        edad: Number(formData.edad),
        jersey_principal: jersey,
        talla_principal: tallaPrincipal || null,
        total_jerseys: totalJerseys,
        total_pagar: totalPagar,
        comprobante_url: comprobanteUrl,
        createdAt: serverTimestamp(),
      };

      const regRef = collection(db, "registrations");
      const docRef = await addDoc(regRef, registrationData);

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

      setAlerta({ tipo: 'exito', mensaje: "¡Registro guardado correctamente! Te esperamos el 8 de marzo. 🎉" });
      setJersey("no");
      setTallaPrincipal("");
      setIntegrantes([]);
      setFile(null);
      setFormData({ nombre: "", procedencia: "", edad: "" });
    } catch (err: any) {
      console.error(err);
      setAlerta({ tipo: 'error', mensaje: "Ocurrió un error al procesar tu registro. Por favor, revisa tu conexión." });
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] to-[#FFE4EC] flex items-center justify-center p-6 pt-24 pb-12">
      {alerta && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAlerta(null)}></div>
          <div className={`relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-t-8 ${alerta.tipo === 'exito' ? 'border-green-500' : 'border-red-500'} animate-in zoom-in duration-300`}>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {alerta.tipo === 'exito' ? (
                  <CheckCircle2 size={64} className="text-green-500" />
                ) : (
                  <AlertCircle size={64} className="text-red-500" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {alerta.tipo === 'exito' ? '¡Excelente!' : 'Ups...'}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">{alerta.mensaje}</p>
            </div>
            <button onClick={() => setAlerta(null)} className="w-full py-4 bg-[#9F1239] text-white rounded-2xl font-bold text-lg hover:bg-[#7F0F2F] transition-all shadow-lg active:scale-95">
              Entendido
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-[2.5rem] p-8 md:p-12 w-full max-w-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#9F1239] via-[#FFB6CD] to-[#9F1239]"></div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#9F1239] mb-2 tracking-tight">Regístrate Aquí ✍️</h1>
          <p className="text-gray-500">Únete a la rodada más grande de Maravatío</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Nombre Completo</label>
              <input type="text" name="nombre" placeholder="Ej. Ana García" required value={formData.nombre} onChange={handleChange} className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-[#9F1239] focus:ring-0 outline-none transition-all bg-gray-50/30" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 ml-1">Procedencia</label>
                <input type="text" name="procedencia" placeholder="Ciudad / Municipio" required value={formData.procedencia} onChange={handleChange} className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-[#9F1239] focus:ring-0 outline-none transition-all bg-gray-50/30" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 ml-1">Edad</label>
                <input type="number" name="edad" placeholder="00" required value={formData.edad} onChange={handleChange} className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-[#9F1239] focus:ring-0 outline-none transition-all bg-gray-50/30" />
              </div>
            </div>
          </div>
          
          <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100">
            <label className="block text-sm font-bold text-[#9F1239] mb-3">¿Deseas adquirir el jersey oficial del evento?</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => setJersey("no")} 
                className={`py-3 rounded-xl font-bold transition-all border-2 ${jersey === "no" ? 'bg-[#9F1239] text-white border-[#9F1239]' : 'bg-white text-gray-500 border-gray-100 hover:border-pink-200'}`}
              >
                No, gracias
              </button>
              <button 
                type="button" 
                onClick={() => setJersey("si")} 
                className={`py-3 rounded-xl font-bold transition-all border-2 ${jersey === "si" ? 'bg-[#9F1239] text-white border-[#9F1239]' : 'bg-white text-gray-500 border-gray-100 hover:border-pink-200'}`}
              >
                Sí, lo quiero
              </button>
            </div>

            {jersey === "si" && (
              <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                <select value={tallaPrincipal} onChange={(e) => setTallaPrincipal(e.target.value)} required className="w-full border-2 border-white p-4 rounded-2xl focus:border-[#9F1239] focus:ring-0 outline-none transition-all bg-white shadow-sm font-medium">
                  <option value="">Selecciona tu talla</option>
                  {Object.keys(PRECIOS).map((t) => <option key={t} value={t}>{t} - ${PRECIOS[t]} MXN</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Acompañantes</h3>
              <button type="button" onClick={agregarIntegrante} className="text-sm font-bold text-[#9F1239] flex items-center gap-1 hover:underline">
                + Agregar uno
              </button>
            </div>

            {integrantes.map((int, index) => (
              <div key={index} className="bg-white p-5 rounded-3xl border-2 border-gray-50 space-y-4 relative shadow-sm animate-in slide-in-from-right-4 duration-300">
                <button 
                  type="button" 
                  onClick={() => eliminarIntegrante(index)} 
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
                <input type="text" placeholder="Nombre completo" value={int.nombre} onChange={(e) => handleIntegranteChange(index, "nombre", e.target.value)} className="w-full border-b-2 border-gray-100 p-2 focus:border-[#9F1239] outline-none transition-all bg-transparent font-medium" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Edad" value={int.edad} onChange={(e) => handleIntegranteChange(index, "edad", e.target.value)} className="w-full border-b-2 border-gray-100 p-2 focus:border-[#9F1239] outline-none transition-all bg-transparent font-medium" />
                  <select value={int.jersey} onChange={(e) => handleIntegranteChange(index, "jersey", e.target.value)} className="w-full border-b-2 border-gray-100 p-2 focus:border-[#9F1239] outline-none transition-all bg-transparent font-medium">
                    <option value="no">Sin Jersey</option>
                    <option value="si">Con Jersey</option>
                  </select>
                </div>
                {int.jersey === "si" && (
                  <select value={int.talla} onChange={(e) => handleIntegranteChange(index, "talla", e.target.value)} required className="w-full border-2 border-pink-50 p-3 rounded-xl focus:border-[#9F1239] outline-none bg-pink-50/30 text-sm font-bold text-[#9F1239]">
                    <option value="">Selecciona talla</option>
                    {Object.keys(PRECIOS).map((t) => <option key={t} value={t}>{t} - ${PRECIOS[t]} MXN</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>

          {(totalJerseys > 0) && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="bg-[#0F172A] p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-sm font-medium">Jerseys solicitados:</span>
                  <span className="font-black text-xl">{totalJerseys}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-pink-200 text-sm font-bold uppercase tracking-widest">Total a Pagar</span>
                  <span className="text-3xl font-black text-[#FFB6CD]">${totalPagar.toLocaleString()} <span className="text-xs">MXN</span></span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                  <Upload size={16} className="text-[#9F1239]" />
                  Sube tu comprobante de pago
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${file ? 'border-green-400 bg-green-50/30' : 'border-gray-200 hover:border-[#9F1239] hover:bg-pink-50/10'}`}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  {file ? (
                    <div className="flex flex-col items-center text-green-700">
                      <CheckCircle2 size={32} className="mb-2" />
                      <p className="font-bold text-sm truncate max-w-xs">{file.name}</p>
                      <p className="text-xs opacity-70">Haz clic para cambiar de archivo</p>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <Upload size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="font-medium text-sm">Selecciona una imagen del comprobante</p>
                      <p className="text-xs">JPG, PNG hasta 5MB</p>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 text-center italic">
                  * Si pides jersey, tu registro se validará una vez confirmado el pago.
                </p>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting || (totalJerseys > 0 && !file)}
            className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-3 ${
              isSubmitting || (totalJerseys > 0 && !file) 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#9F1239] to-[#FFB6CD] text-white hover:scale-[1.02] hover:shadow-pink-200/50'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </>
            ) : (
              'Confirmar Registro ✨'
            )}
          </button>
          
          <Link href="/" className="block text-center text-gray-400 hover:text-[#9F1239] transition-colors text-sm font-bold pt-4">
            ← Volver al Inicio
          </Link>
        </form>
      </div>
    </div>
  );
}
