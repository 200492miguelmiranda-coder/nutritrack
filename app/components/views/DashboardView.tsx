"use client";

import { Droplets, CupSoda, Footprints, Scale, Plus, Minus, Sparkles } from "lucide-react";
import { NutriData } from "@/app/hooks/useNutriData";
import { PlanDieta } from "@/app/lib/diet";
import { Vista } from "@/app/components/Sidebar";

interface Props {
  nutri: NutriData;
  plan: PlanDieta | null;
  onIrA: (v: Vista) => void;
  onCrearDieta: () => void;
}

const META_AGUA = 1500;
const LIMITE_REFRESCO = 500;

export default function DashboardView({ nutri, plan, onIrA, onCrearDieta }: Props) {
  const { logHoy, actualizarHoy, pesoInicial, pesoActual, pesoObjetivo, bajado, progreso, data } = nutri;

  const pesoDeHoy = logHoy.weight ?? pesoActual;
  const habitos = [logHoy.waterMl >= META_AGUA, logHoy.sodaMl <= LIMITE_REFRESCO, logHoy.walked].filter(Boolean).length;

  const bloques = plan?.bloques ?? [];

  function toggleComida(nombre: string) {
    const hechas = logHoy.meals.includes(nombre)
      ? logHoy.meals.filter((m) => m !== nombre)
      : [...logHoy.meals, nombre];
    actualizarHoy({ meals: hechas });
  }

  return (
    <div className="dash">
      <div className="head">
        <div>
          <p className="eyebrow">Resumen de hoy</p>
          <h1>{data.perfil?.nombre ? `Hola, ${data.perfil.nombre}` : "Tu día"}</h1>
        </div>
        <span className="badge">{new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}</span>
      </div>

      {/* Progreso */}
      <section className="card progress">
        <div className="progressInfo">
          <p className="eyebrow">Objetivo</p>
          <div className="nums"><b>{pesoInicial} kg</b><span>→</span><b>{pesoObjetivo} kg</b></div>
          <p className="muted small">Has bajado <strong>{bajado.toFixed(1)} kg</strong> de {data.metaKg} kg.</p>
        </div>
        <div className="ring" style={{ background: `conic-gradient(var(--primary) ${progreso * 3.6}deg, #e8eeea 0deg)` }}>
          <div className="ringHole"><b>{progreso.toFixed(0)}%</b><small>meta</small></div>
        </div>
      </section>

      {/* Registro rápido */}
      <section className="stats">
        <article className="card stat">
          <div className="statTop"><Scale size={17} /><span>Peso hoy</span></div>
          <strong>{pesoDeHoy} kg</strong>
          <div className="rowBtns">
            <button className="btn" onClick={() => actualizarHoy({ weight: Math.max(1, Math.round((pesoDeHoy - 0.5) * 10) / 10) })}><Minus size={14} /></button>
            <button className="btn" onClick={() => actualizarHoy({ weight: Math.round((pesoDeHoy + 0.5) * 10) / 10 })}><Plus size={14} /></button>
          </div>
        </article>

        <article className="card stat">
          <div className="statTop"><Droplets size={17} /><span>Agua</span></div>
          <strong>{(logHoy.waterMl / 1000).toFixed(1)} L</strong>
          <div className="rowBtns">
            <button className="btn" onClick={() => actualizarHoy({ waterMl: Math.max(0, logHoy.waterMl - 250) })}><Minus size={14} /></button>
            <button className="btn btn-primary" onClick={() => actualizarHoy({ waterMl: Math.min(5000, logHoy.waterMl + 250) })}>+250 ml</button>
          </div>
        </article>

        <article className="card stat">
          <div className="statTop"><CupSoda size={17} /><span>Refresco</span></div>
          <strong>{logHoy.sodaMl} ml</strong>
          <div className="rowBtns">
            <button className="btn" onClick={() => actualizarHoy({ sodaMl: Math.max(0, logHoy.sodaMl - 250) })}><Minus size={14} /></button>
            <button className="btn" onClick={() => actualizarHoy({ sodaMl: logHoy.sodaMl + 250 })}>+250 ml</button>
          </div>
        </article>

        <article className="card stat">
          <div className="statTop"><Footprints size={17} /><span>Hábitos</span></div>
          <strong>{habitos}/3</strong>
          <div className="rowBtns">
            <button className={logHoy.walked ? "btn btn-primary" : "btn"} onClick={() => actualizarHoy({ walked: !logHoy.walked })}>
              {logHoy.walked ? "✓ Caminata" : "Caminata"}
            </button>
          </div>
        </article>
      </section>

      <div className="cols">
        {/* Comida de hoy */}
        <section className="card meals">
          <div className="cardHead">
            <div><p className="eyebrow">Hoy</p><h2>Tu alimentación</h2></div>
            {plan && <button className="btn" onClick={() => onIrA("dieta")}>Ver dieta</button>}
          </div>

          {plan ? (
            <div className="mealList">
              {bloques.map((b) => {
                const done = logHoy.meals.includes(b.nombre);
                const primera = b.opciones[0];
                return (
                  <div className={done ? "meal done" : "meal"} key={b.nombre}>
                    <div className="mealNum">{done ? "✓" : b.nombre[0]}</div>
                    <div className="mealBody">
                      <div className="mealTitle"><b>{b.nombre}</b><small>{b.horario}</small></div>
                      <p>{primera ? `${primera.titulo} · ${primera.detalle}` : "Sin opciones con tus filtros"}</p>
                    </div>
                    <button className={done ? "btn btn-primary" : "btn"} onClick={() => toggleComida(b.nombre)}>{done ? "Listo" : "Marcar"}</button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="promoInline">
              <Sparkles size={26} color="#2f5d46" />
              <h3>Aún no tienes una dieta</h3>
              <p className="muted">Responde unas preguntas rápidas y te armamos un plan flexible, para nada estricto.</p>
              <button className="btn btn-primary" onClick={onCrearDieta}>Crear mi dieta</button>
            </div>
          )}
        </section>

        {/* Hábitos */}
        <aside className="card habits">
          <p className="eyebrow">Hábitos</p><h2>Lo importante hoy</h2>
          <div className="habit">
            <div><b>💧 Agua</b><small className="muted">Meta: {(META_AGUA / 1000).toFixed(1)} L</small></div>
            <strong className={logHoy.waterMl >= META_AGUA ? "ok" : ""}>{logHoy.waterMl >= META_AGUA ? "✓" : `${logHoy.waterMl} ml`}</strong>
          </div>
          <div className="habit">
            <div><b>🥤 Refresco</b><small className="muted">Máximo {LIMITE_REFRESCO} ml</small></div>
            <strong className={logHoy.sodaMl <= LIMITE_REFRESCO ? "ok" : ""}>{logHoy.sodaMl <= LIMITE_REFRESCO ? "✓" : `${logHoy.sodaMl} ml`}</strong>
          </div>
          <div className="habit">
            <div><b>🚶 Caminata</b><small className="muted">10–15 min al día</small></div>
            <button className={logHoy.walked ? "btn btn-primary" : "btn"} onClick={() => actualizarHoy({ walked: !logHoy.walked })}>{logHoy.walked ? "✓" : "Marcar"}</button>
          </div>
          <button className="verMas" onClick={() => onIrA("habitos")}>Ver historial de hábitos →</button>
        </aside>
      </div>

      <style jsx>{`
        .dash{display:flex;flex-direction:column;gap:18px}
        .head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
        .head h1{font-size:26px;letter-spacing:-.6px}
        .small{font-size:13px}
        .progress{padding:22px;display:flex;align-items:center;justify-content:space-between;gap:20px}
        .nums{display:flex;align-items:baseline;gap:10px;margin:2px 0 8px}
        .nums b{font-size:30px;letter-spacing:-1px}
        .nums span{color:var(--muted-2)}
        .ring{width:96px;height:96px;border-radius:50%;display:grid;place-items:center;flex-shrink:0}
        .ringHole{width:72px;height:72px;background:var(--surface);border-radius:50%;display:grid;place-items:center;text-align:center}
        .ringHole b{font-size:20px}
        .ringHole small{font-size:10px;color:var(--muted-2);text-transform:uppercase;letter-spacing:.5px}
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .stat{padding:16px}
        .statTop{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px}
        .stat strong{display:block;font-size:26px;margin:8px 0 12px;letter-spacing:-.5px}
        .rowBtns{display:flex;gap:8px}
        .rowBtns .btn{padding:8px 10px}
        .cols{display:grid;grid-template-columns:1.6fr 1fr;gap:18px}
        .cardHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
        .card h2{font-size:20px;letter-spacing:-.4px}
        .meals,.habits{padding:22px}
        .mealList{display:flex;flex-direction:column}
        .meal{display:flex;align-items:center;gap:14px;padding:15px 0;border-top:1px solid #edf0ee}
        .meal:first-child{border-top:none}
        .mealNum{width:32px;height:32px;border-radius:50%;background:var(--soft);color:var(--primary);display:grid;place-items:center;font-weight:700;font-size:13px;flex-shrink:0}
        .meal.done .mealNum{background:var(--primary);color:#fff}
        .mealBody{flex:1;min-width:0}
        .mealTitle{display:flex;gap:10px;align-items:center}
        .mealTitle small{font-size:11px;color:var(--muted-2)}
        .mealBody p{margin:5px 0 0;color:var(--muted);font-size:13px;line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
        .meal.done .mealBody{opacity:.55}
        .promoInline{text-align:center;padding:26px 16px;display:flex;flex-direction:column;align-items:center;gap:8px}
        .promoInline h3{font-size:18px}
        .promoInline p{max-width:340px;font-size:13px;line-height:1.5;margin-bottom:6px}
        .habit{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-top:1px solid #edf0ee}
        .habit:first-of-type{border-top:none;margin-top:6px}
        .habit div{display:flex;flex-direction:column;gap:4px}
        .habit small{font-size:11px}
        .habit strong{font-size:14px;color:var(--muted)}
        .habit strong.ok{color:var(--primary);font-size:18px}
        .verMas{margin-top:16px;background:none;border:none;color:var(--primary);font-size:13px;font-weight:600;padding:0}
        @media(max-width:860px){.stats{grid-template-columns:repeat(2,1fr)}.cols{grid-template-columns:1fr}.progress{flex-direction:row}}
      `}</style>
    </div>
  );
}
