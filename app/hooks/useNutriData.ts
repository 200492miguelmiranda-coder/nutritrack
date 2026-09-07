"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AppData,
  DayLog,
  cargarDatos,
  datosPorDefecto,
  diaVacio,
  fechaKey,
  guardarDatos,
} from "@/app/lib/storage";
import { Perfil, ObjetivosNutricionales } from "@/app/lib/diet";
import { RegistroComida } from "@/app/lib/storage";
import type { HabitoDef } from "@/app/lib/habitos";
import { supabase } from "@/app/lib/supabase";

export interface PuntoPeso {
  fecha: string;
  etiqueta: string;
  valor: number;
}

const TABLA = "estado_usuario";

function tieneContenido(d: AppData): boolean {
  return Boolean(d.perfil) || Object.keys(d.logs).length > 0;
}

export function useNutriData(userId: string | null) {
  const [data, setData] = useState<AppData>(datosPorDefecto());
  const [loaded, setLoaded] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cargandoNube = useRef(false);

  // Carga inicial desde localStorage
  useEffect(() => {
    setData(cargarDatos());
    setLoaded(true);
  }, []);

  // Guarda siempre en localStorage (caché local / modo sin sesión)
  useEffect(() => {
    if (loaded) guardarDatos(data);
  }, [data, loaded]);

  // Al iniciar sesión: trae los datos de la nube. Si la nube está vacía,
  // sube lo que haya en este dispositivo (primera migración).
  useEffect(() => {
    const sb = supabase;
    if (!sb || !userId || !loaded) return;
    let cancelado = false;
    (async () => {
      setSincronizando(true);
      cargandoNube.current = true;
      const { data: fila } = await sb.from(TABLA).select("data").eq("user_id", userId).maybeSingle();
      if (cancelado) return;
      const nube = fila?.data as AppData | undefined;
      if (nube && tieneContenido(nube)) {
        setData({ ...datosPorDefecto(), ...nube });
      } else {
        const local = cargarDatos();
        await sb.from(TABLA).upsert({ user_id: userId, data: local, updated_at: new Date().toISOString() });
        setData(local);
      }
      setSincronizando(false);
      // Pequeño margen para que el setData anterior no dispare un upsert redundante
      setTimeout(() => { cargandoNube.current = false; }, 300);
    })();
    return () => { cancelado = true; };
  }, [userId, loaded]);

  // Sube cambios a la nube (con retardo) cuando hay sesión
  useEffect(() => {
    const sb = supabase;
    if (!sb || !userId || !loaded || cargandoNube.current) return;
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      sb.from(TABLA).upsert({ user_id: userId, data, updated_at: new Date().toISOString() });
    }, 800);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [data, userId, loaded]);

  const hoy = fechaKey();
  const logHoy: DayLog = data.logs[hoy] ?? diaVacio(hoy);

  const actualizarHoy = useCallback((patch: Partial<DayLog>) => {
    setData((d) => {
      const actual = d.logs[hoy] ?? diaVacio(hoy);
      return { ...d, logs: { ...d.logs, [hoy]: { ...actual, ...patch } } };
    });
  }, [hoy]);

  const guardarPerfil = useCallback((perfil: Perfil) => {
    // Fusiona sobre el perfil existente para no perder campos adicionales
    setData((d) => ({ ...d, perfil: { ...(d.perfil ?? {}), ...perfil }, creado: d.perfil ? d.creado : fechaKey() }));
  }, []);

  const setObjetivos = useCallback((obj: ObjetivosNutricionales) => {
    setData((d) => ({ ...d, objetivos: obj }));
  }, []);

  const agregarRegistro = useCallback((reg: RegistroComida) => {
    setData((d) => {
      const actual = d.logs[hoy] ?? diaVacio(hoy);
      const registros = [...(actual.registros ?? []), reg];
      return { ...d, logs: { ...d.logs, [hoy]: { ...actual, registros } } };
    });
  }, [hoy]);

  const quitarRegistro = useCallback((id: string) => {
    setData((d) => {
      const actual = d.logs[hoy] ?? diaVacio(hoy);
      const registros = (actual.registros ?? []).filter((r) => r.id !== id);
      return { ...d, logs: { ...d.logs, [hoy]: { ...actual, registros } } };
    });
  }, [hoy]);

  const setTema = useCallback((patch: Partial<AppData["tema"]>) => {
    setData((d) => ({ ...d, tema: { ...d.tema, ...patch } }));
  }, []);

  const setAvatar = useCallback((avatar: string) => {
    setData((d) => ({ ...d, avatar }));
  }, []);

  const agregarHabito = useCallback((def: HabitoDef) => {
    setData((d) => ({ ...d, habitosPersonalizados: [...(d.habitosPersonalizados ?? []), def] }));
  }, []);

  const quitarHabito = useCallback((id: string) => {
    setData((d) => ({ ...d, habitosPersonalizados: (d.habitosPersonalizados ?? []).filter((h) => h.id !== id) }));
  }, []);

  const reiniciar = useCallback(() => setData(datosPorDefecto()), []);

  const seriePeso = useMemo<PuntoPeso[]>(() => {
    const puntos: PuntoPeso[] = [];
    if (data.perfil) {
      puntos.push({ fecha: data.creado, etiqueta: "Inicio", valor: data.perfil.pesoKg });
    }
    Object.values(data.logs)
      .filter((l) => l.weight != null)
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((l) => {
        const [, m, d] = l.date.split("-");
        puntos.push({ fecha: l.date, etiqueta: `${d}/${m}`, valor: l.weight as number });
      });
    return puntos;
  }, [data.logs, data.perfil, data.creado]);

  const pesoInicial = data.perfil?.pesoKg ?? 167;
  const pesoActual = seriePeso.length ? seriePeso[seriePeso.length - 1].valor : pesoInicial;
  const pesoObjetivo = Math.max(0, pesoInicial - data.metaKg);
  const bajado = Math.max(0, pesoInicial - pesoActual);
  const progreso = Math.min(100, Math.max(0, (bajado / data.metaKg) * 100));

  return {
    data,
    loaded,
    sincronizando,
    logHoy,
    actualizarHoy,
    guardarPerfil,
    setObjetivos,
    agregarRegistro,
    quitarRegistro,
    setTema,
    setAvatar,
    agregarHabito,
    quitarHabito,
    reiniciar,
    seriePeso,
    pesoInicial,
    pesoActual,
    pesoObjetivo,
    bajado,
    progreso,
  };
}

export type NutriData = ReturnType<typeof useNutriData>;
