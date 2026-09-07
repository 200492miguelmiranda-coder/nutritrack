"use client";

import { NutriData } from "@/app/hooks/useNutriData";
import {
  ETIQUETAS_ACTIVIDAD,
  ETIQUETAS_OBJETIVO,
  ETIQUETAS_PREFERENCIA,
} from "@/app/lib/diet";

interface Props {
  nutri: NutriData;
  onEditar: () => void;
}

export default function ProfileView({ nutri, onEditar }: Props) {
  const { data, reiniciar } = nutri;
  const p = data.perfil;

  function confirmarReinicio() {
    const ok = typeof window !== "undefined" && window.confirm(
      "¿Borrar tu perfil y todo tu historial de este dispositivo? Esta acción no se puede deshacer."
    );
    if (ok) reiniciar();
  }

  return (
    <div className="perfil">
      <div className="head"><div><p className="eyebrow">Cuenta</p><h1>Perfil</h1></div>
        <button className="btn btn-primary" onClick={onEditar}>{p ? "Editar" : "Crear perfil"}</button>
      </div>

      {p ? (
        <section className="card datos">
          <div className="fila"><span>Nombre</span><b>{p.nombre || "Sin nombre"}</b></div>
          <div className="fila"><span>Sexo</span><b>{p.sexo === "hombre" ? "Hombre" : "Mujer"}</b></div>
          <div className="fila"><span>Edad</span><b>{p.edad} años</b></div>
          <div className="fila"><span>Peso inicial</span><b>{p.pesoKg} kg</b></div>
          <div className="fila"><span>Estatura</span><b>{p.estaturaCm} cm</b></div>
          <div className="fila"><span>Actividad</span><b>{ETIQUETAS_ACTIVIDAD[p.actividad]}</b></div>
          <div className="fila"><span>Objetivo</span><b>{ETIQUETAS_OBJETIVO[p.objetivo]}</b></div>
          <div className="fila"><span>Alimentación</span><b>{ETIQUETAS_PREFERENCIA[p.preferencia]}</b></div>
          <div className="fila"><span>Comidas al día</span><b>{p.comidasPorDia === 4 ? "3 + snack" : "3 comidas"}</b></div>
          <div className="fila"><span>Evita</span><b>{p.evitar.length ? p.evitar.join(", ") : "Nada en particular"}</b></div>
        </section>
      ) : (
        <section className="card empty">
          <p className="muted">Aún no has creado tu perfil. Créalo para recibir una dieta personalizada.</p>
          <button className="btn btn-primary" onClick={onEditar}>Crear perfil</button>
        </section>
      )}

      <section className="card danger">
        <div>
          <b>Borrar mis datos</b>
          <p className="muted">Elimina tu perfil e historial guardados en este navegador.</p>
        </div>
        <button className="btn btn-danger" onClick={confirmarReinicio}>Borrar todo</button>
      </section>

      <style jsx>{`
        .perfil{display:flex;flex-direction:column;gap:18px}
        .head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
        .head h1{font-size:26px;letter-spacing:-.6px}
        .datos{padding:8px 22px}
        .datos .fila{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 0;border-top:1px solid #edf0ee}
        .datos .fila:first-child{border-top:none}
        .datos span{color:var(--muted);font-size:13px}
        .datos b{font-size:14px;text-align:right}
        .empty{padding:34px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
        .empty p{max-width:360px;font-size:14px;line-height:1.5}
        .danger{padding:20px 22px;display:flex;align-items:center;justify-content:space-between;gap:16px}
        .danger b{font-size:15px}
        .danger p{font-size:13px;margin-top:4px}
      `}</style>
    </div>
  );
}
