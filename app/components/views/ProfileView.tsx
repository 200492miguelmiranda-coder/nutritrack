"use client";

import { useState } from "react";
import { Cloud, CloudOff, Mail, LogOut, Palette, Check } from "lucide-react";
import { NutriData } from "@/app/hooks/useNutriData";
import { Auth } from "@/app/hooks/useAuth";
import WeightChart from "@/app/components/WeightChart";
import { PlanDieta, ObjetivosNutricionales, ETIQUETAS_OBJETIVO, ETIQUETAS_PREFERENCIA, ETIQUETAS_ACTIVIDAD } from "@/app/lib/diet";
import { COLORES, FONDOS, FUENTES } from "@/app/lib/tema";

interface Props {
  nutri: NutriData;
  auth: Auth;
  plan: PlanDieta | null;
  onEditar: () => void;
}

const AVATARES = ["🙂", "💪", "🥗", "🏃", "🔥", "🌟", "🍎", "🧘", "⚽", "🐻", "🦊", "🌱"];

function clasificarImc(imc: number): string {
  if (imc < 18.5) return "Bajo peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  return "Obesidad";
}

export default function ProfileView({ nutri, auth, plan, onEditar }: Props) {
  const { data, reiniciar, setTema, setAvatar, setObjetivos, seriePeso, pesoActual, pesoObjetivo, bajado, progreso } = nutri;
  const p = data.perfil;
  const obj = data.objetivos;

  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMetas, setEditMetas] = useState(false);
  const [borrador, setBorrador] = useState<ObjetivosNutricionales>(obj ?? { kcal: 2000, proteina: [120, 150], carbos: [180, 220], grasas: [60, 80] });

  const imc = p ? pesoActual / Math.pow(p.estaturaCm / 100, 2) : null;
  const falta = Math.max(0, pesoActual - pesoObjetivo);
  const avatar = data.avatar || (p?.nombre?.trim()?.[0]?.toUpperCase() ?? "🙂");
  const cintura = Object.values(data.logs).filter((l) => l.cinturaCm != null).sort((a, b) => b.date.localeCompare(a.date))[0]?.cinturaCm;

  function guardarMetas() {
    setObjetivos(borrador);
    setEditMetas(false);
  }
  const rango = (r: [number, number]) => (r[0] === r[1] ? `${r[0]} g` : `${r[0]}–${r[1]} g`);

  async function enviarEnlace() {
    setError(null);
    setEnviando(true);
    const { error } = await auth.entrar(email.trim());
    if (error) setError(error);
    setEnviando(false);
  }

  function confirmarReinicio() {
    const ok = typeof window !== "undefined" && window.confirm(
      "¿Borrar tu perfil y todo tu historial? Esta acción no se puede deshacer."
    );
    if (ok) reiniciar();
  }

  return (
    <div className="perfil">
      {/* Portada */}
      <section className="cover">
        <div className="coverBg" />
        <div className="coverRow">
          <div className="avatar">{avatar}</div>
          <div className="coverInfo">
            <h1>{p?.nombre?.trim() || "Tu perfil"}</h1>
            <p>{p ? ETIQUETAS_OBJETIVO[p.objetivo] : "Crea tu perfil para empezar"}</p>
          </div>
          <button className="editCover" onClick={onEditar}>{p ? "Editar" : "Crear perfil"}</button>
        </div>
      </section>

      {p ? (
        <>
          {/* Indicadores */}
          <section className="kpis">
            <article className="card kpi"><span>Peso actual</span><strong>{pesoActual} kg</strong></article>
            <article className="card kpi"><span>Bajado</span><strong className="pos">{bajado.toFixed(1)} kg</strong></article>
            <article className="card kpi"><span>Falta</span><strong>{falta.toFixed(1)} kg</strong></article>
            <article className="card kpi"><span>IMC</span><strong>{imc!.toFixed(1)}</strong><small>{clasificarImc(imc!)}</small></article>
          </section>

          <div className="dosCol">
            {/* Avances */}
            <section className="card bloque">
              <div className="bloqueHead"><div><p className="eyebrow">Tus avances</p><h2>Progreso de peso</h2></div>
                <div className="ring" style={{ background: `conic-gradient(var(--primary) ${progreso * 3.6}deg, var(--soft) 0deg)` }}>
                  <div className="ringHole"><b>{progreso.toFixed(0)}%</b></div>
                </div>
              </div>
              <WeightChart puntos={seriePeso} objetivo={pesoObjetivo} />
            </section>

            {/* Metas */}
            <section className="card bloque">
              <div className="bloqueHead"><div><p className="eyebrow">Tus metas</p><h2>Objetivo y nutrición</h2></div>
                <button className="btn" onClick={() => { setBorrador(obj ?? borrador); setEditMetas((v) => !v); }}>{editMetas ? "Cancelar" : "Ajustar"}</button>
              </div>
              <div className="metaPeso"><span>{p.pesoKg} kg</span><i>→</i><b>{pesoObjetivo} kg</b></div>

              {editMetas ? (
                <div className="editMetas">
                  <div className="ef"><label>Calorías (kcal)</label><input type="number" value={borrador.kcal} onChange={(e) => setBorrador({ ...borrador, kcal: Number(e.target.value) })} /></div>
                  {(["proteina", "carbos", "grasas"] as const).map((k) => (
                    <div className="ef" key={k}>
                      <label>{k === "proteina" ? "Proteína" : k === "carbos" ? "Carbos" : "Grasas"} (g)</label>
                      <div className="par">
                        <input type="number" value={borrador[k][0]} onChange={(e) => setBorrador({ ...borrador, [k]: [Number(e.target.value), borrador[k][1]] })} />
                        <span>–</span>
                        <input type="number" value={borrador[k][1]} onChange={(e) => setBorrador({ ...borrador, [k]: [borrador[k][0], Number(e.target.value)] })} />
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-primary guardar" onClick={guardarMetas}>Guardar metas</button>
                </div>
              ) : obj ? (
                <div className="macros">
                  <div className="macro"><span>Calorías</span><b>{obj.kcal}</b></div>
                  <div className="macro"><span>Proteína</span><b>{rango(obj.proteina)}</b></div>
                  <div className="macro"><span>Carbos</span><b>{rango(obj.carbos)}</b></div>
                  <div className="macro"><span>Grasas</span><b>{rango(obj.grasas)}</b></div>
                </div>
              ) : <p className="muted">Ajusta tus metas nutricionales de referencia.</p>}

              <p className="refNota">Son referencias iniciales, ajustables según tu peso, hambre, energía y adherencia. NutriTrack te acompaña, pero no sustituye a un profesional de salud: consulta a uno para decisiones médicas importantes.</p>
              <div className="chips">
                <span className="chipTag">{ETIQUETAS_PREFERENCIA[p.preferencia]}</span>
                <span className="chipTag">{ETIQUETAS_ACTIVIDAD[p.actividad].split(" (")[0]}</span>
                <span className="chipTag">{(p.comidasPrincipales ?? p.comidasPorDia)} comidas{p.aceptaSnack ? " + snack" : ""}</span>
              </div>
            </section>
          </div>

          {/* Contexto */}
          {(p.trabajoHorario || p.gustos?.length || p.estiloComida?.length || p.equipoCasa?.length || p.notas) && (
            <section className="card contexto">
              <p className="eyebrow">Tu contexto</p><h2>Cómo comes y vives</h2>
              <div className="ctxGrid">
                {p.horasSueno != null && <div className="ctx"><span>Sueño habitual</span><b>{p.horasSueno} h</b></div>}
                {p.trabajoHorario && <div className="ctx"><span>Horario laboral</span><b>{p.trabajoHorario}</b></div>}
                {p.tiempoPrep && <div className="ctx"><span>Tiempo para cocinar</span><b>{p.tiempoPrep}</b></div>}
                {cintura != null && <div className="ctx"><span>Cintura (último)</span><b>{cintura} cm</b></div>}
              </div>
              {p.gustos?.length ? <div className="ctxTags"><label>Le gusta</label>{p.gustos.map((g) => <span key={g}>{g}</span>)}</div> : null}
              {p.estiloComida?.length ? <div className="ctxTags"><label>Estilo</label>{p.estiloComida.map((g) => <span key={g}>{g}</span>)}</div> : null}
              {p.equipoCasa?.length ? <div className="ctxTags"><label>En casa</label>{p.equipoCasa.map((g) => <span key={g}>{g}</span>)}</div> : null}
              {p.equipoTrabajo?.length ? <div className="ctxTags"><label>En el trabajo</label>{p.equipoTrabajo.map((g) => <span key={g}>{g}</span>)}</div> : null}
              {p.notas ? <p className="ctxNotas">{p.notas}</p> : null}
            </section>
          )}
        </>
      ) : (
        <section className="card empty">
          <p className="muted">Aún no has creado tu perfil. Créalo para ver aquí tus avances, metas y una dieta a tu medida.</p>
          <button className="btn btn-primary" onClick={onEditar}>Crear mi perfil</button>
        </section>
      )}

      {/* Personalización */}
      <section className="card person">
        <div className="personHead"><Palette size={18} color="var(--primary-2)" /><div><p className="eyebrow">Personaliza</p><h2>Tu estilo</h2></div></div>

        <div className="opcSet">
          <label>Avatar</label>
          <div className="avatarGrid">
            {AVATARES.map((a) => (
              <button key={a} className={data.avatar === a ? "av sel" : "av"} onClick={() => setAvatar(a)}>{a}</button>
            ))}
          </div>
        </div>

        <div className="opcSet">
          <label>Color</label>
          <div className="swatches">
            {Object.entries(COLORES).map(([k, c]) => (
              <button key={k} className={data.tema.color === k ? "sw sel" : "sw"} onClick={() => setTema({ color: k })} title={c.nombre} style={{ background: c.muestra }}>
                {data.tema.color === k && <Check size={15} color="#fff" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>

        <div className="opcSet">
          <label>Fondo</label>
          <div className="pills">
            {Object.entries(FONDOS).map(([k, f]) => (
              <button key={k} className={data.tema.fondo === k ? "pill sel" : "pill"} onClick={() => setTema({ fondo: k })}>{f.nombre}</button>
            ))}
          </div>
        </div>

        <div className="opcSet">
          <label>Fuente</label>
          <div className="pills">
            {Object.entries(FUENTES).map(([k, f]) => (
              <button key={k} className={data.tema.fuente === k ? "pill sel" : "pill"} style={{ fontFamily: f.valor }} onClick={() => setTema({ fuente: k })}>{f.nombre}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Cuenta */}
      <section className="card cuenta">
        {!auth.disponible ? (
          <div className="cuentaRow"><div className="cuentaInfo"><CloudOff size={20} color="var(--muted-2)" /><div><b>Solo en este dispositivo</b><p className="muted">Conecta Supabase para sincronizar tu perfil en la nube.</p></div></div></div>
        ) : auth.sesion.userId ? (
          <div className="cuentaRow"><div className="cuentaInfo"><Cloud size={20} color="var(--primary)" /><div><b>Sesión iniciada{nutri.sincronizando ? " · sincronizando…" : ""}</b><p className="muted">{auth.sesion.email}. Un perfil por cuenta, guardado en la nube.</p></div></div><button className="btn" onClick={auth.salir}><LogOut size={15} /> Salir</button></div>
        ) : auth.enlaceEnviado ? (
          <div className="cuentaRow"><div className="cuentaInfo"><Mail size={20} color="var(--primary)" /><div><b>Revisa tu correo</b><p className="muted">Te enviamos un enlace a {email || "tu correo"}. Ábrelo en este dispositivo.</p></div></div></div>
        ) : (
          <div className="login">
            <div className="cuentaInfo"><Cloud size={20} color="var(--primary)" /><div><b>Guarda tu progreso en la nube</b><p className="muted">Cada persona entra con su correo y tiene su propio perfil. Sin contraseña.</p></div></div>
            <div className="loginForm">
              <input type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn btn-primary" onClick={enviarEnlace} disabled={enviando || !email.includes("@")}>{enviando ? "Enviando…" : "Enviar enlace"}</button>
            </div>
            {error && <p className="err">{error}</p>}
          </div>
        )}
      </section>

      {/* Borrar */}
      <section className="card danger">
        <div><b>Borrar mis datos</b><p className="muted">Elimina tu perfil e historial.</p></div>
        <button className="btn btn-danger" onClick={confirmarReinicio}>Borrar todo</button>
      </section>

      <style jsx>{`
        .perfil{display:flex;flex-direction:column;gap:18px}
        .cover{position:relative;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-lg)}
        .coverBg{position:absolute;inset:0;background:var(--grad-brand)}
        .coverBg::after{content:"";position:absolute;right:-40px;top:-70px;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,.1)}
        .coverRow{position:relative;display:flex;align-items:center;gap:18px;padding:26px 24px}
        .avatar{width:72px;height:72px;border-radius:20px;background:rgba(255,255,255,.9);display:grid;place-items:center;font-size:34px;font-weight:800;color:var(--primary);flex-shrink:0;box-shadow:0 8px 20px -8px rgba(0,0,0,.35)}
        .coverInfo{flex:1;min-width:0;color:#fff}
        .coverInfo h1{font-size:26px;letter-spacing:-.6px}
        .coverInfo p{color:rgba(255,255,255,.85);font-size:14px;margin-top:4px}
        .editCover{background:rgba(255,255,255,.9);color:var(--primary);border:none;padding:10px 16px;border-radius:11px;font-size:13px;font-weight:700}
        .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .kpi{padding:16px}
        .kpi span{font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.5px}
        .kpi strong{display:block;font-size:24px;margin-top:8px;letter-spacing:-.5px;font-family:var(--font-display),sans-serif}
        .kpi strong.pos{color:var(--primary-2)}
        .kpi small{font-size:11px;color:var(--muted-2)}
        .dosCol{display:grid;grid-template-columns:1.3fr 1fr;gap:18px}
        .bloque{padding:22px}
        .bloqueHead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
        h2{font-size:20px;letter-spacing:-.4px}
        .ring{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;flex-shrink:0}
        .ringHole{width:48px;height:48px;background:var(--surface);border-radius:50%;display:grid;place-items:center}
        .ringHole b{font-size:14px;font-family:var(--font-display),sans-serif;color:var(--primary)}
        .metaPeso{display:flex;align-items:baseline;gap:10px;margin:14px 0 18px;font-family:var(--font-display),sans-serif}
        .metaPeso span{font-size:20px;color:var(--muted)}
        .metaPeso i{color:var(--muted-2);font-style:normal}
        .metaPeso b{font-size:28px;letter-spacing:-1px;color:var(--primary)}
        .macros{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
        .macro{background:var(--surface-2);border-radius:12px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center}
        .macro span{font-size:12px;color:var(--muted);font-weight:600}
        .macro b{font-size:16px;font-family:var(--font-display),sans-serif}
        .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
        .chipTag{font-size:11px;background:var(--soft);color:var(--primary);padding:6px 11px;border-radius:20px;font-weight:600}
        .refNota{font-size:12px;color:var(--muted-2);margin-top:14px;line-height:1.5}
        .editMetas{display:flex;flex-direction:column;gap:12px}
        .ef{display:flex;flex-direction:column;gap:6px}
        .ef label{font-size:12px;color:var(--muted);font-weight:600}
        .ef input{width:100%;padding:9px 11px;border:1px solid var(--border);border-radius:9px;background:var(--surface-2)}
        .par{display:flex;align-items:center;gap:8px}
        .par input{width:100%}
        .guardar{align-self:flex-start;margin-top:4px}
        .contexto{padding:22px}
        .ctxGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:14px 0}
        .ctx{background:var(--surface-2);border-radius:12px;padding:12px 14px}
        .ctx span{font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.4px;display:block}
        .ctx b{font-size:14px;margin-top:4px;display:block}
        .ctxTags{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin-top:10px}
        .ctxTags label{font-size:11px;color:var(--muted-2);font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-right:4px}
        .ctxTags span{font-size:12px;background:var(--soft);color:var(--primary);padding:5px 10px;border-radius:20px}
        .ctxNotas{font-size:13px;color:var(--muted);line-height:1.55;margin-top:14px;padding-top:14px;border-top:1px solid #edf0ee}
        .empty{padding:34px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
        .empty p{max-width:400px;font-size:14px;line-height:1.55}
        .person{padding:22px}
        .personHead{display:flex;align-items:center;gap:10px;margin-bottom:18px}
        .opcSet{margin-bottom:16px}
        .opcSet:last-child{margin-bottom:0}
        .opcSet label{display:block;font-size:12px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:9px}
        .avatarGrid{display:flex;flex-wrap:wrap;gap:8px}
        .av{width:42px;height:42px;border-radius:12px;border:1px solid var(--border);background:var(--surface-2);font-size:20px;display:grid;place-items:center}
        .av.sel{border-color:var(--primary);box-shadow:0 0 0 2px var(--accent-soft);background:var(--soft)}
        .swatches{display:flex;flex-wrap:wrap;gap:10px}
        .sw{width:40px;height:40px;border-radius:50%;border:2px solid var(--surface);box-shadow:0 0 0 1px var(--border);display:grid;place-items:center;transition:transform .1s}
        .sw:hover{transform:scale(1.08)}
        .sw.sel{box-shadow:0 0 0 2px var(--primary)}
        .pills{display:flex;flex-wrap:wrap;gap:8px}
        .pill{padding:9px 14px;border:1px solid var(--border);background:var(--surface-2);border-radius:10px;font-size:13px;font-weight:600;color:var(--text)}
        .pill.sel{border-color:var(--primary);background:var(--soft);color:var(--primary)}
        .cuenta{padding:20px 22px}
        .cuentaRow{display:flex;align-items:center;justify-content:space-between;gap:16px}
        .cuentaInfo{display:flex;gap:12px;align-items:flex-start}
        .cuentaInfo b{font-size:15px}
        .cuentaInfo p{font-size:13px;margin-top:3px;line-height:1.5}
        .login{display:flex;flex-direction:column;gap:14px}
        .loginForm{display:flex;gap:10px}
        .loginForm input{flex:1;padding:11px 12px;border:1px solid var(--border);border-radius:10px;font-size:14px;background:var(--surface-2)}
        .loginForm input:focus{outline:none;border-color:var(--primary)}
        .err{color:var(--danger);font-size:13px}
        .danger{padding:20px 22px;display:flex;align-items:center;justify-content:space-between;gap:16px}
        .danger b{font-size:15px}
        .danger p{font-size:13px;margin-top:4px}
        @media(max-width:860px){.kpis{grid-template-columns:repeat(2,1fr)}.dosCol{grid-template-columns:1fr}}
        @media(max-width:600px){.cuentaRow{flex-direction:column;align-items:flex-start}.loginForm{flex-direction:column}.coverRow{flex-wrap:wrap}}
      `}</style>
    </div>
  );
}
