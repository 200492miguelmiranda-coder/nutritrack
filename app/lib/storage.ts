// Capa de persistencia local de NutriTrack.
// Guarda el perfil y un registro diario por fecha en localStorage.

import { Perfil, ObjetivosNutricionales } from "./diet";
import { Tema, TEMA_POR_DEFECTO } from "./tema";

// Un alimento registrado en lenguaje natural, con estimación aproximada de calorías.
export interface RegistroComida {
  id: string;
  momento: string; // Desayuno, Comida, Cena, Snack u otro
  descripcion: string;
  kcalMin?: number | null; // estimación aproximada (rango)
  kcalMax?: number | null;
  altaProteina?: boolean;
  nota?: string; // mensaje del acompañante nutricional
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  weight: number | null;
  waterMl: number;
  sodaMl: number;
  walked: boolean;
  meals: string[]; // nombres de comidas del plan marcadas como hechas
  // Indicadores adicionales de seguimiento (opcionales)
  cinturaCm?: number | null; // circunferencia de cintura
  horasSueno?: number | null; // horas dormidas esa noche
  hambre?: number | null; // 1–10
  energia?: number | null; // 1–10
  dificultad?: number | null; // dificultad de seguir el plan 1–10
  adherencia?: boolean; // día de adherencia al plan
  registros?: RegistroComida[]; // comidas registradas del día
}

export interface AppData {
  perfil: Perfil | null;
  logs: Record<string, DayLog>;
  metaKg: number; // primer objetivo de kg a bajar
  creado: string; // fecha ISO de creación del perfil
  tema: Tema; // personalización visual
  avatar?: string; // emoji de avatar (opcional)
  objetivos?: ObjetivosNutricionales; // metas nutricionales de referencia (ajustables)
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

// Datos iniciales del perfil nutricional del usuario. Se cargan la primera vez
// (cuando no hay nada guardado) y a partir de ahí quedan persistidos y editables.
export function datosSemilla(): AppData {
  const hoy = fechaKey();
  const perfil: Perfil = {
    nombre: "",
    sexo: "hombre",
    edad: 34,
    pesoKg: 167,
    estaturaCm: 183,
    actividad: "sedentario",
    objetivo: "bajar",
    preferencia: "omnivoro",
    comidasPorDia: 2,
    evitar: [],
    horasSueno: 6,
    comidasPrincipales: 2,
    aceptaSnack: true,
    gustos: ["Carne", "Arroz"],
    estiloComida: ["Económica", "Práctica", "Mexicana", "Fácil de preparar", "Para llevar al trabajo", "Sin recetas complicadas"],
    equipoCasa: ["Refrigerador/congelador", "Microondas", "Estufa"],
    equipoTrabajo: ["Microondas"],
    tiempoPrep: "20–30 min",
    trabajoHorario: "Lun–Jue 7:00–17:00 · Vie 7:00–14:30",
    notas: "Come de todo; le gustan especialmente la carne y el arroz. Tolera las verduras aunque no son sus favoritas. Toma café. Objetivo: aumentar agua de forma progresiva y reducir el refresco gradualmente, sin eliminarlo de golpe.",
  };
  const objetivos: ObjetivosNutricionales = {
    kcal: 2600,
    proteina: [160, 180],
    carbos: [250, 280],
    grasas: [75, 90],
  };
  const desayuno: RegistroComida = {
    id: "seed-desayuno",
    momento: "Desayuno",
    descripcion: "~200 g de carne deshebrada con chile, tomate y cebolla + 4 huevos cocidos + 500 ml de agua",
    kcalMin: 710,
    kcalMax: 880,
    altaProteina: true,
    nota: "Desayuno aprobado. Fue una comida alta en proteína y probablemente te dará buena saciedad. Para la siguiente comida podemos moderar un poco la grasa o los carbohidratos. Estimación aproximada, no exacta.",
  };
  return {
    perfil,
    objetivos,
    metaKg: 8, // 167 → 159
    creado: hoy,
    tema: { ...TEMA_POR_DEFECTO },
    logs: {
      [hoy]: { date: hoy, weight: 167, waterMl: 500, sodaMl: 0, walked: false, meals: [], registros: [desayuno] },
    },
  };
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
  // Primera vez sin datos: cargamos el perfil nutricional inicial
  return datosSemilla();
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
