"use client";

import { PlanDieta, ObjetivosNutricionales } from "@/app/lib/diet";

interface Props {
  plan: PlanDieta;
  objetivos?: ObjetivosNutricionales;
  onEditar: () => void;
}

function rango(r: [number, number]): string {
  return r[0] === r[1] ? `${r[0]} g` : `${r[0]}–${r[1]} g`;
}

export default function DietPlan({ plan, objetivos, onEditar }: Props) {
  return (
    <section className="card dietPlan">
      <div className="cardHead">
        <div>
          <p className="eyebrow">Tu dieta personalizada</p>
          <h2>Plan flexible</h2>
        </div>
        <button className="btn" onClick={onEditar}>Ajustar respuestas</button>
      </div>

      <p className="resumen">{plan.resumen}</p>

      {objetivos ? (
        <div className="macros">
          <div className="macro"><span>Calorías</span><strong>{objetivos.kcal}</strong><small>referencia diaria</small></div>
          <div className="macro"><span>Proteína</span><strong>{rango(objetivos.proteina)}</strong><small>prioridad y saciedad</small></div>
          <div className="macro"><span>Carbos</span><strong>{rango(objetivos.carbos)}</strong><small>energía</small></div>
          <div className="macro"><span>Grasas</span><strong>{rango(objetivos.grasas)}</strong><small>saludables</small></div>
        </div>
      ) : (
        <div className="macros">
          <div className="macro"><span>Calorías</span><strong>{plan.caloriasObjetivo}</strong><small>{plan.rangoCalorias[0]}–{plan.rangoCalorias[1]} kcal</small></div>
          <div className="macro"><span>Proteína</span><strong>{plan.proteinaG} g</strong><small>músculo y saciedad</small></div>
          <div className="macro"><span>Carbos</span><strong>{plan.carbohidratosG} g</strong><small>energía</small></div>
          <div className="macro"><span>Grasas</span><strong>{plan.grasasG} g</strong><small>saludables</small></div>
        </div>
      )}

      <div className="bloques">
        {plan.bloques.map((bloque) => (
          <div className="bloque" key={bloque.nombre}>
            <div className="bloqueHead"><b>{bloque.nombre}</b><small>{bloque.horario}</small></div>
            <p className="elige">Elige una opción:</p>
            <div className="opciones">
              {bloque.opciones.map((op) => (
                <div className="opcion" key={op.titulo}>
                  <b>{op.titulo}</b>
                  <p>{op.detalle}</p>
                </div>
              ))}
              {bloque.opciones.length === 0 && (
                <div className="opcion vacio"><p>No quedaron opciones con tus filtros. Prueba quitar algún alimento evitado.</p></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="consejos">
        <b>💡 Cómo seguirla sin estrés</b>
        <ul>
          {plan.consejos.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>

      <style jsx>{`
        .dietPlan{padding:24px}
        .cardHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
        h2{font-size:22px;letter-spacing:-.5px}
        .resumen{color:#4c5a52;line-height:1.55;font-size:14px;margin:0 0 20px}
        .macros{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px}
        .macro{background:var(--surface-2);border-radius:12px;padding:14px;text-align:center}
        .macro span{font-size:10px;letter-spacing:.8px;color:var(--muted);font-weight:700;display:block;text-transform:uppercase}
        .macro strong{display:block;font-size:22px;margin:6px 0 2px;color:#1f3327}
        .macro small{font-size:10px;color:var(--muted-2)}
        .bloques{display:grid;gap:16px}
        .bloque{border:1px solid var(--border);border-radius:14px;padding:16px}
        .bloqueHead{display:flex;align-items:baseline;gap:10px}
        .bloqueHead b{font-size:16px}
        .bloqueHead small{font-size:11px;color:var(--muted-2)}
        .elige{font-size:11px;color:var(--muted-2);margin:8px 0 10px;text-transform:uppercase;letter-spacing:.5px}
        .opciones{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
        .opcion{background:var(--surface-2);border:1px solid #edf0ee;border-radius:10px;padding:12px}
        .opcion b{font-size:14px;color:#2c382f}
        .opcion p{margin:5px 0 0;font-size:12px;color:var(--muted);line-height:1.45}
        .opcion.vacio{grid-column:1/-1}
        .consejos{margin-top:22px;padding:16px;background:var(--soft);border-radius:12px}
        .consejos b{font-size:13px;color:#1f3327}
        .consejos ul{margin:10px 0 0;padding-left:18px}
        .consejos li{font-size:13px;color:#4c5a52;line-height:1.5;margin-bottom:6px}
        @media(max-width:600px){.macros{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </section>
  );
}
