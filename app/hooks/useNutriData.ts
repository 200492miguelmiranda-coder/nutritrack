"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppData,
  DayLog,
  cargarDatos,
  datosPorDefecto,
  diaVacio,
  fechaKey,
  guardarDatos,
} from "@/app/lib/storage";
import { Perfil } from "@/app/lib/diet";

export interface PuntoPeso {
  fecha: string;
  etiqueta: string;
  valor: number;
}

export function useNutriData() {
  const [data, setData] = useState<AppData>(datosPorDefecto());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(cargarDatos());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) guardarDatos(data);
  }, [data, loaded]);

  const hoy = fechaKey();
  const logHoy: DayLog = data.logs[hoy] ?? diaVacio(hoy);

  const actualizarHoy = useCallback((patch: Partial<DayLog>) => {
    setData((d) => {
      const actual = d.logs[hoy] ?? diaVacio(hoy);
      return { ...d, logs: { ...d.logs, [hoy]: { ...actual, ...patch } } };
    });
  }, [hoy]);

  const guardarPerfil = useCallback((perfil: Perfil) => {
    setData((d) => ({
      ...d,
      perfil,
      creado: d.perfil ? d.creado : fechaKey(),
    }));
  }, []);

  const reiniciar = useCallback(() => setData(datosPorDefecto()), []);

  // Serie de peso para la gráfica: parte del peso inicial y agrega los registros
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
    logHoy,
    actualizarHoy,
    guardarPerfil,
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
