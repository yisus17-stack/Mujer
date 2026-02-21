"use client";

import Link from "next/link";

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/1JJBstL9vw/" },
    { icon: Instagram, href: "https://instagram.com/tupagina" },
    { icon: Twitter, href: "https://twitter.com/tupagina" },
    { icon: Linkedin, href: "https://linkedin.com/company/tupagina" },
  ];

  return (
    <footer className="bg-[#0F172A] text-white pt-20 pb-8 relative overflow-hidden">
      {/* Línea superior decorativa */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9F1239] to-[#FFB6CD]"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-[#FFB6CD]/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-[#9F1239]/5 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Columna 1 */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-3xl font-bold bg-gradient-to-r from-[#FFB6CD] to-[#9F1239] bg-clip-text text-transparent"
            >
              Evento Mujer
            </Link>

            <p className="text-gray-300 text-sm leading-relaxed">
              Inspirando y empoderando a la próxima generación de mujeres
              líderes en Maravatío y todo Michoacán.
            </p>

            {/* Redes sociales */}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;

                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FFB6CD] hover:text-[#0F172A] hover:scale-110 transition-all duration-300"
                  >
                    <Icon size={18} strokeWidth={1.8} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Columna 2 */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFB6CD] mb-4">
              Enlaces rápidos
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Inicio", href: "/" },
                { label: "Sobre el evento", href: "/#sobre" },
                { label: "Nuestras ponentes", href: "/#ponentes" },
                { label: "Patrocinadores", href: "/#patrocinadores" },
                { label: "Registro", href: "/registro" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#FFB6CD] transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 text-[#FFB6CD] opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFB6CD] mb-4">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin
                  className="text-[#FFB6CD] mt-1"
                  size={18}
                  strokeWidth={1.8}
                />
                <span className="text-gray-300 text-sm">
                  Centro Cultural Maravatío
                  <br />
                  Maravatío, Michoacán
                </span>
              </li>

              <li className="flex items-center space-x-3">
                <Mail className="text-[#FFB6CD]" size={18} strokeWidth={1.8} />
                <a
                  href="mailto:info@eventomujer.com"
                  className="text-gray-300 hover:text-[#FFB6CD] transition text-sm"
                >
                  info@eventomujer.com
                </a>
              </li>

              <li className="flex items-center space-x-3">
                <Phone className="text-[#FFB6CD]" size={18} strokeWidth={1.8} />
                <a
                  href="tel:+524471234567"
                  className="text-gray-300 hover:text-[#FFB6CD] transition text-sm"
                >
                  +52 447 123 4567
                </a>
              </li>

              <li className="flex items-center space-x-3">
                <Clock className="text-[#FFB6CD]" size={18} strokeWidth={1.8} />
                <span className="text-gray-300 text-sm">
                  8:00 AM - Domingo 8 de marzo
                </span>
                
              </li>
            </ul>
          </div>
          {/* Columna 4 - Acceso */}
          <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#FFB6CD] mb-4">
            Acceso
          </h3>

          <div className="flex flex-col space-y-4">
            {/* Botón Registro */}
          <Link
            href="/registro"
            className="bg-gradient-to-r from-[#9F1239] to-[#FFB6CD] text-white px-6 py-3 rounded-full font-semibold text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Registrarme
          </Link>

    {/* Botón Admin */}
    <Link
      href="/login"
      className="border border-[#FFB6CD] text-[#FFB6CD] px-6 py-3 rounded-full font-semibold text-center hover:bg-[#FFB6CD] hover:text-[#0F172A] transition-all duration-300 flex items-center justify-center space-x-2"
    >
      <span>🔐</span>
      <span>Iniciar sesión Admin</span>
    </Link>
  </div>
          </div>
        </div>

        {/* Separador */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0F172A] px-4 text-sm text-gray-400">
              ✦ ✦ ✦
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 space-y-4 md:space-y-0">
          <p>
            © {new Date().getFullYear()} Evento Mujer Maravatío. Todos los
            derechos reservados.
          </p>

          <div className="flex space-x-6">
            <Link href="#" className="hover:text-[#FFB6CD] transition">
              Aviso de privacidad
            </Link>
            <Link href="#" className="hover:text-[#FFB6CD] transition">
              Términos y condiciones
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          Hecho con 💜 para las mujeres de Maravatío
        </div>
      </div>
    </footer>
  );
}
