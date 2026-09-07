"use client";

import { useState } from "react";
import { UtensilsCrossed, Trash2, Sparkles } from "lucide-react";
import { NutriData } from "@/app/hooks/useNutriData";
import { RegistroComida } from "@/app/lib/storage";
import { mensajeComida, detectaProteina, kcalDelDia } from "@/app/lib/companion";

interface Props {
  nutri: NutriData;
}

const MOMENTOS = ["Desayuno", "Comida", "Cena", "Snack"];

function Escala({ valor, onChange, activo }: { valor: number | null | undefined; onChange: (n: number) => void; activo: string }) {
  return (
    <div className="escala">
      {Array.from({ length: 10 }).map((_, i) => {
        const n = i + 1;
        return <button key={n} className={valor === n ? `e on ${activo}` : "e"} onClick={() => onChange(n)}>{n}</button>;
      })}
      <style jsx>{`
        .escala{display:flex;gap:5px;flex-wrap:wrap}
        .e{width:32px;height:32px;border-radius:9px;border:1px solid var(--border);background:var(--surface-2);font-size:12px;font-weight:600;color:var(--muted)}
        .e.on{background:var(--primary);border-color:var(--primary);color:#fff}
      `}</style>
    </div>
  );
}

export default function DiarioView({ nutri }: Props) {
  const { logHoy, actualizarHoy, agregarRegistro, quitarRegistro, data } = nutri;

  const [momento, setMomento] = useState("Comida");
  const [descripcion, setDescripcion] = useState("");
  const [kcalMin, setKcalMin] = useState("");
  const [kcalMax, setKcalMax] = useState("");

  const registros = logHoy.registros ?? [];
  const kcalHoy = kcalDelDia(registros);
  const kcalMeta = data.objetivos?.kcal ?? 2000;
  const pct = Math.min(100, Math.round((kcalHoy / kcalMeta) * 100));

  function registrar() {
    if (!descripcion.trim()) return;
    const min = kcalMin ? Number(kcalMin) : null;
    const max = kcalMax ? Number(kcalMax) : (min ?? null);
    const reg: RegistroComida = {
      id: `${Date.now()}`,
      momento,
      descripcion: descripcion.trim(),
      kcalMin: min,
      kcalMax: max,
      altaProteina: detectaProteina(descripcion),
      nota: mensajeComida({
        momento,
        descripcion,
        kcalMax: max,
        kcalHoy: kcalHoy + (max ?? 0),
        kcalMeta,
      }),
    };
    agregarRegistro(reg);
    setDescripcion("");
    setKcalMin("");
    setKcalMax("");
  }

  return (
    <div className="diario">
      <div className="head"><div><p className="eyebrow">Acompañante</p><h1>Diario</h1></div>
        <span className="badge">{new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}</span>
      </div>

      {/* Registro de comida */}
      <section className="card logCard">
        <div className="lhead"><UtensilsCrossed size={18} color="var(--primary-2)" /><div><p className="eyebrow">Registra lo que comes</p><h2>En tus palabras</h2></div></div>

        <div className="momentos">
          {MOMENTOS.map((m) => <button key={m} className={momento === m ? "mm on" : "mm"} onClick={() => setMomento(m)}>{m}</button>)}
        </div>

        <textarea
          placeholder="Ej. 200 g de pollo asado con arroz y ensalada, y un vaso de agua"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={2}
        />
        <div className="kcalRow">
          <span className="muted">Estimación aprox. (opcional):</span>
          <input type="number" placeholder="mín" value={kcalMin} onChange={(e) => setKcalMin(e.target.value)} />
          <span>–</span>
          <input type="number" placeholder="máx" value={kcalMax} onChange={(e) => setKcalMax(e.target.value)} />
          <span className="muted">kcal</span>
          <button className="btn btn-primary registrar" onClick={registrar} disabled={!descripcion.trim()}>Registrar</button>
        </div>
        <p className="ayuda"><Sparkles size={13} /> Escribe con naturalidad. Si no sabes las calorías, déjalo en blanco; son estimaciones, no reglas.</p>
      </section>

      {/* Comidas de hoy */}
      <section className="card hoyCard">
        <div className="cardHead">
          <div><p className="eyebrow">Hoy</p><h2>Lo que has comido</h2></div>
          <div className="kcalTot"><b>{kcalHoy > 0 ? `~${kcalHoy}` : "0"}</b><small>/ {kcalMeta} kcal</small></div>
        </div>
        <div className="barra"><i style={{ width: `${pct}%` }} /></div>

        {registros.length === 0 ? (
          <p className="muted vacio">Aún no registras comidas hoy. Usa el recuadro de arriba.</p>
        ) : (
          <div className="lista">
            {registros.map((r) => (
              <div className="reg" key={r.id}>
                <div className="regTop">
                  <div><b>{r.momento}</b>{r.altaProteina && <span className="tag">alta proteína</span>}</div>
                  <div className="regKcal">
                    {r.kcalMin != null ? <span>~{r.kcalMax && r.kcalMax !== r.kcalMin ? `${r.kcalMin}–${r.kcalMax}` : r.kcalMin} kcal</span> : <span className="muted">sin estimar</span>}
                    <button className="del" onClick={() => quitarRegistro(r.id)} aria-label="Quitar"><Trash2 size={15} /></button>
                  </div>
                </div>
                <p className="desc">{r.descripcion}</p>
                {r.nota && <p className="nota">💬 {r.nota}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bienestar de hoy */}
      <section className="card bienestar">
        <p className="eyebrow">Bienestar</p><h2>Cómo te sientes hoy</h2>

        <div className="metricRow"><label>Hambre (1–10)</label><Escala valor={logHoy.hambre} onChange={(n) => actualizarHoy({ hambre: n })} activo="" /></div>
        <div className="metricRow"><label>Energía (1–10)</label><Escala valor={logHoy.energia} onChange={(n) => actualizarHoy({ energia: n })} activo="" /></div>
        <div className="metricRow"><label>Dificultad del plan (1–10)</label><Escala valor={logHoy.dificultad} onChange={(n) => actualizarHoy({ dificultad: n })} activo="" /></div>

        <div className="inputs">
          <div className="field"><label>Sueño anoche (h)</label><input type="number" step="0.5" value={logHoy.horasSueno ?? ""} placeholder="6" onChange={(e) => actualizarHoy({ horasSueno: e.target.value ? Number(e.target.value) : null })} /></div>
          <div className="field"><label>Cintura (cm)</label><input type="number" value={logHoy.cinturaCm ?? ""} placeholder="—" onChange={(e) => actualizarHoy({ cinturaCm: e.target.value ? Number(e.target.value) : null })} /></div>
          <div className="field adh"><label>Seguí mi plan</label><button className={logHoy.adherencia ? "btn btn-primary" : "btn"} onClick={() => actualizarHoy({ adherencia: !logHoy.adherencia })}>{logHoy.adherencia ? "✓ Sí" : "Marcar"}</button></div>
        </div>
      </section>

      <style jsx>{`
        .diario{display:flex;flex-direction:column;gap:18px}
        .head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
        .head h1{font-size:26px;letter-spacing:-.6px}
        .logCard,.hoyCard,.bienestar{padding:22px}
        .lhead{display:flex;align-items:center;gap:10px;margin-bottom:16px}
        h2{font-size:20px;letter-spacing:-.4px}
        .momentos{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
        .mm{padding:8px 14px;border:1px solid var(--border);background:var(--surface-2);border-radius:20px;font-size:13px;font-weight:600;color:var(--muted)}
        .mm.on{background:var(--soft);border-color:var(--primary);color:var(--primary)}
        textarea{width:100%;border:1px solid var(--border);border-radius:12px;padding:12px;font-size:14px;background:var(--surface-2);resize:vertical}
        textarea:focus{outline:none;border-color:var(--primary)}
        .kcalRow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px;font-size:13px}
        .kcalRow input{width:72px;padding:8px 10px;border:1px solid var(--border);border-radius:9px;background:var(--surface-2)}
        .registrar{margin-left:auto}
        .ayuda{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted-2);margin-top:10px}
        .cardHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
        .kcalTot{text-align:right}
        .kcalTot b{font-size:22px;font-family:var(--font-display),sans-serif}
        .kcalTot small{font-size:12px;color:var(--muted-2);margin-left:4px}
        .barra{height:8px;background:var(--soft);border-radius:99px;overflow:hidden;margin-bottom:16px}
        .barra i{display:block;height:100%;background:var(--grad-brand);border-radius:99px}
        .vacio{font-size:13px}
        .lista{display:flex;flex-direction:column;gap:12px}
        .reg{border:1px solid var(--border);border-radius:12px;padding:14px}
        .regTop{display:flex;justify-content:space-between;align-items:center;gap:10px}
        .regTop b{font-size:14px}
        .tag{font-size:10px;background:var(--accent-soft);color:var(--primary);padding:3px 8px;border-radius:20px;margin-left:8px;font-weight:700}
        .regKcal{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--muted)}
        .del{border:none;background:none;color:var(--muted-2);display:grid;place-items:center}
        .del:hover{color:var(--danger)}
        .desc{font-size:13px;color:var(--text);margin-top:6px;line-height:1.45}
        .nota{font-size:12.5px;color:var(--primary);background:var(--soft);padding:10px 12px;border-radius:10px;margin-top:10px;line-height:1.5}
        .metricRow{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-top:1px solid #edf0ee;flex-wrap:wrap}
        .metricRow:first-of-type{border-top:none}
        .metricRow label{font-size:13px;color:var(--muted);font-weight:600}
        .inputs{display:flex;gap:14px;flex-wrap:wrap;margin-top:16px;padding-top:16px;border-top:1px solid #edf0ee}
        .field{display:flex;flex-direction:column;gap:6px}
        .field label{font-size:12px;color:var(--muted);font-weight:600}
        .field input{width:110px;padding:9px 11px;border:1px solid var(--border);border-radius:9px;background:var(--surface-2)}
        .field.adh{justify-content:flex-end}
        @media(max-width:600px){.registrar{margin-left:0;width:100%}}
      `}</style>
    </div>
  );
}
