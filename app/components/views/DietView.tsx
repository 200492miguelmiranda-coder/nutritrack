"use client";

import { Sparkles } from "lucide-react";
import DietPlan from "@/app/components/DietPlan";
import { PlanDieta, ObjetivosNutricionales } from "@/app/lib/diet";

interface Props {
  plan: PlanDieta | null;
  objetivos?: ObjetivosNutricionales;
  onEditar: () => void;
}

export default function DietView({ plan, objetivos, onEditar }: Props) {
  return (
    <div className="dietView">
      <div className="head">
        <div>
          <p className="eyebrow">Alimentación</p>
          <h1>Mi dieta</h1>
        </div>
      </div>

      {plan ? (
        <DietPlan plan={plan} objetivos={objetivos} onEditar={onEditar} />
      ) : (
        <section className="card empty">
          <Sparkles size={30} color="#2f5d46" />
          <h3>Crea tu dieta personalizada</h3>
          <p className="muted">Responde 4 pasos rápidos sobre ti y tus gustos. Te proponemos un plan flexible, con opciones para elegir en cada comida.</p>
          <button className="btn btn-primary" onClick={onEditar}>Responder preguntas</button>
        </section>
      )}

      <style jsx>{`
        .dietView{display:flex;flex-direction:column;gap:18px}
        .head h1{font-size:26px;letter-spacing:-.6px}
        .empty{padding:44px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
        .empty h3{font-size:20px}
        .empty p{max-width:400px;font-size:14px;line-height:1.55;margin-bottom:8px}
      `}</style>
    </div>
  );
}
