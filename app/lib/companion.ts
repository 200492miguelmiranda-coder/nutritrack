// Acompañante nutricional de NutriTrack.
// Filosofía: "Mejorar la alimentación de forma sostenible, una decisión a la vez."
// No regaña, no trata una comida fuera del plan como un fracaso, no da dietas extremas,
// y prioriza proteína y saciedad. No inventa diagnósticos médicos.

const PALABRAS_PROTEINA = [
  "huevo", "huevos", "pollo", "carne", "res", "bistec", "atun", "atún", "pescado",
  "pavo", "frijol", "frijoles", "lenteja", "lentejas", "queso", "requeson", "requesón",
  "yogur", "leche", "proteina", "proteína", "cerdo", "camaron", "camarón", "tofu",
];

const PALABRAS_REFRESCO = ["refresco", "coca", "soda", "gaseosa"];

export function detectaProteina(descripcion: string): boolean {
  const t = descripcion.toLowerCase();
  return PALABRAS_PROTEINA.some((p) => t.includes(p));
}

export function detectaRefresco(descripcion: string): boolean {
  const t = descripcion.toLowerCase();
  return PALABRAS_REFRESCO.some((p) => t.includes(p));
}

interface DatosMensaje {
  momento: string;
  descripcion: string;
  kcalMax?: number | null;
  kcalHoy: number; // kcal acumuladas del día (usando el máximo estimado)
  kcalMeta: number; // objetivo diario de referencia
}

// Genera un mensaje de acompañante práctico y alentador para una comida registrada.
export function mensajeComida(d: DatosMensaje): string {
  const alta = detectaProteina(d.descripcion);
  const partes: string[] = [];

  partes.push(`Listo, registré tu ${d.momento.toLowerCase()}.`);

  if (alta) {
    partes.push("Buena elección: es alta en proteína y probablemente te dará buena saciedad.");
  } else {
    partes.push("Registrado. Si puedes, suma una fuente de proteína para sentirte más satisfecho.");
  }

  if (detectaRefresco(d.descripcion)) {
    partes.push("Vi que incluye refresco: sin problema, la idea es bajarlo poco a poco, no de golpe.");
  }

  const restante = d.kcalMeta - d.kcalHoy;
  if (d.kcalHoy > 0 && restante < d.kcalMeta * 0.15 && restante > 0) {
    partes.push("Vas cerca de tu referencia del día; para lo que resta, algo ligero con proteína y verduras.");
  } else if (restante <= 0) {
    partes.push("Ya cubriste tu referencia de hoy. No pasa nada: mañana seguimos, una decisión a la vez.");
  } else {
    partes.push("Para la siguiente comida podemos priorizar proteína y verduras, sin complicarte.");
  }

  return partes.join(" ");
}

// Suma el máximo estimado de kcal de los registros del día (o 0).
export function kcalDelDia(registros: { kcalMax?: number | null; kcalMin?: number | null }[] = []): number {
  return registros.reduce((s, r) => s + (r.kcalMax ?? r.kcalMin ?? 0), 0);
}
