"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar, { Vista } from "@/app/components/Sidebar";
import AuthGate from "@/app/components/AuthGate";
import ProfileModal from "@/app/components/ProfileModal";
import DashboardView from "@/app/components/views/DashboardView";
import DiarioView from "@/app/components/views/DiarioView";
import DietView from "@/app/components/views/DietView";
import ProgressView from "@/app/components/views/ProgressView";
import HabitsView from "@/app/components/views/HabitsView";
import ProfileView from "@/app/components/views/ProfileView";
import { useNutriData } from "@/app/hooks/useNutriData";
import { useAuth } from "@/app/hooks/useAuth";
import { Perfil, generarPlan } from "@/app/lib/diet";
import { TEMA_POR_DEFECTO, temaVars } from "@/app/lib/tema";

export default function Home() {
  const auth = useAuth();
  const nutri = useNutriData(auth.sesion.userId);
  const [vista, setVista] = useState<Vista>("inicio");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [invitado, setInvitado] = useState(false);
  const [gateListo, setGateListo] = useState(false);

  const INVITADO_KEY = "nutritrack:invitado";

  useEffect(() => {
    try {
      setInvitado(localStorage.getItem(INVITADO_KEY) === "1");
    } catch {
      // sin acceso a localStorage
    }
    setGateListo(true);
  }, []);

  function usarSinCuenta() {
    setInvitado(true);
    try { localStorage.setItem(INVITADO_KEY, "1"); } catch { /* ignore */ }
  }

  function pedirEntrar() {
    setInvitado(false);
    try { localStorage.removeItem(INVITADO_KEY); } catch { /* ignore */ }
  }

  async function cerrarSesion() {
    await auth.salir();
    pedirEntrar();
  }

  const plan = useMemo(() => (nutri.data.perfil ? generarPlan(nutri.data.perfil) : null), [nutri.data.perfil]);

  // Aplica el tema (colores, fondo, fuente) a todo el documento
  useEffect(() => {
    const vars = temaVars(nutri.data.tema ?? TEMA_POR_DEFECTO);
    const raiz = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => raiz.style.setProperty(k, v));
  }, [nutri.data.tema]);

  function guardarPerfil(nuevo: Perfil) {
    nutri.guardarPerfil(nuevo);
    setModalAbierto(false);
  }

  // Pantalla de carga breve para evitar parpadeo antes de saber el estado de sesión
  if (!gateListo || auth.cargando) {
    return (
      <div className="loading">
        <span className="spin" />
        <style jsx>{`
          .loading{min-height:100vh;display:grid;place-items:center}
          .spin{width:34px;height:34px;border-radius:50%;border:3px solid var(--soft);border-top-color:var(--primary);animation:g 0.8s linear infinite}
          @keyframes g{to{transform:rotate(360deg)}}
        `}</style>
      </div>
    );
  }

  // Con Supabase disponible y sin sesión, invitamos a iniciar sesión
  if (auth.disponible && !auth.sesion.userId && !invitado) {
    return <AuthGate auth={auth} onInvitado={usarSinCuenta} />;
  }

  return (
    <div className="app">
      <Sidebar
        vista={vista}
        onVista={setVista}
        nombre={nutri.data.perfil?.nombre || undefined}
        disponible={auth.disponible}
        email={auth.sesion.email}
        onEntrar={pedirEntrar}
        onSalir={cerrarSesion}
      />

      <main className="content">
        <div className="inner">
          {vista === "inicio" && (
            <DashboardView nutri={nutri} plan={plan} onIrA={setVista} onCrearDieta={() => setModalAbierto(true)} />
          )}
          {vista === "diario" && <DiarioView nutri={nutri} />}
          {vista === "dieta" && <DietView plan={plan} objetivos={nutri.data.objetivos} onEditar={() => setModalAbierto(true)} />}
          {vista === "progreso" && <ProgressView nutri={nutri} />}
          {vista === "habitos" && <HabitsView nutri={nutri} />}
          {vista === "perfil" && <ProfileView nutri={nutri} auth={auth} plan={plan} onEditar={() => setModalAbierto(true)} />}
        </div>
      </main>

      {modalAbierto && (
        <ProfileModal
          perfilInicial={nutri.data.perfil}
          onClose={() => setModalAbierto(false)}
          onGuardar={guardarPerfil}
        />
      )}

      <style jsx>{`
        .app{min-height:100vh}
        .content{margin-left:236px;padding:28px}
        .inner{max-width:1080px;margin:0 auto}
        @media(max-width:860px){
          .content{margin-left:0;padding:18px 16px 88px}
        }
      `}</style>
    </div>
  );
}
