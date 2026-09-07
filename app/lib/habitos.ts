// Catálogo de buenos hábitos, mensajes de ánimo y lógica de racha.

export interface HabitoDef {
  id: string;
  emoji: string;
  titulo: string;
  meta?: string;
}

export const HABITOS: HabitoDef[] = [
  { id: "caminata", emoji: "🚶", titulo: "15 minutos de caminata hoy", meta: "después del trabajo" },
  { id: "noSoda", emoji: "🥤", titulo: "Sin refresco hoy", meta: "o al menos menos que ayer" },
  { id: "agua", emoji: "💧", titulo: "Tomar 1.5–2 L de agua", meta: "a lo largo del día" },
  { id: "proteina", emoji: "🍳", titulo: "Proteína en cada comida", meta: "pollo, huevo, carne o frijol" },
  { id: "verduras", emoji: "🥗", titulo: "Incluir verduras", meta: "aunque sea una porción" },
  { id: "sinDulce", emoji: "🍬", titulo: "Evitar dulces o postres", meta: "hoy" },
  { id: "dormir", emoji: "😴", titulo: "Dormir al menos 7 horas", meta: "descanso = mejores decisiones" },
  { id: "registrar", emoji: "📝", titulo: "Registrar mis comidas", meta: "en el Diario" },
  { id: "noPicar", emoji: "🚫", titulo: "No picar sin hambre", meta: "entre comidas" },
  { id: "cafeSinAzucar", emoji: "☕", titulo: "Café sin azúcar", meta: "o con menos" },
];

// Hábitos que hay que cumplir en un día para que cuente en la racha.
export const UMBRAL_RACHA = 3;

const MENSAJES = [
  "¡Bien hecho! Cada decisión suma. 💪",
  "¡Ese es el camino! Sigue así.",
  "Un paso más hacia tu meta. 🌟",
  "Constancia sobre perfección. ¡Vas genial!",
  "Tu yo del futuro te lo agradece.",
  "¡Excelente elección! 👏",
  "Pequeñas acciones, grandes cambios.",
  "¡Lo estás logrando!",
  "Hoy elegiste cuidarte. 🙌",
  "¡Sigue sumando victorias!",
];

export function mensajeAnimo(): string {
  return MENSAJES[Math.floor(Math.random() * MENSAJES.length)];
}

// Calcula la racha actual: días consecutivos (terminando hoy o ayer)
// en los que se cumplieron al menos UMBRAL_RACHA hábitos.
export function calcularRacha(cumplidosPorFecha: (fecha: string) => number, fechasRecientes: string[]): number {
  // fechasRecientes: de la más antigua a la más reciente
  const desdeHoy = [...fechasRecientes].reverse(); // hoy primero
  let i = 0;
  if ((cumplidosPorFecha(desdeHoy[0]) ?? 0) < UMBRAL_RACHA) i = 1; // hoy en progreso: no rompe la racha
  let racha = 0;
  for (; i < desdeHoy.length; i++) {
    if ((cumplidosPorFecha(desdeHoy[i]) ?? 0) >= UMBRAL_RACHA) racha++;
    else break;
  }
  return racha;
}

// Mejor racha histórica dentro de las fechas dadas (de antigua a reciente).
export function mejorRacha(cumplidosPorFecha: (fecha: string) => number, fechas: string[]): number {
  let mejor = 0;
  let actual = 0;
  for (const f of fechas) {
    if ((cumplidosPorFecha(f) ?? 0) >= UMBRAL_RACHA) {
      actual++;
      mejor = Math.max(mejor, actual);
    } else {
      actual = 0;
    }
  }
  return mejor;
}
