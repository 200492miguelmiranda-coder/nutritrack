"use client";

import { useMemo, useState } from "react";
import Sidebar, { Vista } from "@/app/components/Sidebar";
import ProfileModal from "@/app/components/ProfileModal";
import DashboardView from "@/app/components/views/DashboardView";
import DietView from "@/app/components/views/DietView";
import ProgressView from "@/app/components/views/ProgressView";
import HabitsView from "@/app/components/views/HabitsView";
import ProfileView from "@/app/components/views/ProfileView";
import { useNutriData } from "@/app/hooks/useNutriData";
import { Perfil, generarPlan } from "@/app/lib/diet";

export default function Home() {
  const nutri = useNutriData();
  const [vista, setVista] = useState<Vista>("inicio");
  const [modalAbierto, setModalAbierto] = useState(false);

  const plan = useMemo(() => (nutri.data.perfil ? generarPlan(nutri.data.perfil) : null), [nutri.data.perfil]);

  function guardarPerfil(nuevo: Perfil) {
    nutri.guardarPerfil(nuevo);
    setModalAbierto(false);
  }

  return (
    <div className="app">
      <Sidebar vista={vista} onVista={setVista} nombre={nutri.data.perfil?.nombre || undefined} />

      <main className="content">
        <div className="inner">
          {vista === "inicio" && (
            <DashboardView nutri={nutri} plan={plan} onIrA={setVista} onCrearDieta={() => setModalAbierto(true)} />
          )}
          {vista === "dieta" && <DietView plan={plan} onEditar={() => setModalAbierto(true)} />}
          {vista === "progreso" && <ProgressView nutri={nutri} />}
          {vista === "habitos" && <HabitsView nutri={nutri} />}
          {vista === "perfil" && <ProfileView nutri={nutri} onEditar={() => setModalAbierto(true)} />}
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
