"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (user.email !== "EventoMujer@gmail.com") {
        router.push("/");
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) return <p className="p-10">Verificando acceso...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Panel de Administrador 🔐
      </h1>

      <p className="mt-4">
        Acceso autorizado.
      </p>
    </div>
  );
}