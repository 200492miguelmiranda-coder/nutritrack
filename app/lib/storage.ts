// Capa de persistencia local de NutriTrack.
// Guarda el perfil y un registro diario por fecha en localStorage.

import { Perfil } from "./diet";
import { Tema, TEMA_POR_DEFECTO } from "./tema";

export interface DayLog {
  date: string; // YYYY-MM-DD
  weight: number | null;
  waterMl: number;
  sodaMl: number;
  walked: boolean;
  meals: string[]; // nombres de comidas marcadas como hechas
}

export interface AppData {
  perfil: Perfil | null;
  logs: Record<string, DayLog>;
  metaKg: number; // primer objetivo de kg a bajar
  creado: string; // fecha ISO de creación del perfil
  tema: Tema; // personalización visual
  avatar?: string; // emoji de avatar (opcional)
}

export const STORAGE_KEY = "nutritrack:data:v2";
const LEGACY_KEY = "nutritrack:perfil";

export function fechaKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function diaVacio(date: string): DayLog {
  return { date, weight: null, waterMl: 0, sodaMl: 0, walked: false, meals: [] };
}

export function datosPorDefecto(): AppData {
  return { perfil: null, logs: {}, metaKg: 8, creado: fechaKey(), tema: { ...TEMA_POR_DEFECTO } };
}

export function cargarDatos(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...datosPorDefecto(), ...JSON.parse(raw) };
    // Migración desde la versión anterior que solo guardaba el perfil
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const perfil = JSON.parse(legacy) as Perfil;
      return { ...datosPorDefecto(), perfil };
    }
  } catch {
    // localStorage no disponible o dato inválido
  }
  return datosPorDefecto();
}

export function guardarDatos(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sin persistencia: la sesión sigue funcionando en memoria
  }
}

// Devuelve las últimas N fechas (incluyendo hoy) como claves YYYY-MM-DD.
export function ultimasFechas(n: number): string[] {
  const salida: string[] = [];
  const base = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    salida.push(fechaKey(d));
  }
  return salida;
}

export function etiquetaCorta(fecha: string): string {
  const [, m, d] = fecha.split("-");
  return `${d}/${m}`;
}
