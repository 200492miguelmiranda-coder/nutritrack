"use client";

import { useState } from "react";
import { Cloud, CloudOff, Mail, LogOut } from "lucide-react";
import { NutriData } from "@/app/hooks/useNutriData";
import { Auth } from "@/app/hooks/useAuth";
import {
  ETIQUETAS_ACTIVIDAD,
  ETIQUETAS_OBJETIVO,
  ETIQUETAS_PREFERENCIA,
} from "@/app/lib/diet";

interface Props {
  nutri: NutriData;
  auth: Auth;
  onEditar: () => void;
}

export default function ProfileView({ nutri, auth, onEditar }: Props) {
  const { data, reiniciar } = nutri;
  const p = data.perfil;

  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="head"><div><p className="eyebrow">Cuenta</p><h1>Perfil</h1></div>
        <button className="btn btn-primary" onClick={onEditar}>{p ? "Editar" : "Crear perfil"}</button>
      </div>

      {/* Cuenta / sincronización */}
      <section className="card cuenta">
        {!auth.disponible ? (
          <div className="cuentaRow">
            <div className="cuentaInfo"><CloudOff size={20} color="#8a958e" /><div><b>Solo en este dispositivo</b><p className="muted">Tus datos se guardan en este navegador. Conecta Supabase para sincronizar.</p></div></div>
          </div>
        ) : auth.sesion.userId ? (
          <div className="cuentaRow">
            <div className="cuentaInfo"><Cloud size={20} color="#2f5d46" /><div><b>Sesión iniciada{nutri.sincronizando ? " · sincronizando…" : ""}</b><p className="muted">{auth.sesion.email}. Tus datos se guardan en la nube.</p></div></div>
            <button className="btn" onClick={auth.salir}><LogOut size={15} /> Salir</button>
          </div>
        ) : auth.enlaceEnviado ? (
          <div className="cuentaRow">
            <div className="cuentaInfo"><Mail size={20} color="#2f5d46" /><div><b>Revisa tu correo</b><p className="muted">Te enviamos un enlace a {email || "tu correo"}. Ábrelo en este dispositivo para entrar.</p></div></div>
          </div>
        ) : (
          <div className="login">
            <div className="cuentaInfo"><Cloud size={20} color="#2f5d46" /><div><b>Guarda tu progreso en la nube</b><p className="muted">Escribe tu correo y te enviamos un enlace para entrar, sin contraseña.</p></div></div>
            <div className="loginForm">
              <input type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn btn-primary" onClick={enviarEnlace} disabled={enviando || !email.includes("@")}>
                {enviando ? "Enviando…" : "Enviar enlace"}
              </button>
            </div>
            {error && <p className="err">{error}</p>}
          </div>
        )}
      </section>

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
          <p className="muted">Elimina tu perfil e historial.</p>
        </div>
        <button className="btn btn-danger" onClick={confirmarReinicio}>Borrar todo</button>
      </section>

      <style jsx>{`
        .perfil{display:flex;flex-direction:column;gap:18px}
        .head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
        .head h1{font-size:26px;letter-spacing:-.6px}
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
        @media(max-width:600px){.cuentaRow{flex-direction:column;align-items:flex-start}.loginForm{flex-direction:column}}
      `}</style>
    </div>
  );
}
