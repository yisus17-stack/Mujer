"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

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
  const [jersey, setJersey] = useState("no");
  const [tallaPrincipal, setTallaPrincipal] = useState("");
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error' | 'advertencia'; mensaje: string } | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    procedencia: "",
    edad: "",
    recibo: null as File | null,
  });

  // 🔥 CÁLCULO TOTAL
  const totalPagar = useMemo(() => {
    let total = 0;

    if (jersey === "si" && tallaPrincipal) {
      total += PRECIOS[tallaPrincipal] || 0;
    }

    integrantes.forEach((int) => {
      if (int.jersey === "si" && int.talla) {
        total += PRECIOS[int.talla] || 0;
      }
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

  // Función para validar campos vacíos
  const validarCampos = (): { valido: boolean; camposFaltantes: string[] } => {
    const camposFaltantes: string[] = [];

    // Validar campos principales
    if (!formData.nombre.trim()) camposFaltantes.push("Nombre completo");
    if (!formData.procedencia.trim()) camposFaltantes.push("Lugar de procedencia");
    if (!formData.edad.trim()) camposFaltantes.push("Edad");

    // Validar talla si seleccionó jersey
    if (jersey === "si" && !tallaPrincipal) {
      camposFaltantes.push("Talla de jersey principal");
    }

    // Validar integrantes
    integrantes.forEach((int, index) => {
      if (!int.nombre.trim()) {
        camposFaltantes.push(`Nombre del integrante #${index + 1}`);
      }
      if (!int.edad.trim()) {
        camposFaltantes.push(`Edad del integrante #${index + 1}`);
      }
      if (int.jersey === "si" && !int.talla) {
        camposFaltantes.push(`Talla de jersey del integrante #${index + 1}`);
      }
    });

    return {
      valido: camposFaltantes.length === 0,
      camposFaltantes
    };
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      if (file.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const agregarIntegrante = () => {
    setIntegrantes([
      ...integrantes,
      { nombre: "", edad: "", jersey: "no", talla: "" },
    ]);
  };

  const handleIntegranteChange = (
    index: number,
    field: keyof Integrante,
    value: string
  ) => {
    const nuevos = [...integrantes];
    nuevos[index][field] = value;
    setIntegrantes(nuevos);
  };

  const eliminarIntegrante = (index: number) => {
    setIntegrantes(integrantes.filter((_, i) => i !== index));
  };

  const cerrarAlerta = () => {
    setAlerta(null);
  };

  // 🚀 GUARDAR EN SUPABASE
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validar campos antes de enviar
    const validacion = validarCampos();
    if (!validacion.valido) {
      const mensaje = `Campos requeridos faltantes:\n• ${validacion.camposFaltantes.join('\n• ')}`;
      setAlerta({ tipo: 'advertencia', mensaje });
      return;
    }

    try {
      if (totalJerseys > 0 && !formData.recibo) {
        setAlerta({ 
          tipo: 'advertencia', 
          mensaje: "Debe subir el comprobante de pago." 
        });
        return;
      }

      let comprobanteUrl = null;

      // 🔹 Subir comprobante
      if (formData.recibo) {
        const file = formData.recibo;
        const fileName = `${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("comprobantes")
          .upload(fileName, file);

        if (uploadError) {
          setAlerta({ 
            tipo: 'error', 
            mensaje: "Error subiendo comprobante" 
          });
          return;
        }

        const { data } = supabase.storage
          .from("comprobantes")
          .getPublicUrl(fileName);

        comprobanteUrl = data.publicUrl;
      }

      // 🔹 Insertar registro principal
      const { data: registro, error: registroError } = await supabase
        .from("registros")
        .insert([
          {
            nombre: formData.nombre,
            lugar_procedencia: formData.procedencia,
            edad: Number(formData.edad),
            jersey_principal: jersey,
            talla_principal: tallaPrincipal || null,
            total_jerseys: totalJerseys,
            total_pagar: totalPagar,
            comprobante_url: comprobanteUrl,
          },
        ])
        .select()
        .single();

      if (registroError) {
        console.log("ERROR COMPLETO:", JSON.stringify(registroError, null, 2));
        setAlerta({ 
          tipo: 'error', 
          mensaje: "Error guardando el registro" 
        });
        return;
      }

      // 🔹 Insertar integrantes
      if (integrantes.length > 0) {
        const integrantesData = integrantes.map((int) => ({
          registro_id: registro.id,
          nombre: int.nombre,
          edad: Number(int.edad),
          jersey: int.jersey,
          talla: int.talla || null,
        }));

        const { error } = await supabase
          .from("integrantes")
          .insert(integrantesData);

        if (error) {
          setAlerta({ 
            tipo: 'error', 
            mensaje: "Error guardando integrantes" 
          });
          return;
        }
      }

      // ✅ Mostrar mensaje de éxito y limpiar datos
      setAlerta({ 
        tipo: 'exito', 
        mensaje: "¡Registro guardado correctamente! 🎉" 
      });
      
      // 🔄 LIMPIAR TODOS LOS CAMPOS DESPUÉS DE ENVIAR
      setJersey("no");
      setTallaPrincipal("");
      setIntegrantes([]);
      setPreview(null);
      setFormData({
        nombre: "",
        procedencia: "",
        edad: "",
        recibo: null,
      });

    } catch (error) {
      console.error(error);
      setAlerta({ 
        tipo: 'error', 
        mensaje: "Error inesperado" 
      });
    }
  };

  // Función para activar el input file oculto
  const handleComprobanteClick = () => {
    document.getElementById("comprobante-input")?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] to-[#FFE4EC] flex items-center justify-center p-6 relative">
      {/* Alerta personalizada - SIN FONDO NEGRO */}
      {alerta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none">
          {/* Tarjeta de alerta - sin fondo oscuro */}
          <div 
            className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all animate-fadeIn pointer-events-auto
              ${alerta.tipo === 'exito' ? 'border-t-4 border-green-500' : 
                alerta.tipo === 'error' ? 'border-t-4 border-red-500' : 
                'border-t-4 border-yellow-500'}`}
          >
            {/* Icono */}
            <div className="flex justify-center mb-4">
              {alerta.tipo === 'exito' && (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
              {alerta.tipo === 'error' && (
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              )}
              {alerta.tipo === 'advertencia' && (
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
              )}
            </div>

            {/* Mensaje */}
            <div className="text-center mb-6">
              <p className="text-gray-800 text-lg whitespace-pre-line">{alerta.mensaje}</p>
            </div>

            {/* Botón */}
            <button
              onClick={cerrarAlerta}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors
                ${alerta.tipo === 'exito' ? 'bg-green-500 hover:bg-green-600' : 
                  alerta.tipo === 'error' ? 'bg-red-500 hover:bg-red-600' : 
                  'bg-yellow-500 hover:bg-yellow-600'}`}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-[#9F1239] mb-6">
          Registro al Evento 
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#9F1239] focus:border-transparent"
          />

          <input
            type="text"
            name="procedencia"
            placeholder="Lugar de procedencia"
            required
            value={formData.procedencia}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#9F1239] focus:border-transparent"
          />

          <input
            type="number"
            name="edad"
            placeholder="Edad"
            required
            value={formData.edad}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#9F1239] focus:border-transparent"
          />
            
          <div className="w-full">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              ¿Desea jersey?
            </label>
            <select
              value={jersey}
              onChange={(e) => setJersey(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9F1239] transition"
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {jersey === "si" && (
            <select
              value={tallaPrincipal}
              onChange={(e) => setTallaPrincipal(e.target.value)}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#9F1239] focus:border-transparent"
            >
              <option value="">Selecciona talla</option>
              {Object.keys(PRECIOS).map((t) => (
                <option key={t} value={t}>
                  {t} - ${PRECIOS[t]} MXN
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={agregarIntegrante}
            className="bg-[#9F1239] text-white px-4 py-2 rounded-lg hover:bg-[#7F0F2F] transition"
          >
            + Agregar integrante
          </button>

          {integrantes.map((int, index) => (
            <div key={index} className="bg-pink-50 p-4 rounded-lg space-y-3 border border-pink-200">
              <input
                type="text"
                placeholder="Nombre"
                value={int.nombre}
                onChange={(e) =>
                  handleIntegranteChange(index, "nombre", e.target.value)
                }
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#9F1239] focus:border-transparent"
              />

              <input
                type="number"
                placeholder="Edad"
                value={int.edad}
                onChange={(e) =>
                  handleIntegranteChange(index, "edad", e.target.value)
                }
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#9F1239] focus:border-transparent"
              />
              
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                ¿También desea jersey?
              </label>
              <select
                value={int.jersey}
                onChange={(e) =>
                  handleIntegranteChange(index, "jersey", e.target.value)
                }
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#9F1239] focus:border-transparent"
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>

              {int.jersey === "si" && (
                <select
                  value={int.talla}
                  onChange={(e) =>
                    handleIntegranteChange(index, "talla", e.target.value)
                  }
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-[#9F1239] focus:border-transparent"
                >
                  <option value="">Selecciona talla</option>
                  {Object.keys(PRECIOS).map((t) => (
                    <option key={t} value={t}>
                      {t} - ${PRECIOS[t]} MXN
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={() => eliminarIntegrante(index)}
                className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-sm"
              >
                Eliminar integrante
              </button>
            </div>
          ))}

          {totalJerseys > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-gray-700">Jerseys: {totalJerseys}</p>
              <p className="font-bold text-lg text-green-700">
                Total: ${totalPagar} MXN
              </p>
            </div>
          )}

          {totalJerseys > 0 && (
            <div className="space-y-2">
              <input
                id="comprobante-input"
                type="file"
                name="recibo"
                accept="image/*,.pdf"
                required
                onChange={handleChange}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={handleComprobanteClick}
                className="w-full bg-blue-50 border-2 border-dashed border-blue-300 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
              >
                📎 Colocar comprobante de pago (Solo imágenes y PDF)
              </button>
              
              {preview && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">✅ Comprobante seleccionado</p>
                  <img src={preview} alt="Vista previa" className="mt-2 max-h-32 rounded-lg border" />
                </div>
              )}
              {formData.recibo && !preview && (
                <p className="text-sm text-green-600">
                  ✅ Archivo seleccionado: {formData.recibo.name}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#9F1239] to-[#FFB6CD] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Enviar Registro 
          </button>

          <Link href="/">
            <button
              type="button"
              className="w-full border border-[#9F1239] text-[#9F1239] py-3 rounded-lg font-semibold hover:bg-pink-50 transition"
            >
              ← Regresar al Inicio
            </button>
          </Link>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}