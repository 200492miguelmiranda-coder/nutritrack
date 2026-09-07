"use client";

import { NutriData } from "@/app/hooks/useNutriData";
import { diaVacio, etiquetaCorta, ultimasFechas } from "@/app/lib/storage";

interface Props {
  nutri: NutriData;
}

const META_AGUA = 1500;
const LIMITE_REFRESCO = 500;

type Cumple = (log: ReturnType<typeof diaVacio>) => boolean;

const HABITOS: { icono: string; nombre: string; meta: string; cumple: Cumple }[] = [
  { icono: "💧", nombre: "Agua", meta: `≥ ${(META_AGUA / 1000).toFixed(1)} L`, cumple: (l) => l.waterMl >= META_AGUA },
  { icono: "🥤", nombre: "Refresco bajo", meta: `≤ ${LIMITE_REFRESCO} ml`, cumple: (l) => l.sodaMl <= LIMITE_REFRESCO },
  { icono: "🚶", nombre: "Caminata", meta: "cada día", cumple: (l) => l.walked },
];

export default function HabitsView({ nutri }: Props) {
  const { data } = nutri;
  const fechas = ultimasFechas(7);

  function logDe(fecha: string) {
    return data.logs[fecha] ?? diaVacio(fecha);
  }

  // Racha actual: días consecutivos (terminando hoy) con los 3 hábitos cumplidos
  function racha(): number {
    let r = 0;
    const todas = ultimasFechas(365).reverse(); // de hoy hacia atrás
    for (const f of todas) {
      const l = logDe(f);
      const todos = HABITOS.every((h) => h.cumple(l));
      if (todos) r++;
      else break;
    }
    return r;
  }

  const rachaActual = racha();

  return (
    <div className="hab">
      <div className="head"><div><p className="eyebrow">Constancia</p><h1>Hábitos</h1></div>
        <span className="badge">🔥 Racha: {rachaActual} día{rachaActual === 1 ? "" : "s"}</span>
      </div>

      <section className="card grid">
        <div className="cardHead"><div><p className="eyebrow">Últimos 7 días</p><h2>Tu semana</h2></div></div>
        <div className="tabla">
          <div className="filaCab">
            <span className="hName"></span>
            {fechas.map((f) => <span key={f} className={f === fechas[fechas.length - 1] ? "col hoy" : "col"}>{etiquetaCorta(f)}</span>)}
          </div>
          {HABITOS.map((h) => (
            <div className="fila" key={h.nombre}>
              <span className="hName"><b>{h.icono} {h.nombre}</b><small className="muted">{h.meta}</small></span>
              {fechas.map((f) => {
                const ok = h.cumple(logDe(f));
                return <span key={f} className="col"><i className={ok ? "cell on" : "cell"}>{ok ? "✓" : ""}</i></span>;
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="card tips">
        <p className="eyebrow">Recuerda</p>
        <h2>Sin presión</h2>
        <ul>
          <li>No tienes que cumplir los tres todos los días. Cada día cuenta por sí mismo.</li>
          <li>La racha premia la constancia, pero un día libre no borra tu progreso.</li>
          <li>Marca tus hábitos desde la pantalla de Inicio conforme avanza el día.</li>
        </ul>
      </section>

      <style jsx>{`
        .hab{display:flex;flex-direction:column;gap:18px}
        .head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
        .head h1{font-size:26px;letter-spacing:-.6px}
        .grid,.tips{padding:22px}
        .cardHead{margin-bottom:16px}
        h2{font-size:20px;letter-spacing:-.4px}
        .tabla{overflow-x:auto}
        .filaCab,.fila{display:grid;grid-template-columns:1.4fr repeat(7,1fr);align-items:center;min-width:440px}
        .filaCab{padding-bottom:10px;border-bottom:1px solid var(--border)}
        .col{text-align:center;font-size:11px;color:var(--muted-2);font-weight:600}
        .col.hoy{color:var(--primary)}
        .fila{padding:12px 0;border-top:1px solid #edf0ee}
        .fila:first-of-type{border-top:none}
        .hName{display:flex;flex-direction:column;gap:2px}
        .hName b{font-size:14px}
        .hName small{font-size:11px}
        .cell{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);color:transparent;font-size:13px;font-weight:700}
        .cell.on{background:var(--primary);border-color:var(--primary);color:#fff}
        .tips ul{margin:12px 0 0;padding-left:18px}
        .tips li{font-size:13px;color:#4c5a52;line-height:1.55;margin-bottom:8px}
      `}</style>
    </div>
  );
}
