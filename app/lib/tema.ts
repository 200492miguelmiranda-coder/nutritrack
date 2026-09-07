// Personalización visual de NutriTrack: colores, fondo y fuente por perfil.

export interface Tema {
  color: string; // clave de COLORES
  fondo: string; // clave de FONDOS
  fuente: string; // clave de FUENTES
}

export const TEMA_POR_DEFECTO: Tema = { color: "verde", fondo: "suave", fuente: "moderna" };

interface Paleta {
  nombre: string;
  primary: string;
  primary2: string;
  accent: string;
  accentSoft: string;
  soft: string;
  muestra: string; // color para el selector
}

export const COLORES: Record<string, Paleta> = {
  verde:   { nombre: "Bosque",  primary: "#22614a", primary2: "#2f7d5c", accent: "#46c185", accentSoft: "#e4f5ec", soft: "#e8f2ec", muestra: "#2f7d5c" },
  oceano:  { nombre: "Océano",  primary: "#15607a", primary2: "#2b86a6", accent: "#38bdf8", accentSoft: "#e2f4fb", soft: "#e6f2f7", muestra: "#2b86a6" },
  uva:     { nombre: "Uva",     primary: "#4c3a86", primary2: "#6d53b8", accent: "#a78bfa", accentSoft: "#efeafe", soft: "#eee9fa", muestra: "#6d53b8" },
  coral:   { nombre: "Coral",   primary: "#b0463a", primary2: "#d2694f", accent: "#fb8a72", accentSoft: "#fdeae4", soft: "#fbe9e4", muestra: "#d2694f" },
  mango:   { nombre: "Mango",   primary: "#a8641b", primary2: "#cf8a2e", accent: "#f6b64b", accentSoft: "#fdf1dc", soft: "#fbefd9", muestra: "#cf8a2e" },
  grafito: { nombre: "Grafito", primary: "#2f3a42", primary2: "#4a5a64", accent: "#64748b", accentSoft: "#eef1f4", soft: "#eceff2", muestra: "#4a5a64" },
};

export const FONDOS: Record<string, { nombre: string; valor: string }> = {
  suave:     { nombre: "Suave",     valor: "radial-gradient(1100px 560px at 100% -8%, var(--accent-soft) 0%, transparent 60%), radial-gradient(900px 500px at -10% 110%, var(--soft) 0%, transparent 55%), var(--bg)" },
  degradado: { nombre: "Degradado", valor: "linear-gradient(160deg, var(--soft) 0%, var(--bg) 55%)" },
  liso:      { nombre: "Liso",      valor: "var(--bg)" },
  malla:     { nombre: "Malla",     valor: "radial-gradient(var(--border) 1px, transparent 1px) 0 0/22px 22px, var(--bg)" },
};

export const FUENTES: Record<string, { nombre: string; valor: string }> = {
  moderna:    { nombre: "Moderna",    valor: "var(--font-bricolage)" },
  redondeada: { nombre: "Redondeada", valor: "var(--font-fredoka)" },
  geometrica: { nombre: "Geométrica", valor: "var(--font-sora)" },
};

// Devuelve las variables CSS a aplicar en el documento para un tema dado.
export function temaVars(tema: Tema): Record<string, string> {
  const c = COLORES[tema.color] ?? COLORES.verde;
  const fondo = FONDOS[tema.fondo] ?? FONDOS.suave;
  const fuente = FUENTES[tema.fuente] ?? FUENTES.moderna;
  return {
    "--primary": c.primary,
    "--primary-2": c.primary2,
    "--accent": c.accent,
    "--accent-soft": c.accentSoft,
    "--soft": c.soft,
    "--grad-brand": `linear-gradient(135deg, ${c.primary} 0%, ${c.primary2} 55%, ${c.accent} 120%)`,
    "--page-bg": fondo.valor,
    "--font-display": fuente.valor,
  };
}
