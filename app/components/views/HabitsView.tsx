"use client";

import { useEffect, useState } from "react";
import { Flame, Check, Trophy } from "lucide-react";
import { NutriData } from "@/app/hooks/useNutriData";
import { diaVacio, etiquetaCorta, ultimasFechas } from "@/app/lib/storage";
import { HABITOS, UMBRAL_RACHA, mensajeAnimo, calcularRacha, mejorRacha } from "@/app/lib/habitos";

interface Props {
  nutri: NutriData;
}

export default function HabitsView({ nutri }: Props) {
  const { data, logHoy, actualizarHoy } = nutri;

  const [animo, setAnimo] = useState<string | null>(null);

  useEffect(() => {
    if (!animo) return;
    const t = setTimeout(() => setAnimo(null), 2600);
    return () => clearTimeout(t);
  }, [animo]);

  const hechos = logHoy.habitos ?? [];
  const total = HABITOS.length;
  const completados = hechos.length;
  const pct = Math.round((completados / total) * 100);

  function cumplidosDe(fecha: string): number {
    return (data.logs[fecha]?.habitos ?? []).length;
  }

  const fechas7 = ultimasFechas(7);
  const fechas400 = ultimasFechas(400);
  const racha = calcularRacha(cumplidosDe, fechas400);
  const record = mejorRacha(cumplidosDe, fechas400);
  const faltanRacha = Math.max(0, UMBRAL_RACHA - completados);

  function toggle(id: string) {
    const estaba = hechos.includes(id);
    const nuevos = estaba ? hechos.filter((h) => h !== id) : [...hechos, id];
    actualizarHoy({ habitos: nuevos });
    if (!estaba) setAnimo(mensajeAnimo());
  }

  return (
    <div className="hab">
      <div className="head"><div><p className="eyebrow">Constancia</p><h1>Hábitos</h1></div>
        <span className="badge"><Flame size={13} /> {racha} día{racha === 1 ? "" : "s"}</span>
      </div>

      {/* Mensaje de ánimo */}
      {animo && <div className="animo">🎉 {animo}</div>}

      {/* Racha + progreso */}
      <section className="rachaCard">
        <div className="rachaMain">
          <div className="flame"><Flame size={26} /></div>
          <div>
            <b>{racha} día{racha === 1 ? "" : "s"} de racha</b>
            <small>{faltanRacha > 0 ? `Completa ${faltanRacha} hábito${faltanRacha === 1 ? "" : "s"} más para sumar hoy` : "¡Hoy ya cuenta para tu racha! 🔥"}</small>
          </div>
        </div>
        <div className="rachaExtra">
          <div className="re"><Trophy size={15} /><span>Récord</span><b>{record}</b></div>
          <div className="re"><Check size={15} /><span>Hoy</span><b>{completados}/{total}</b></div>
        </div>
      </section>

      {/* Progreso de hoy */}
      <section className="card progCard">
        <div className="progHead"><span className="eyebrow">Hoy</span><b>{pct}%</b></div>
        <div className="barra"><i style={{ width: `${pct}%` }} /></div>
      </section>

      {/* Tabla de hábitos */}
      <section className="card tabla">
        <div className="cardHead"><div><p className="eyebrow">Marca lo que logres</p><h2>Tus buenos hábitos</h2></div></div>
        <div className="lista">
          {HABITOS.map((h) => {
            const done = hechos.includes(h.id);
            return (
              <button key={h.id} className={done ? "fila done" : "fila"} onClick={() => toggle(h.id)}>
                <span className="hemoji">{h.emoji}</span>
                <span className="htxt"><b>{h.titulo}</b>{h.meta && <small>{h.meta}</small>}</span>
                <span className={done ? "box on" : "box"}>{done && <Check size={16} strokeWidth={3} />}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Historial 7 días */}
      <section className="card semana">
        <div className="cardHead"><div><p className="eyebrow">Últimos 7 días</p><h2>Tu semana</h2></div></div>
        <div className="dias">
          {fechas7.map((f) => {
            const n = cumplidosDe(f);
            const cumple = n >= UMBRAL_RACHA;
            const hoy = f === fechas7[fechas7.length - 1];
            return (
              <div className="dia" key={f}>
                <div className={cumple ? "burbuja on" : "burbuja"}>{cumple ? <Flame size={16} /> : n || ""}</div>
                <small className={hoy ? "hoy" : ""}>{etiquetaCorta(f)}</small>
              </div>
            );
          })}
        </div>
        <p className="pie">Un día cuenta para tu racha al completar {UMBRAL_RACHA} hábitos. No pasa nada si un día no llegas: mañana sigues.</p>
      </section>

      <style jsx>{`
        .hab{display:flex;flex-direction:column;gap:18px}
        .head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
        .head h1{font-size:26px;letter-spacing:-.6px}
        .badge{display:inline-flex;align-items:center;gap:5px}
        .animo{background:var(--grad-brand);color:#fff;padding:14px 18px;border-radius:14px;font-weight:600;font-size:14px;box-shadow:var(--shadow-lg);animation:pop .3s ease}
        @keyframes pop{from{transform:translateY(-6px);opacity:0}to{transform:translateY(0);opacity:1}}
        .rachaCard{background:var(--grad-brand);color:#fff;border-radius:var(--radius);padding:22px;display:flex;align-items:center;justify-content:space-between;gap:16px;box-shadow:var(--shadow-lg);flex-wrap:wrap}
        .rachaMain{display:flex;align-items:center;gap:14px}
        .flame{width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,.18);display:grid;place-items:center;flex-shrink:0}
        .rachaMain b{font-size:20px;display:block;font-family:var(--font-display),sans-serif}
        .rachaMain small{font-size:13px;color:rgba(255,255,255,.85)}
        .rachaExtra{display:flex;gap:10px}
        .re{background:rgba(255,255,255,.14);border-radius:12px;padding:10px 14px;text-align:center;min-width:74px}
        .re span{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:rgba(255,255,255,.8);margin:3px 0}
        .re b{font-size:18px;font-family:var(--font-display),sans-serif}
        .progCard{padding:16px 20px}
        .progHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
        .progHead b{font-size:16px;color:var(--primary);font-family:var(--font-display),sans-serif}
        .barra{height:10px;background:var(--soft);border-radius:99px;overflow:hidden}
        .barra i{display:block;height:100%;background:var(--grad-brand);border-radius:99px;transition:width .3s ease}
        .tabla,.semana{padding:22px}
        .cardHead{margin-bottom:16px}
        h2{font-size:20px;letter-spacing:-.4px}
        .lista{display:flex;flex-direction:column;gap:10px}
        .fila{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid var(--border);border-radius:14px;background:var(--surface);text-align:left;width:100%;transition:all .15s}
        .fila:hover{border-color:#cfdad3;background:var(--surface-2)}
        .fila.done{background:var(--soft);border-color:var(--primary)}
        .hemoji{font-size:22px;flex-shrink:0}
        .htxt{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
        .htxt b{font-size:14px}
        .fila.done .htxt b{color:var(--primary)}
        .htxt small{font-size:12px;color:var(--muted-2)}
        .box{width:28px;height:28px;border-radius:9px;border:2px solid var(--border);display:grid;place-items:center;color:#fff;flex-shrink:0}
        .box.on{background:var(--primary);border-color:var(--primary)}
        .dias{display:flex;justify-content:space-between;gap:6px}
        .dia{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1}
        .burbuja{width:38px;height:38px;border-radius:12px;background:var(--surface-2);border:1px solid var(--border);display:grid;place-items:center;font-size:13px;font-weight:700;color:var(--muted)}
        .burbuja.on{background:var(--grad-brand);border-color:transparent;color:#fff}
        .dia small{font-size:11px;color:var(--muted-2)}
        .dia small.hoy{color:var(--primary);font-weight:700}
        .pie{font-size:12px;color:var(--muted-2);margin-top:14px;line-height:1.5}
        @media(max-width:600px){.rachaCard{flex-direction:column;align-items:stretch}.rachaExtra{justify-content:space-between}}
      `}</style>
    </div>
  );
}
