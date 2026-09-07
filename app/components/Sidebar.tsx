"use client";

import { LayoutDashboard, UtensilsCrossed, TrendingUp, ListChecks, UserRound } from "lucide-react";
import { LogoMark, Wordmark } from "@/app/components/Logo";

export type Vista = "inicio" | "dieta" | "progreso" | "habitos" | "perfil";

interface Props {
  vista: Vista;
  onVista: (v: Vista) => void;
  nombre?: string;
}

const ITEMS: { id: Vista; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: "inicio", label: "Inicio", Icon: LayoutDashboard },
  { id: "dieta", label: "Mi dieta", Icon: UtensilsCrossed },
  { id: "progreso", label: "Progreso", Icon: TrendingUp },
  { id: "habitos", label: "Hábitos", Icon: ListChecks },
  { id: "perfil", label: "Perfil", Icon: UserRound },
];

export default function Sidebar({ vista, onVista, nombre }: Props) {
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
          <span className="dotHealthy" /> Datos guardados de forma segura.
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
        .foot{margin-top:auto;font-size:11px;color:var(--muted-2);padding:0 8px;line-height:1.6;display:flex;align-items:center;gap:7px}
        .dotHealthy{width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px var(--accent-soft);flex-shrink:0}
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
