"use client";

import { useState, useEffect } from "react";

export default function Rodada() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <>
      <section
        id="rodada"
        className={`py-24 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{
          background:
            "linear-gradient(to bottom, white, var(--color-secondary))",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Encabezado */}
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "var(--color-textDark)" }}
            >
              La Rodada
            </h2>
            <p
              className="max-w-2xl mx-auto text-lg"
              style={{ color: "var(--color-textDark)", opacity: 0.8 }}
            >
              Una experiencia que celebra la fuerza, determinación y unión de
              las mujeres. Pedaleamos juntas por Maravatío en una ruta diseñada
              para inspirar.
            </p>
          </div>

          {/* ================= RUTA CORTA ================= */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div
                className="absolute -inset-4 opacity-10 blur-2xl rounded-3xl"
                style={{
                  background:
                    "linear-gradient(to right, var(--color-primary), var(--color-accent))",
                }}
              ></div>

              <div className="relative grid md:grid-cols-2 gap-6">
                <div
                  className="relative rounded-3xl overflow-hidden shadow-2xl border"
                  style={{ borderColor: "var(--color-accent)" }}
                >
                  <div className="absolute top-4 left-4 z-20">
                    <span
                      className="px-4 py-2 text-white font-semibold rounded-full text-sm shadow-md"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      Ruta corta
                    </span>
                  </div>

                  <video
                    src="/information/rutaVideo.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>

                <div
                  onClick={() => setOpen(true)}
                  className="relative rounded-3xl overflow-hidden shadow-xl border cursor-pointer group transition-transform duration-500 hover:scale-[1.02]"
                  style={{ borderColor: "var(--color-secondary)" }}
                >
                  <img
                    src="/information/ruta.jpeg"
                    alt="Mapa de la ruta"
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-12">
              {[
                { title: "Distancia", value: "20 km" },
                { title: "Dificultad", value: "Intermedia" },
                { title: "Hora de reunión", value: "7:30 AM" },
                { title: "Hora de salida", value: "8:00 AM" },
                {
                  title: "Punto de salida",
                  value: "Canchas del Chirimoyo",
                   url:
                    "https://www.google.com/maps/dir/?api=1&destination=Cancha+del+Chirimoyo",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-1"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid var(--color-secondary)",
                  }}
                >
                  <h3
                    className="text-sm font-semibold uppercase tracking-wide mb-2"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "var(--color-textDark)" }}
                  >
                    {item.value}
                  </p>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                    >
                      Ir al punto de salida
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ================= RUTA LARGA ================= */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mt-24">
            <div className="relative">
              <div
                className="absolute -inset-4 opacity-10 blur-2xl rounded-3xl"
                style={{
                  background:
                    "linear-gradient(to right, var(--color-primary), var(--color-accent))",
                }}
              ></div>

              <div className="relative grid md:grid-cols-2 gap-6">
                <div
                  className="relative rounded-3xl overflow-hidden shadow-2xl border"
                  style={{ borderColor: "var(--color-accent)" }}
                >
                  <div className="absolute top-4 left-4 z-20">
                    <span
                      className="px-4 py-2 text-white font-semibold rounded-full text-sm shadow-md"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      Ruta Larga
                    </span>
                  </div>

                  <video
                    src="/information/rutaVideo.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>

                <div
                  onClick={() => setOpen(true)}
                  className="relative rounded-3xl overflow-hidden shadow-xl border cursor-pointer group transition-transform duration-500 hover:scale-[1.02]"
                  style={{ borderColor: "var(--color-secondary)" }}
                >
                  <img
                    src="/information/ruta.jpeg"
                    alt="Mapa de la ruta"
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Distancia", value: "30 km" },
                { title: "Dificultad", value: "Intermedia" },
                { title: "Hora de reuión", value: "7:30 AM" },
                { title: "Hora de salida", value: "8:00 AM" },
                {
                  title: "Punto de salida",
                  value: "Cancha del Chirimoyo",
                  url:
                    "https://www.google.com/maps/dir/?api=1&destination=Cancha+del+Chirimoyo",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-1"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid var(--color-secondary)",
                  }}
                >
                  <h3
                    className="text-sm font-semibold uppercase tracking-wide mb-2"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "var(--color-textDark)" }}
                  >
                    {item.value}
                  </p>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                    >
                      Ir al punto de salida
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-12 right-0 text-white text-3xl"
            >
              ✕
            </button>

            <img
              src="/information/ruta.jpeg"
              alt="Mapa ampliado"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
