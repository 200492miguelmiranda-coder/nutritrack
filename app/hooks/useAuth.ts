"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase, supabaseListo } from "@/app/lib/supabase";

export interface Sesion {
  userId: string | null;
  email: string | null;
}

export function useAuth() {
  const [sesion, setSesion] = useState<Sesion>({ userId: null, email: null });
  const [cargando, setCargando] = useState(true);
  const [enlaceEnviado, setEnlaceEnviado] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setCargando(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      setSesion({ userId: u?.id ?? null, email: u?.email ?? null });
      setCargando(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const u = session?.user;
      setSesion({ userId: u?.id ?? null, email: u?.email ?? null });
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const entrar = useCallback(async (email: string) => {
    if (!supabase) return { error: "Supabase no está configurado." };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    if (error) return { error: error.message };
    setEnlaceEnviado(true);
    return { error: null };
  }, []);

  const salir = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setEnlaceEnviado(false);
  }, []);

  return {
    disponible: supabaseListo,
    sesion,
    cargando,
    enlaceEnviado,
    entrar,
    salir,
  };
}

export type Auth = ReturnType<typeof useAuth>;
