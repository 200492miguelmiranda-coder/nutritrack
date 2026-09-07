"use client";

import { NutriData } from "@/app/hooks/useNutriData";
import WeightChart from "@/app/components/WeightChart";

interface Props {
  nutri: NutriData;
}

export default function ProgressView({ nutri }: Props) {
  const { seriePeso, pesoInicial, pesoActual, pesoObjetivo, bajado, data } = nutri;

  const registros = Object.values(data.logs).filter((l) => l.weight != null).length;
  const diasRegistrados = Object.keys(data.logs).length;
  const restante = Math.max(0, pesoActual - pesoObjetivo);

  // Promedio por semana entre el primer y último registro
  let porSemana = 0;
  if (seriePeso.length >= 2) {
    const primero = new Date(seriePeso[0].fecha);
    const ultimo = new Date(seriePeso[seriePeso.length - 1].fecha);
    const dias = Math.max(1, (ultimo.getTime() - primero.getTime()) / 86400000);
    porSemana = (bajado / dias) * 7;
  }

  const kpis = [
    { label: "Peso actual", valor: `${pesoActual} kg` },
    { label: "Bajado", valor: `${bajado.toFixed(1)} kg` },
    { label: "Falta para la meta", valor: `${restante.toFixed(1)} kg` },
    { label: "Promedio/semana", valor: `${porSemana.toFixed(1)} kg` },
  ];

  const historial = Object.values(data.logs)
    .filter((l) => l.weight != null)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="prog">
      <div className="head">
        <div><p className="eyebrow">Seguimiento</p><h1>Progreso</h1></div>
      </div>

      <section className="kpis">
        {kpis.map((k) => (
          <article className="card kpi" key={k.label}>
            <span>{k.label}</span>
            <strong>{k.valor}</strong>
          </article>
        ))}
      </section>

      <section className="card chartCard">
        <div className="cardHead">
          <div><p className="eyebrow">Tendencia</p><h2>Tu peso en el tiempo</h2></div>
          <span className="badge">{registros} registro{registros === 1 ? "" : "s"}</span>
        </div>
        <WeightChart puntos={seriePeso} objetivo={pesoObjetivo} />
        <p className="muted foot">Meta inicial: bajar {data.metaKg} kg (de {pesoInicial} a {pesoObjetivo} kg). Registra tu peso desde Inicio.</p>
      </section>

      <section className="card historyCard">
        <div className="cardHead"><div><p className="eyebrow">Historial</p><h2>Registros de peso</h2></div><span className="badge">{diasRegistrados} día{diasRegistrados === 1 ? "" : "s"} con datos</span></div>
        {historial.length === 0 ? (
          <p className="muted">Aún no registras tu peso. Ve a Inicio y ajústalo con los botones.</p>
        ) : (
          <div className="tabla">
            {historial.map((l) => (
              <div className="fila" key={l.date}>
                <span>{new Date(l.date + "T00:00:00").toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })}</span>
                <b>{l.weight} kg</b>
              </div>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .prog{display:flex;flex-direction:column;gap:18px}
        .head h1{font-size:26px;letter-spacing:-.6px}
        .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .kpi{padding:16px}
        .kpi span{font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.6px}
        .kpi strong{display:block;font-size:24px;margin-top:8px;letter-spacing:-.5px}
        .chartCard,.historyCard{padding:22px}
        .cardHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
        h2{font-size:20px;letter-spacing:-.4px}
        .foot{font-size:12px;margin-top:14px;line-height:1.5}
        .tabla{display:flex;flex-direction:column}
        .fila{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-top:1px solid #edf0ee;font-size:14px}
        .fila:first-child{border-top:none}
        .fila span{color:var(--muted);text-transform:capitalize}
        @media(max-width:860px){.kpis{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </div>
  );
}
