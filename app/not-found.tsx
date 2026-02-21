// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFBF5] via-[#FCE7F3]/30 to-[#FFFBF5] flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Código 404 animado */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-9xl font-bold bg-gradient-to-r from-[#9F1239] to-[#FFB6CD] bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-[15rem] font-bold text-[#9F1239]">✧</span>
          </div>
        </div>

        {/* Mensaje de error */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
          ¡Página no encontrada!
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
          Pero no te preocupes, tenemos muchos eventos increíbles esperándote.
        </p>

        {/* Ilustración simple */}
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#9F1239] to-[#FFB6CD] opacity-20 blur-xl absolute inset-0"></div>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-[#9F1239] to-[#FFB6CD] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              ✦
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-[#9F1239] to-[#FFB6CD] text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            ← Volver al inicio
          </Link>

          <Link
            href="/#eventos"
            className="px-8 py-4 bg-white text-[#0F172A] rounded-full font-semibold shadow-lg border-2 border-[#FFB6CD] hover:border-[#9F1239] hover:scale-105 transition-all duration-300"
          >
            Ver eventos
          </Link>
        </div>

        {/* Sugerencias */}
        <div className="mt-12 pt-8 border-t border-[#FFB6CD]/30">
          <p className="text-sm text-gray-500 mb-4">
            ¿Buscas algo específico? Prueba con:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["Registro", "Ponentes", "Patrocinadores", "Contacto"].map(
              (item, i) => (
                <Link
                  key={i}
                  href={`/#${item.toLowerCase()}`}
                  className="px-4 py-2 bg-[#FCE7F3] text-[#9F1239] rounded-full text-sm hover:bg-[#FFB6CD] hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
