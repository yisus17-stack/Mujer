"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-4 px-4 md:px-8 flex justify-between items-center bg-white/90 backdrop-blur-md shadow-lg border-b border-[#FFB6CD]/30 animate-slideDown">
      <Link
        href="/"
        className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#9F1239] to-[#FFB6CD] bg-clip-text text-transparent"
      >
        Evento Mujer
        <span className="text-[#0F172A] text-lg ml-2 font-normal">2026</span>
      </Link>

      <div className="space-x-8 hidden md:flex">
        {[
          { label: "Inicio", href: "/" },
          { label: "Sobre", href: "/#sobre" },
          { label: "Ruta", href: "/#rodada" },
          { label: "Patrocinadores", href: "/#patrocinadores" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="font-medium hover:text-[#9F1239] transition-colors relative group"
          >
            {item.label}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9F1239] group-hover:w-full transition-all duration-300"></span>
          </Link>
        ))}
      </div>

      <Link
        href="/registro"
        className="bg-gradient-to-r from-[#9F1239] to-[#FFB6CD] text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        Registrarme
      </Link>
    </nav>
  );
}
