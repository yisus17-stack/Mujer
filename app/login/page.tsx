"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, ArrowLeft, ShieldAlert } from "lucide-react";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      
      if (userCredential.user.email === adminEmail) {
        router.push("/admin");
      } else {
        setError("Este correo no tiene permisos de administrador.");
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Correo o contraseña incorrectos.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Demasiados intentos fallidos. Inténtalo más tarde.");
      } else {
        setError("Ocurrió un error al intentar iniciar sesión.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] via-white to-[#FFE4EC] flex items-center justify-center p-6">
      <div className="bg-white shadow-[0_20px_50px_rgba(159,18,57,0.1)] rounded-[2rem] p-8 md:p-12 w-full max-w-md border border-pink-50 relative overflow-hidden">
        {/* Decoración superior */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#9F1239] to-[#FFB6CD]"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#9F1239]/10 rounded-2xl flex items-center justify-center text-[#9F1239] mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#0F172A] text-center">Acceso Admin 🔐</h1>
          <p className="text-gray-500 mt-2 text-center">Gestiona los registros del Evento Mujer 2026</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Correo electrónico</label>
            <input
              type="email"
              placeholder="admin@ejemplo.com"
              required
              value={email}
              className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-[#9F1239] outline-none transition-all bg-gray-50/50"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-[#9F1239] outline-none transition-all bg-gray-50/50"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-medium border border-red-100">
              <ShieldAlert size={18} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#9F1239] text-white p-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#7F0F2F] hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Ingresar al Panel"
            )}
          </button>
          
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-[#9F1239] transition-colors text-sm font-bold py-2"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </form>
      </div>
    </div>
  );
}
