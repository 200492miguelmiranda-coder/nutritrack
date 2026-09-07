"use client";

import { LayoutDashboard, UtensilsCrossed, NotebookPen, TrendingUp, ListChecks, UserRound, LogIn, LogOut } from "lucide-react";
import { LogoMark, Wordmark } from "@/app/components/Logo";

export type Vista = "inicio" | "diario" | "dieta" | "progreso" | "habitos" | "perfil";

interface Props {
  vista: Vista;
  onVista: (v: Vista) => void;
  nombre?: string;
  disponible?: boolean;
  email?: string | null;
  onEntrar?: () => void;
  onSalir?: () => void;
}

const ITEMS: { id: Vista; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: "inicio", label: "Inicio", Icon: LayoutDashboard },
  { id: "diario", label: "Diario", Icon: NotebookPen },
  { id: "dieta", label: "Mi dieta", Icon: UtensilsCrossed },
  { id: "progreso", label: "Progreso", Icon: TrendingUp },
  { id: "habitos", label: "Hábitos", Icon: ListChecks },
  { id: "perfil", label: "Perfil", Icon: UserRound },
];

export default function Sidebar({ vista, onVista, nombre, disponible, email, onEntrar, onSalir }: Props) {
  return (
    <>
      {/* Barra lateral (escritorio) */}
      <aside className="sidebar">
        <div className="brand">
          <LogoMark size={38} />
          <div className="brandText">
            <Wordmark />
            <small>{nombre ? `Hola, ${nombre}` : "Tu progreso"}</small>
          </div>
        </div>
        <nav>
          {ITEMS.map(({ id, label, Icon }) => (
            <button key={id} className={vista === id ? "navItem on" : "navItem"} onClick={() => onVista(id)}>
              <span className="navIcon"><Icon size={18} strokeWidth={2.2} /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="foot">
          {email ? (
            <div className="cuenta">
              <div className="ce"><span className="dotHealthy" /><span className="mail">{email}</span></div>
              <button className="cbtn" onClick={onSalir}><LogOut size={14} /> Salir</button>
            </div>
          ) : disponible ? (
            <button className="entrar" onClick={onEntrar}><LogIn size={15} /> Entrar para guardar</button>
          ) : (
            <span className="segura"><span className="dotHealthy" /> Datos guardados en este dispositivo.</span>
          )}
        </div>
      </aside>

      {/* Encabezado superior (móvil) */}
      <header className="mobileTop">
        <LogoMark size={30} />
        <Wordmark small />
      </header>

      {/* Navegación inferior (móvil) */}
      <nav className="bottomNav">
        {ITEMS.map(({ id, label, Icon }) => (
          <button key={id} className={vista === id ? "on" : ""} onClick={() => onVista(id)}>
            <Icon size={20} strokeWidth={2.2} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <style jsx>{`
        .sidebar{position:fixed;top:0;left:0;bottom:0;width:244px;background:rgba(255,255,255,.86);backdrop-filter:blur(10px);border-right:1px solid var(--border);padding:22px 16px;display:flex;flex-direction:column;gap:24px;z-index:20}
        .brand{display:flex;align-items:center;gap:12px;padding:6px 8px}
        .brandText{display:flex;flex-direction:column;gap:3px}
        .brandText small{font-size:12px;color:var(--muted)}
        nav{display:flex;flex-direction:column;gap:5px}
        .navItem{display:flex;align-items:center;gap:12px;padding:11px 12px;border:none;background:none;border-radius:12px;color:var(--muted);font-size:14px;font-weight:600;text-align:left;width:100%;position:relative;transition:background .15s,color .15s}
        .navIcon{display:grid;place-items:center;width:30px;height:30px;border-radius:9px;background:var(--surface-2);color:var(--muted);transition:all .15s}
        .navItem:hover{background:var(--surface-2);color:var(--text)}
        .navItem.on{background:var(--soft);color:var(--primary)}
        .navItem.on .navIcon{background:var(--grad-brand);color:#fff}
        .foot{margin-top:auto;padding:0 4px}
        .segura{font-size:11px;color:var(--muted-2);line-height:1.6;display:flex;align-items:center;gap:7px;padding:0 4px}
        .dotHealthy{width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px var(--accent-soft);flex-shrink:0}
        .entrar{width:100%;display:flex;align-items:center;justify-content:center;gap:7px;padding:11px;border:1px solid var(--border);background:var(--soft);color:var(--primary);border-radius:11px;font-size:13px;font-weight:600}
        .entrar:hover{background:var(--accent-soft)}
        .cuenta{display:flex;flex-direction:column;gap:8px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:11px}
        .ce{display:flex;align-items:center;gap:8px;min-width:0}
        .mail{font-size:12px;color:var(--text);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .cbtn{display:inline-flex;align-items:center;gap:6px;border:none;background:none;color:var(--muted);font-size:12px;font-weight:600;padding:0}
        .cbtn:hover{color:var(--danger)}
        .mobileTop{display:none}
        .bottomNav{display:none}
        @media(max-width:860px){
          .sidebar{display:none}
          .mobileTop{display:flex;align-items:center;gap:9px;position:sticky;top:0;background:rgba(255,255,255,.9);backdrop-filter:blur(8px);border-bottom:1px solid var(--border);padding:12px 16px;z-index:25}
          .bottomNav{display:flex;flex-direction:row;position:fixed;left:0;right:0;bottom:0;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);border-top:1px solid var(--border);z-index:30;padding:7px 4px 9px}
          .bottomNav button{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:none;color:var(--muted-2);font-size:10px;font-weight:600;padding:4px 0}
          .bottomNav button.on{color:var(--primary)}
        }
      `}</style>
    </>
  );
}
