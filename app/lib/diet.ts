// Lógica de generación de dietas flexibles ("para nada estrictas") de NutriTrack.
// No usa APIs externas: todo el cálculo es local, basado en fórmulas nutricionales
// estándar y un banco de alimentos con opciones intercambiables.

export type Sexo = "hombre" | "mujer";
export type Actividad = "sedentario" | "ligero" | "moderado" | "activo";
export type Objetivo = "bajar" | "mantener" | "musculo";
export type Preferencia = "omnivoro" | "sinCerdo" | "vegetariano" | "vegano";

export interface Perfil {
  nombre: string;
  sexo: Sexo;
  edad: number;
  pesoKg: number;
  estaturaCm: number;
  actividad: Actividad;
  objetivo: Objetivo;
  preferencia: Preferencia;
  comidasPorDia: number; // 3 o 4
  evitar: string[]; // alimentos que no le gustan o no puede comer
  // Campos adicionales (opcionales) para el perfil nutricional completo
  horasSueno?: number; // horas de sueño habituales
  comidasPrincipales?: number; // número de comidas principales al día
  aceptaSnack?: boolean; // acepta colación/snack si tiene hambre
  gustos?: string[]; // alimentos favoritos
  estiloComida?: string[]; // económica, práctica, mexicana, etc.
  equipoCasa?: string[]; // equipo de cocina en casa
  equipoTrabajo?: string[]; // equipo disponible en el trabajo
  tiempoPrep?: string; // tiempo disponible para preparar comida
  trabajoHorario?: string; // horario laboral habitual
  notas?: string; // notas libres del perfil
}

// Objetivos nutricionales de referencia. Son guías ajustables, no reglas rígidas.
export interface ObjetivosNutricionales {
  kcal: number;
  proteina: [number, number]; // rango g/día
  carbos: [number, number];
  grasas: [number, number];
}

export interface OpcionComida {
  titulo: string;
  detalle: string;
}

export interface BloqueComida {
  nombre: string; // Desayuno, Comida, Cena, Snack
  horario: string;
  opciones: OpcionComida[];
}

export interface PlanDieta {
  caloriasObjetivo: number;
  rangoCalorias: [number, number];
  proteinaG: number;
  carbohidratosG: number;
  grasasG: number;
  aguaLitros: number;
  resumen: string;
  bloques: BloqueComida[];
  consejos: string[];
}

const FACTOR_ACTIVIDAD: Record<Actividad, number> = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  activo: 1.725,
};

export const ETIQUETAS_ACTIVIDAD: Record<Actividad, string> = {
  sedentario: "Sedentario (poco o nada de ejercicio)",
  ligero: "Ligero (camino o me muevo algunos días)",
  moderado: "Moderado (ejercicio 3–5 días)",
  activo: "Activo (ejercicio casi diario o trabajo físico)",
};

export const ETIQUETAS_OBJETIVO: Record<Objetivo, string> = {
  bajar: "Bajar de peso poco a poco",
  mantener: "Mantener mi peso y comer mejor",
  musculo: "Ganar músculo y fuerza",
};

export const ETIQUETAS_PREFERENCIA: Record<Preferencia, string> = {
  omnivoro: "Como de todo",
  sinCerdo: "Como de todo, menos cerdo",
  vegetariano: "Vegetariano (sin carne ni pescado)",
  vegano: "Vegano (sin productos de origen animal)",
};

// Banco de alimentos. Cada opción declara para qué preferencias sirve.
// "todas" = compatible con cualquier preferencia (vegano sirve para todos).
type Compat = Preferencia[] | "todas";

interface OpcionBanco {
  titulo: string;
  detalle: string;
  compat: Compat;
  // palabras clave para poder excluir lo que la persona quiere evitar
  claves: string[];
}

function sirvePara(compat: Compat, pref: Preferencia): boolean {
  if (compat === "todas") return true;
  return compat.includes(pref);
}

