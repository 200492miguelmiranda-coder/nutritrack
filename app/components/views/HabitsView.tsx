"use client";

import { useEffect, useState } from "react";
import { Flame, Check, Trophy, Plus, Trash2 } from "lucide-react";
import { NutriData } from "@/app/hooks/useNutriData";
import { etiquetaCorta, ultimasFechas } from "@/app/lib/storage";
import { HABITOS, UMBRAL_RACHA, mensajeAnimo, calcularRacha, mejorRacha, HabitoDef } from "@/app/lib/habitos";

interface Props {
  nutri: NutriData;
}

const EMOJIS = ["✅", "⭐", "🏃", "🥦", "🍵", "🧘", "📵", "🌙", "🚭", "📖", "💊", "🧴", "🚴", "💪", "🧹", "😊"];

export default function HabitsView({ nutri }: Props) {
  const { data, logHoy, actualizarHoy, agregarHabito, quitarHabito } = nutri;

  const [animo, setAnimo] = useState<string | null>(null);
  const [nuevoEmoji, setNuevoEmoji] = useState("✅");
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    if (!animo) return;
    const t = setTimeout(() => setAnimo(null), 2600);
    return () => clearTimeout(t);
  }, [animo]);

  const personalizados = data.habitosPersonalizados ?? [];
  const todos: HabitoDef[] = [...HABITOS, ...personalizados];
  const idsPersonalizados = new Set(personalizados.map((h) => h.id));

  const hechos = logHoy.habitos ?? [];
  const total = todos.length;
  const completados = hechos.length;
  const pct = total ? Math.round((completados / total) * 100) : 0;

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

  function crear() {
    const titulo = nuevoTitulo.trim();
    if (!titulo) return;
    agregarHabito({ id: `custom-${Date.now()}`, emoji: nuevoEmoji, titulo });
    setNuevoTitulo("");
    setNuevoEmoji("✅");
    setCreando(false);
  }

  return (
    <div className="hab">
      <div className="head"><div><p className="eyebrow">Constancia</p><h1>Hábitos</h1></div>
        <span className="badge"><Flame size={13} /> {racha} día{racha === 1 ? "" : "s"}</span>
      </div>

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

      <section className="card progCard">
        <div className="progHead"><span className="eyebrow">Hoy</span><b>{pct}%</b></div>
        <div className="barra"><i style={{ width: `${pct}%` }} /></div>
      </section>

      {/* Tabla de hábitos */}
      <section className="card tabla">
        <div className="cardHead"><div><p className="eyebrow">Marca lo que logres</p><h2>Tus buenos hábitos</h2></div>
          <button className="btn" onClick={() => setCreando((v) => !v)}><Plus size={15} /> Nuevo</button>
        </div>

        {creando && (
          <div className="crear">
            <div className="emojiPick">
              {EMOJIS.map((e) => <button key={e} className={nuevoEmoji === e ? "ep on" : "ep"} onClick={() => setNuevoEmoji(e)}>{e}</button>)}
            </div>
            <div className="crearRow">
              <input placeholder="Ej. Estirar 5 minutos, meditar, leer…" value={nuevoTitulo} onChange={(e) => setNuevoTitulo(e.target.value)} onKeyDown={(e) => e.key === "Enter" && crear()} />
              <button className="btn btn-primary" onClick={crear} disabled={!nuevoTitulo.trim()}>Agregar</button>
            </div>
          </div>
        )}

        <div className="lista">
          {todos.map((h) => {
            const done = hechos.includes(h.id);
            const custom = idsPersonalizados.has(h.id);
            return (
              <div key={h.id} className={done ? "fila done" : "fila"} onClick={() => toggle(h.id)} role="button" tabIndex={0}>
                <span className="hemoji">{h.emoji}</span>
                <span className="htxt"><b>{h.titulo}</b>{h.meta && <small>{h.meta}</small>}{custom && <small className="mio">Hábito personalizado</small>}</span>
                {custom && (
                  <button className="delH" onClick={(e) => { e.stopPropagation(); quitarHabito(h.id); }} aria-label="Eliminar hábito"><Trash2 size={15} /></button>
                )}
                <span className={done ? "box on" : "box"}>{done && <Check size={16} strokeWidth={3} />}</span>
              </div>
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
        .cardHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
        h2{font-size:20px;letter-spacing:-.4px}
        .crear{background:var(--surface-2);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:14px}
        .emojiPick{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
        .ep{width:34px;height:34px;border-radius:9px;border:1px solid var(--border);background:var(--surface);font-size:17px}
        .ep.on{border-color:var(--primary);box-shadow:0 0 0 2px var(--accent-soft);background:var(--soft)}
        .crearRow{display:flex;gap:8px}
        .crearRow input{flex:1;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}
        .crearRow input:focus{outline:none;border-color:var(--primary)}
        .lista{display:flex;flex-direction:column;gap:10px}
        .fila{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid var(--border);border-radius:14px;background:var(--surface);text-align:left;width:100%;transition:all .15s;cursor:pointer}
        .fila:hover{border-color:#cfdad3;background:var(--surface-2)}
        .fila.done{background:var(--soft);border-color:var(--primary)}
        .hemoji{font-size:22px;flex-shrink:0}
        .htxt{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
        .htxt b{font-size:14px}
        .fila.done .htxt b{color:var(--primary)}
        .htxt small{font-size:12px;color:var(--muted-2)}
        .htxt small.mio{color:var(--primary-2);font-weight:600}
        .delH{border:none;background:none;color:var(--muted-2);display:grid;place-items:center;padding:4px;flex-shrink:0}
        .delH:hover{color:var(--danger)}
        .box{width:28px;height:28px;border-radius:9px;border:2px solid var(--border);display:grid;place-items:center;color:#fff;flex-shrink:0}
        .box.on{background:var(--primary);border-color:var(--primary)}
        .dias{display:flex;justify-content:space-between;gap:6px}
        .dia{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1}
        .burbuja{width:38px;height:38px;border-radius:12px;background:var(--surface-2);border:1px solid var(--border);display:grid;place-items:center;font-size:13px;font-weight:700;color:var(--muted)}
        .burbuja.on{background:var(--grad-brand);border-color:transparent;color:#fff}
        .dia small{font-size:11px;color:var(--muted-2)}
        .dia small.hoy{color:var(--primary);font-weight:700}
        .pie{font-size:12px;color:var(--muted-2);margin-top:14px;line-height:1.5}
        @media(max-width:600px){.rachaCard{flex-direction:column;align-items:stretch}.rachaExtra{justify-content:space-between}.crearRow{flex-direction:column}}
      `}</style>
    </div>
  );
}
