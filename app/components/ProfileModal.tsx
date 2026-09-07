"use client";

import { useState } from "react";
import {
  Perfil,
  Sexo,
  Actividad,
  Objetivo,
  Preferencia,
  ETIQUETAS_ACTIVIDAD,
  ETIQUETAS_OBJETIVO,
  ETIQUETAS_PREFERENCIA,
} from "@/app/lib/diet";

interface Props {
  perfilInicial?: Perfil | null;
  onClose: () => void;
  onGuardar: (perfil: Perfil) => void;
}

const TOTAL_PASOS = 4;

export default function ProfileModal({ perfilInicial, onClose, onGuardar }: Props) {
  const [paso, setPaso] = useState(1);

  const [nombre, setNombre] = useState(perfilInicial?.nombre ?? "");
  const [sexo, setSexo] = useState<Sexo>(perfilInicial?.sexo ?? "hombre");
  const [edad, setEdad] = useState(perfilInicial?.edad ?? 30);
  const [pesoKg, setPesoKg] = useState(perfilInicial?.pesoKg ?? 80);
  const [estaturaCm, setEstaturaCm] = useState(perfilInicial?.estaturaCm ?? 170);
  const [actividad, setActividad] = useState<Actividad>(perfilInicial?.actividad ?? "sedentario");
  const [objetivo, setObjetivo] = useState<Objetivo>(perfilInicial?.objetivo ?? "bajar");
  const [preferencia, setPreferencia] = useState<Preferencia>(perfilInicial?.preferencia ?? "omnivoro");
  const [comidasPorDia, setComidasPorDia] = useState(perfilInicial?.comidasPorDia ?? 3);
  const [evitarTexto, setEvitarTexto] = useState((perfilInicial?.evitar ?? []).join(", "));

  function siguiente() {
    setPaso((p) => Math.min(TOTAL_PASOS, p + 1));
  }
  function anterior() {
    setPaso((p) => Math.max(1, p - 1));
  }

  function finalizar() {
    const perfil: Perfil = {
      nombre,
      sexo,
      edad: Number(edad) || 30,
      pesoKg: Number(pesoKg) || 80,
      estaturaCm: Number(estaturaCm) || 170,
      actividad,
      objetivo,
      preferencia,
      comidasPorDia,
      evitar: evitarTexto.split(",").map((s) => s.trim()).filter(Boolean),
    };
    onGuardar(perfil);
  }

  const pesoValido = Number(pesoKg) > 0 && Number(estaturaCm) > 0 && Number(edad) > 0;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Cerrar">×</button>

        <div className="progress">
          {Array.from({ length: TOTAL_PASOS }).map((_, i) => (
            <span key={i} className={i < paso ? "on" : ""} />
          ))}
        </div>

        {paso === 1 && (
          <div className="stepContent">
            <p className="eyebrow">PASO 1 DE {TOTAL_PASOS}</p>
            <h2>Cuéntanos de ti</h2>
            <p className="lead">Con esto calculamos una dieta a tu medida, nada estricta.</p>
            <label>Tu nombre (opcional)
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Miguel" />
            </label>
            <div className="fieldLabel">Sexo</div>
            <div className="options two">
              <button className={sexo === "hombre" ? "opt sel" : "opt"} onClick={() => setSexo("hombre")}>Hombre</button>
              <button className={sexo === "mujer" ? "opt sel" : "opt"} onClick={() => setSexo("mujer")}>Mujer</button>
            </div>
            <label>Edad
              <input type="number" value={edad} onChange={(e) => setEdad(Number(e.target.value))} min={12} max={100} />
            </label>
          </div>
        )}

        {paso === 2 && (
          <div className="stepContent">
            <p className="eyebrow">PASO 2 DE {TOTAL_PASOS}</p>
            <h2>Tus medidas</h2>
            <p className="lead">Nos ayudan a estimar cuánta energía necesitas al día.</p>
            <label>Peso actual (kg)
              <input type="number" value={pesoKg} onChange={(e) => setPesoKg(Number(e.target.value))} min={30} max={400} />
            </label>
            <label>Estatura (cm)
              <input type="number" value={estaturaCm} onChange={(e) => setEstaturaCm(Number(e.target.value))} min={120} max={230} />
            </label>
            <div className="fieldLabel">¿Qué tan activo eres?</div>
            <div className="options">
              {(Object.keys(ETIQUETAS_ACTIVIDAD) as Actividad[]).map((a) => (
                <button key={a} className={actividad === a ? "opt sel" : "opt"} onClick={() => setActividad(a)}>
                  {ETIQUETAS_ACTIVIDAD[a]}
                </button>
              ))}
            </div>
          </div>
        )}

        {paso === 3 && (
          <div className="stepContent">
            <p className="eyebrow">PASO 3 DE {TOTAL_PASOS}</p>
            <h2>Tu objetivo</h2>
            <p className="lead">Elige a dónde quieres llegar.</p>
            <div className="options">
              {(Object.keys(ETIQUETAS_OBJETIVO) as Objetivo[]).map((o) => (
                <button key={o} className={objetivo === o ? "opt sel" : "opt"} onClick={() => setObjetivo(o)}>
                  {ETIQUETAS_OBJETIVO[o]}
                </button>
              ))}
            </div>
            <div className="fieldLabel">¿Cuántas comidas prefieres al día?</div>
            <div className="options two">
              <button className={comidasPorDia === 3 ? "opt sel" : "opt"} onClick={() => setComidasPorDia(3)}>3 comidas</button>
              <button className={comidasPorDia === 4 ? "opt sel" : "opt"} onClick={() => setComidasPorDia(4)}>3 + snack</button>
            </div>
          </div>
        )}

        {paso === 4 && (
          <div className="stepContent">
            <p className="eyebrow">PASO 4 DE {TOTAL_PASOS}</p>
            <h2>Tus gustos</h2>
            <p className="lead">Así evitamos lo que no comes y respetamos tu estilo.</p>
            <div className="fieldLabel">¿Cómo comes?</div>
            <div className="options">
              {(Object.keys(ETIQUETAS_PREFERENCIA) as Preferencia[]).map((p) => (
                <button key={p} className={preferencia === p ? "opt sel" : "opt"} onClick={() => setPreferencia(p)}>
                  {ETIQUETAS_PREFERENCIA[p]}
                </button>
              ))}
            </div>
            <label>¿Algo que no te guste o no puedas comer?
              <input
                value={evitarTexto}
                onChange={(e) => setEvitarTexto(e.target.value)}
                placeholder="Ej. pescado, hongos, cacahuate"
              />
            </label>
            <small className="hint">Sepáralo con comas. Lo quitaremos de tus opciones.</small>
          </div>
        )}

        <div className="actions">
          {paso > 1 ? <button className="ghost" onClick={anterior}>Atrás</button> : <span />}
          {paso < TOTAL_PASOS ? (
            <button className="primary" onClick={siguiente} disabled={paso === 2 && !pesoValido}>Continuar</button>
          ) : (
            <button className="primary" onClick={finalizar} disabled={!pesoValido}>Crear mi dieta</button>
          )}
        </div>
      </div>

      <style jsx>{`
        .overlay{position:fixed;inset:0;background:#17211b7a;backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;padding:16px;z-index:50}
        .modal{background:#fff;border-radius:20px;width:100%;max-width:480px;padding:28px;position:relative;box-shadow:0 20px 60px #17211b33;max-height:92vh;overflow-y:auto}
        .close{position:absolute;top:14px;right:16px;background:none;border:none;font-size:26px;color:#8a958e;line-height:1}
        .progress{display:flex;gap:6px;margin-bottom:22px}
        .progress span{flex:1;height:5px;border-radius:99px;background:#e8eeea}
        .progress span.on{background:#315d46}
        .eyebrow{font-size:11px;letter-spacing:1.3px;color:#718078;font-weight:700;margin:0 0 6px}
        h2{margin:0 0 6px;font-size:24px;letter-spacing:-.5px}
        .lead{color:#68756e;margin:0 0 18px;font-size:14px;line-height:1.5}
        label{display:block;font-size:13px;color:#42504a;font-weight:600;margin:14px 0 0}
        input{width:100%;margin-top:6px;padding:11px 12px;border:1px solid #d7dfda;border-radius:10px;font-size:15px;background:#fbfcfb}
        input:focus{outline:none;border-color:#315d46}
        .fieldLabel{font-size:13px;color:#42504a;font-weight:600;margin:16px 0 8px}
        .options{display:flex;flex-direction:column;gap:8px}
        .options.two{flex-direction:row}
        .opt{text-align:left;padding:12px 14px;border:1px solid #d7dfda;background:#fbfcfb;border-radius:10px;font-size:14px;color:#2c382f;flex:1}
        .opt.sel{border-color:#315d46;background:#eef4f0;color:#315d46;font-weight:600;box-shadow:0 0 0 1px #315d46}
        .hint{display:block;color:#8a958e;font-size:12px;margin-top:6px}
        .actions{display:flex;justify-content:space-between;align-items:center;margin-top:26px;gap:12px}
        .primary{background:#315d46;color:#fff;border:none;padding:12px 22px;border-radius:10px;font-size:14px;font-weight:600}
        .primary:disabled{opacity:.45}
        .ghost{background:none;border:none;color:#66736b;font-size:14px;padding:12px 8px}
      `}</style>
    </div>
  );
}
