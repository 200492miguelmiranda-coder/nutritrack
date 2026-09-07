"use client";

import { useState } from "react";
import { Mail, Cloud, TrendingUp, ListChecks } from "lucide-react";
import { LogoMark, Wordmark } from "@/app/components/Logo";
import { Auth } from "@/app/hooks/useAuth";

interface Props {
  auth: Auth;
  onInvitado: () => void;
}

export default function AuthGate({ auth, onInvitado }: Props) {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar() {
    setError(null);
    setEnviando(true);
    const { error } = await auth.entrar(email.trim());
    if (error) setError(error);
    setEnviando(false);
  }

  return (
    <div className="gate">
      <div className="panel">
        {/* Lado de marca */}
        <div className="brandSide">
          <div className="bTop"><LogoMark size={40} /><Wordmark /></div>
          <h1>Guarda tu progreso y llévalo contigo</h1>
          <p>Entra con tu correo para que tu peso, tus hábitos y tu dieta te acompañen en cualquier dispositivo.</p>
          <ul>
            <li><span><TrendingUp size={16} /></span> Tu peso y tu tendencia, siempre a la mano</li>
            <li><span><ListChecks size={16} /></span> Tus hábitos y tu racha, sin perderlos</li>
            <li><span><Cloud size={16} /></span> Un perfil por persona, guardado en la nube</li>
          </ul>
        </div>

        {/* Lado de acción */}
        <div className="formSide">
          {auth.enlaceEnviado ? (
            <div className="enviado">
              <div className="mailIcon"><Mail size={26} /></div>
              <h2>Revisa tu correo</h2>
              <p>Te enviamos un enlace de acceso a <b>{email || "tu correo"}</b>. Ábrelo en este dispositivo para entrar. Sin contraseña.</p>
              <button className="linkBtn" onClick={onInvitado}>Continuar sin cuenta por ahora</button>
            </div>
          ) : (
            <>
              <h2>Inicia sesión</h2>
              <p className="sub">Te enviamos un enlace mágico a tu correo. No necesitas contraseña.</p>
              <label>Correo electrónico
                <input type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && email.includes("@") && enviar()} />
              </label>
              <button className="btn btn-primary enviar" onClick={enviar} disabled={enviando || !email.includes("@")}>
                {enviando ? "Enviando…" : "Enviar enlace de acceso"}
              </button>
              {error && <p className="err">{error}</p>}
              <div className="sep"><span>o</span></div>
              <button className="ghost" onClick={onInvitado}>Usar sin cuenta por ahora</button>
              <p className="nota">Sin cuenta, tus datos se guardan solo en este dispositivo.</p>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .gate{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
        .panel{width:100%;max-width:880px;background:var(--surface);border:1px solid var(--border);border-radius:24px;box-shadow:var(--shadow-lg);overflow:hidden;display:grid;grid-template-columns:1.05fr 1fr}
        .brandSide{background:var(--grad-brand);color:#fff;padding:38px 34px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
        .brandSide::after{content:"";position:absolute;right:-60px;bottom:-70px;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,.08)}
        .bTop{display:flex;align-items:center;gap:11px;margin-bottom:26px}
        .brandSide h1{font-size:28px;line-height:1.2;letter-spacing:-.6px;margin-bottom:12px;position:relative}
        .brandSide p{color:rgba(255,255,255,.88);line-height:1.55;font-size:14px;margin-bottom:22px;position:relative}
        .brandSide ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;position:relative}
        .brandSide li{display:flex;align-items:center;gap:11px;font-size:13.5px;color:rgba(255,255,255,.95)}
        .brandSide li span{width:30px;height:30px;border-radius:9px;background:rgba(255,255,255,.16);display:grid;place-items:center;flex-shrink:0}
        .formSide{padding:38px 34px;display:flex;flex-direction:column;justify-content:center}
        h2{font-size:23px;letter-spacing:-.5px;margin-bottom:6px}
        .sub{color:var(--muted);font-size:14px;line-height:1.5;margin-bottom:20px}
        label{display:block;font-size:13px;color:#42504a;font-weight:600}
        input{width:100%;margin-top:7px;padding:12px 13px;border:1px solid var(--border);border-radius:11px;font-size:15px;background:var(--surface-2)}
        input:focus{outline:none;border-color:var(--primary)}
        .enviar{width:100%;justify-content:center;margin-top:16px;padding:13px}
        .err{color:var(--danger);font-size:13px;margin-top:10px}
        .sep{display:flex;align-items:center;gap:12px;margin:20px 0;color:var(--muted-2);font-size:12px}
        .sep::before,.sep::after{content:"";flex:1;height:1px;background:var(--border)}
        .ghost{width:100%;padding:12px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);border-radius:11px;font-size:14px;font-weight:600}
        .ghost:hover{background:#edf3ef}
        .nota{font-size:12px;color:var(--muted-2);margin-top:12px;text-align:center;line-height:1.5}
        .enviado{text-align:center;display:flex;flex-direction:column;align-items:center}
        .mailIcon{width:56px;height:56px;border-radius:16px;background:var(--soft);color:var(--primary);display:grid;place-items:center;margin-bottom:14px}
        .enviado p{color:var(--muted);font-size:14px;line-height:1.55;margin:8px 0 18px}
        .linkBtn{background:none;border:none;color:var(--primary);font-weight:600;font-size:14px}
        @media(max-width:720px){.panel{grid-template-columns:1fr;max-width:440px}.brandSide{padding:28px 26px}.brandSide h1{font-size:24px}.brandSide ul{display:none}.formSide{padding:28px 26px}}
      `}</style>
    </div>
  );
}