const DESAYUNOS: OpcionBanco[] = [
  { titulo: "Huevos con tortilla", detalle: "3–4 huevos revueltos + 2 tortillas + salsa y verdura al gusto", compat: ["omnivoro", "sinCerdo", "vegetariano"], claves: ["huevo", "tortilla"] },
  { titulo: "Avena con fruta", detalle: "1 taza de avena cocida + 1 fruta picada + un puñito de nueces", compat: "todas", claves: ["avena", "nuez", "fruta"] },
  { titulo: "Yogur con granola", detalle: "1 vaso de yogur natural + granola + fruta", compat: ["omnivoro", "sinCerdo", "vegetariano"], claves: ["yogur", "granola", "lacteo"] },
  { titulo: "Molletes ligeros", detalle: "2 mitades de pan integral + frijoles + queso panela gratinado", compat: ["omnivoro", "sinCerdo", "vegetariano"], claves: ["pan", "frijol", "queso"] },
  { titulo: "Licuado proteico", detalle: "Leche o bebida vegetal + plátano + avena + crema de cacahuate", compat: "todas", claves: ["licuado", "platano", "cacahuate", "leche"] },
  { titulo: "Tofu revuelto", detalle: "Tofu salteado con verduras + 2 tortillas de maíz", compat: ["vegano", "vegetariano"], claves: ["tofu"] },
];

const COMIDAS: OpcionBanco[] = [
  { titulo: "Pollo con arroz", detalle: "200–250 g de pollo + 1 taza de arroz + verduras + 1–2 tortillas", compat: ["omnivoro", "sinCerdo"], claves: ["pollo", "arroz"] },
  { titulo: "Res con verduras", detalle: "180–220 g de res magra + nopales o verduras salteadas + tortillas", compat: ["omnivoro", "sinCerdo"], claves: ["res", "carne"] },
  { titulo: "Pescado al horno", detalle: "1 filete de pescado + camote o papa + ensalada verde", compat: ["omnivoro", "sinCerdo"], claves: ["pescado"] },
  { titulo: "Cerdo en salsa verde", detalle: "180 g de lomo de cerdo + arroz + verduras", compat: ["omnivoro"], claves: ["cerdo"] },
  { titulo: "Tinga de soya", detalle: "Soya texturizada guisada + arroz + frijoles + tortillas", compat: ["vegano", "vegetariano"], claves: ["soya"] },
  { titulo: "Lentejas guisadas", detalle: "1.5 tazas de lentejas con verduras + arroz + tortillas", compat: "todas", claves: ["lenteja"] },
  { titulo: "Bowl de garbanzos", detalle: "Garbanzos + quinoa o arroz + verduras asadas + aguacate", compat: "todas", claves: ["garbanzo", "quinoa", "aguacate"] },
  { titulo: "Tacos de tofu o setas", detalle: "Tofu o setas a la plancha + tortillas + guacamole + verdura", compat: ["vegano", "vegetariano"], claves: ["tofu", "setas", "hongo"] },
];

const CENAS: OpcionBanco[] = [
  { titulo: "Ensalada con proteína", detalle: "Hojas verdes + pollo, atún o garbanzos + aguacate + semillas", compat: "todas", claves: ["ensalada", "atun", "pollo", "garbanzo"] },
  { titulo: "Quesadillas ligeras", detalle: "2 tortillas + queso panela o frijoles + verdura", compat: ["omnivoro", "sinCerdo", "vegetariano"], claves: ["queso", "tortilla", "frijol"] },
  { titulo: "Sopa de verduras", detalle: "Caldo de verduras + una fuente de proteína + 1 tortilla", compat: "todas", claves: ["sopa", "caldo", "verdura"] },
  { titulo: "Huevo a la mexicana", detalle: "2–3 huevos con jitomate y cebolla + frijoles + tortilla", compat: ["omnivoro", "sinCerdo", "vegetariano"], claves: ["huevo", "frijol"] },
  { titulo: "Wrap integral", detalle: "Tortilla integral + hummus o pollo + muchas verduras", compat: "todas", claves: ["wrap", "hummus", "pollo"] },
];

const SNACKS: OpcionBanco[] = [
  { titulo: "Fruta con yogur", detalle: "1 fruta + yogur natural", compat: ["omnivoro", "sinCerdo", "vegetariano"], claves: ["fruta", "yogur"] },
  { titulo: "Puño de nueces", detalle: "Un puñito de nueces, almendras o cacahuates", compat: "todas", claves: ["nuez", "almendra", "cacahuate"] },
  { titulo: "Verduras con hummus", detalle: "Zanahoria y pepino + 2 cucharadas de hummus", compat: "todas", claves: ["hummus", "verdura", "zanahoria"] },
  { titulo: "Fruta fresca", detalle: "1–2 piezas de la fruta que más te guste", compat: "todas", claves: ["fruta"] },
];

