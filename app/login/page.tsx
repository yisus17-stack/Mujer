"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      setError("Credenciales incorrectas o error de conexión.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] to-[#FFE4EC] flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-[#9F1239] mb-6">Login Administrador</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#9F1239] outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            required
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#9F1239] outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#9F1239] text-white p-3 rounded-lg font-semibold hover:bg-[#7F0F2F] transition"
          >
            Ingresar
          </button>
          
          <Link href="/" className="block text-center text-sm text-gray-500 hover:text-[#9F1239]">
            ← Volver al inicio
          </Link>
        </form>
      </div>
    </div>
  );
}