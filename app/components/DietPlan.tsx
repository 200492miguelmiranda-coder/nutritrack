"use client";

import { PlanDieta } from "@/app/lib/diet";

interface Props {
  plan: PlanDieta;
  onEditar: () => void;
}

export default function DietPlan({ plan, onEditar }: Props) {
  return (
    <section className="panel dietPlan">
      <div className="panelHead">
        <div>
          <p className="eyebrow">TU DIETA PERSONALIZADA</p>
          <h2>Plan flexible</h2>
        </div>
        <button className="editBtn" onClick={onEditar}>Ajustar respuestas</button>
      </div>

      <p className="resumen">{plan.resumen}</p>

      <div className="macros">
        <div className="macro"><span>CALORÍAS</span><strong>{plan.caloriasObjetivo}</strong><small>{plan.rangoCalorias[0]}–{plan.rangoCalorias[1]} kcal</small></div>
        <div className="macro"><span>PROTEÍNA</span><strong>{plan.proteinaG} g</strong><small>músculo y saciedad</small></div>
        <div className="macro"><span>CARBOS</span><strong>{plan.carbohidratosG} g</strong><small>energía</small></div>
        <div className="macro"><span>GRASAS</span><strong>{plan.grasasG} g</strong><small>saludables</small></div>
      </div>

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
        .dietPlan{margin-top:4px}
        .panelHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
        .eyebrow{font-size:11px;letter-spacing:1.3px;color:#718078;font-weight:700;margin:0 0 6px}
        h2{margin:0;font-size:22px;letter-spacing:-.5px}
        .editBtn{border:1px solid #d7dfda;background:#f7f9f8;color:#315d46;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600}
        .resumen{color:#4c5a52;line-height:1.55;font-size:14px;margin:0 0 20px}
        .macros{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px}
        .macro{background:#f4f7f5;border-radius:12px;padding:14px;text-align:center}
        .macro span{font-size:10px;letter-spacing:.8px;color:#78847d;font-weight:700;display:block}
        .macro strong{display:block;font-size:22px;margin:6px 0 2px;color:#1f3327}
        .macro small{font-size:10px;color:#7c8881}
        .bloques{display:grid;gap:16px}
        .bloque{border:1px solid #e3e9e5;border-radius:14px;padding:16px}
        .bloqueHead{display:flex;align-items:baseline;gap:10px}
        .bloqueHead b{font-size:16px}
        .bloqueHead small{font-size:11px;color:#88938d}
        .elige{font-size:11px;color:#8a958e;margin:8px 0 10px;text-transform:uppercase;letter-spacing:.5px}
        .opciones{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
        .opcion{background:#fbfcfb;border:1px solid #edf0ee;border-radius:10px;padding:12px}
        .opcion b{font-size:14px;color:#2c382f}
        .opcion p{margin:5px 0 0;font-size:12px;color:#68756e;line-height:1.45}
        .opcion.vacio{grid-column:1/-1}
        .consejos{margin-top:22px;padding:16px;background:#eef4f0;border-radius:12px}
        .consejos b{font-size:13px;color:#1f3327}
        .consejos ul{margin:10px 0 0;padding-left:18px}
        .consejos li{font-size:13px;color:#4c5a52;line-height:1.5;margin-bottom:6px}
        @media(max-width:600px){.macros{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </section>
  );
}
