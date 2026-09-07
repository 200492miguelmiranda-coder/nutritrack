"use client";

import { LayoutDashboard, UtensilsCrossed, TrendingUp, ListChecks, UserRound } from "lucide-react";

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
          <span className="dot" />
          <div>
            <strong>NutriTrack</strong>
            <small>{nombre ? `Hola, ${nombre}` : "Tu progreso"}</small>
          </div>
        </div>
        <nav>
          {ITEMS.map(({ id, label, Icon }) => (
            <button key={id} className={vista === id ? "navItem on" : "navItem"} onClick={() => onVista(id)}>
              <Icon size={19} strokeWidth={2} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="foot">Tus datos se guardan en este dispositivo.</div>
      </aside>

      {/* Navegación inferior (móvil) */}
      <nav className="bottomNav">
        {ITEMS.map(({ id, label, Icon }) => (
          <button key={id} className={vista === id ? "on" : ""} onClick={() => onVista(id)}>
            <Icon size={20} strokeWidth={2} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <style jsx>{`
        .sidebar{position:fixed;top:0;left:0;bottom:0;width:236px;background:var(--surface);border-right:1px solid var(--border);padding:22px 16px;display:flex;flex-direction:column;gap:22px;z-index:20}
        .brand{display:flex;align-items:center;gap:11px;padding:6px 8px}
        .dot{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#2f5d46,#4c8d68);flex-shrink:0}
        .brand strong{display:block;font-size:17px;letter-spacing:-.4px}
        .brand small{display:block;font-size:12px;color:var(--muted)}
        nav{display:flex;flex-direction:column;gap:4px}
        .navItem{display:flex;align-items:center;gap:12px;padding:11px 12px;border:none;background:none;border-radius:10px;color:var(--muted);font-size:14px;font-weight:600;text-align:left;width:100%}
        .navItem:hover{background:var(--surface-2);color:var(--text)}
        .navItem.on{background:var(--soft);color:var(--primary)}
        .foot{margin-top:auto;font-size:11px;color:var(--muted-2);padding:0 8px;line-height:1.5}
        .bottomNav{display:none}
        @media(max-width:860px){
          .sidebar{display:none}
          .bottomNav{display:flex;flex-direction:row;position:fixed;left:0;right:0;bottom:0;background:var(--surface);border-top:1px solid var(--border);z-index:30;padding:6px 4px 8px}
          .bottomNav button{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:none;color:var(--muted-2);font-size:10px;font-weight:600;padding:4px 0}
          .bottomNav button.on{color:var(--primary)}
        }
      `}</style>
    </>
  );
}