function excluir(opciones: OpcionBanco[], pref: Preferencia, evitar: string[]): OpcionBanco[] {
  const evitarNorm = evitar.map((e) => e.trim().toLowerCase()).filter(Boolean);
  const filtradas = opciones.filter((op) => {
    if (!sirvePara(op.compat, pref)) return false;
    const texto = (op.titulo + " " + op.detalle + " " + op.claves.join(" ")).toLowerCase();
    return !evitarNorm.some((mal) => op.claves.some((c) => c.includes(mal) || mal.includes(c)) || texto.includes(mal));
  });
  return filtradas;
}

function tomar(opciones: OpcionBanco[], n: number): OpcionComida[] {
  return opciones.slice(0, n).map((o) => ({ titulo: o.titulo, detalle: o.detalle }));
}

// Redondea a múltiplos amables para que no se vea "estricto".
function redondear(valor: number, paso: number): number {
  return Math.round(valor / paso) * paso;
}

export function generarPlan(perfil: Perfil): PlanDieta {
  const { sexo, edad, pesoKg, estaturaCm, actividad, objetivo, preferencia, comidasPorDia, evitar } = perfil;

  // Metabolismo basal (Mifflin-St Jeor)
  const base = 10 * pesoKg + 6.25 * estaturaCm - 5 * edad;
  const bmr = sexo === "hombre" ? base + 5 : base - 161;
  const tdee = bmr * FACTOR_ACTIVIDAD[actividad];

  // Ajuste según objetivo (deltas suaves, nada agresivo)
  let calorias = tdee;
  if (objetivo === "bajar") calorias = tdee * 0.82; // déficit ~18%
  if (objetivo === "musculo") calorias = tdee * 1.08; // superávit ligero

  // Piso de seguridad para no proponer dietas demasiado bajas
  const piso = sexo === "hombre" ? 1600 : 1300;
  calorias = Math.max(piso, calorias);
  const caloriasObjetivo = redondear(calorias, 50);
  const rangoCalorias: [number, number] = [
    redondear(caloriasObjetivo - 150, 50),
    redondear(caloriasObjetivo + 150, 50),
  ];

  // Macronutrientes
  const proteinaPorKg = objetivo === "musculo" ? 2.0 : objetivo === "bajar" ? 1.8 : 1.5;
  const proteinaG = redondear(proteinaPorKg * pesoKg, 5);
  const grasasG = redondear((caloriasObjetivo * 0.28) / 9, 5);
  const carbohidratosG = redondear((caloriasObjetivo - proteinaG * 4 - grasasG * 9) / 4, 5);

  const aguaLitros = Math.round(Math.min(3.5, Math.max(2, pesoKg * 0.033)) * 10) / 10;

  // Armado de comidas
  const desayunos = excluir(DESAYUNOS, preferencia, evitar);
  const comidas = excluir(COMIDAS, preferencia, evitar);
  const cenas = excluir(CENAS, preferencia, evitar);
  const snacks = excluir(SNACKS, preferencia, evitar);

  const bloques: BloqueComida[] = [
    { nombre: "Desayuno", horario: "7:00–9:00", opciones: tomar(desayunos, 3) },
    { nombre: "Comida", horario: "13:00–15:00", opciones: tomar(comidas, 3) },
    { nombre: "Cena", horario: "19:00–21:00", opciones: tomar(cenas, 3) },
  ];
  if (comidasPorDia >= 4) {
    bloques.splice(2, 0, { nombre: "Snack", horario: "16:00–17:00", opciones: tomar(snacks, 2) });
  }

  const nombre = perfil.nombre.trim() || "Tú";
  const objetivoTexto =
    objetivo === "bajar" ? "bajar de peso de forma sostenible"
    : objetivo === "musculo" ? "ganar músculo con energía"
    : "mantenerte y comer mejor";

  const resumen = `${nombre}, este plan apunta a unas ${caloriasObjetivo} kcal al día para ayudarte a ${objetivoTexto}. No es una dieta estricta: en cada comida eliges la opción que más se te antoje y puedes intercambiar entre ellas.`;

  const consejos = [
    "Elige UNA opción por comida, la que más se te antoje ese día.",
    "Puedes cambiar cualquier alimento por otro parecido. Las porciones son guías, no reglas.",
    "Un día libre a la semana está bien. La constancia importa más que la perfección.",
    objetivo === "bajar"
      ? "Toma agua antes de cada comida: ayuda a sentirte satisfecho."
      : "Si tienes hambre entre comidas, suma un snack; no pasa nada.",
    `Meta de agua: alrededor de ${aguaLitros} L al día.`,
  ];

  return {
    caloriasObjetivo,
    rangoCalorias,
    proteinaG,
    carbohidratosG,
    grasasG,
    aguaLitros,
    resumen,
    bloques,
    consejos,
  };
}
