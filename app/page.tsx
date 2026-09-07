"use client";

import { useEffect, useMemo, useState } from "react";
import ProfileModal from "@/app/components/ProfileModal";
import DietPlan from "@/app/components/DietPlan";
import { Perfil, PlanDieta, generarPlan } from "@/app/lib/diet";

const meals = [
  { title: "Comida 1", time: "7:00–9:00", text: "4 huevos + 150 g de frijoles + 4 tortillas + salsa" },
  { title: "Comida 2", time: "14:00–17:00", text: "250 g de pollo + 250 g de arroz + verduras + 2 tortillas" },
  { title: "Snack opcional", time: "Si hay hambre", text: "Yogur natural + 1 fruta" },
];

const STORAGE_KEY = "nutritrack:perfil";

export default function Home() {
  const [weight, setWeight] = useState(167);
  const [water, setWater] = useState(0);
  const [soda, setSoda] = useState(1000);
  const [walked, setWalked] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [plan, setPlan] = useState<PlanDieta | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Cargar perfil guardado al iniciar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const guardado = JSON.parse(raw) as Perfil;
        setPerfil(guardado);
        setPlan(generarPlan(guardado));
        setWeight(guardado.pesoKg);
      }
    } catch {
      // localStorage no disponible o dato inválido: seguimos con valores por defecto
    }
  }, []);

  const lost = perfil ? Math.max(0, perfil.pesoKg - weight) : Math.max(0, 167 - weight);
  const metaInicial = 8;
  const progress = Math.min(100, Math.max(0, (lost / metaInicial) * 100));
  const habits = useMemo(() => [water >= 1500, soda <= 500, walked].filter(Boolean).length, [water, soda, walked]);

  function toggleMeal(index: number) {
    setCompleted((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  }

  function guardarPerfil(nuevo: Perfil) {
    setPerfil(nuevo);
    setPlan(generarPlan(nuevo));
    setWeight(nuevo.pesoKg);
    setModalAbierto(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo));
    } catch {
      // sin persistencia: el plan sigue visible en esta sesión
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div><strong className="logo">NutriTrack</strong><span className="subtitle"> · Tu progreso, sin complicarte</span></div>
        <button className="ctaTop" onClick={() => setModalAbierto(true)}>
          {perfil ? "Ajustar mi dieta" : "Crear mi dieta"}
        </button>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">{perfil ? `HOLA, ${(perfil.nombre || "BIENVENIDO").toUpperCase()}` : "OBJETIVO INICIAL"}</p>
          <h1>{perfil ? `${perfil.pesoKg} kg` : "167 kg"} <span>→</span> {perfil ? `${Math.max(0, perfil.pesoKg - metaInicial)} kg` : "159 kg"}</h1>
          <p>Enfócate en bajar poco a poco, comer mejor y tener más energía.</p>
        </div>
        <div className="progressCard">
          <div className="progressTop"><span>Progreso</span><b>{lost.toFixed(1)} kg</b></div>
          <div className="bar"><i style={{ width: `${progress}%` }} /></div>
          <small>{progress.toFixed(0)}% del primer objetivo</small>
        </div>
      </section>

      {!plan && (
        <section className="promo">
          <div>
            <h3>¿Qué comer hoy? Deja que NutriTrack te proponga una dieta</h3>
            <p>Responde unas preguntas rápidas y te armamos un plan flexible, para nada estricto, hecho a tu medida.</p>
          </div>
          <button className="ctaBig" onClick={() => setModalAbierto(true)}>Responder preguntas</button>
        </section>
      )}

      <section className="grid stats">
        <article><span>PESO ACTUAL</span><strong>{weight} kg</strong><button onClick={() => setWeight((w) => Math.max(1, w - 0.5))}>− 0.5 kg</button></article>
        <article><span>AGUA HOY</span><strong>{(water / 1000).toFixed(1)} L</strong><button onClick={() => setWater((w) => Math.min(4000, w + 250))}>+ 250 ml</button></article>
        <article><span>REFRESCO HOY</span><strong>{soda} ml</strong><button onClick={() => setSoda((s) => Math.max(0, s - 250))}>− 250 ml</button></article>
        <article><span>HÁBITOS</span><strong>{habits}/3</strong><button onClick={() => setWalked((v) => !v)}>{walked ? "✓ Caminata" : "Marcar caminata"}</button></article>
      </section>

      {plan && (
        <div className="grid planWrap">
          <DietPlan plan={plan} onEditar={() => setModalAbierto(true)} />
        </div>
      )}

      <div className="contentGrid">
        <section className="panel">
          <div className="panelHead"><div><p className="eyebrow">HOY</p><h2>Tu alimentación</h2></div><span className="badge">2 comidas + snack</span></div>
          <div className="mealList">
            {meals.map((meal, index) => {
              const done = completed.includes(index);
              return <div className={`meal ${done ? "done" : ""}`} key={meal.title}>
                <div className="mealNumber">{done ? "✓" : index + 1}</div>
                <div className="mealBody"><div className="mealTitle"><b>{meal.title}</b><small>{meal.time}</small></div><p>{meal.text}</p></div>
                <button className="check" onClick={() => toggleMeal(index)}>{done ? "Listo" : "Marcar"}</button>
              </div>;
            })}
          </div>
        </section>

        <aside className="panel habitsPanel">
          <p className="eyebrow">HÁBITOS</p><h2>Lo importante hoy</h2>
          <div className="habit"><div><b>💧 Agua</b><small>Meta inicial: 1.5–2 L</small></div><strong>{water >= 1500 ? "✓" : `${water} ml`}</strong></div>
          <div className="habit"><div><b>🥤 Refresco</b><small>Intenta bajar gradualmente</small></div><strong>{soda <= 500 ? "✓" : `${soda} ml`}</strong></div>
          <div className="habit"><div><b>🚶 Caminata</b><small>10–15 min después del trabajo</small></div><button onClick={() => setWalked((v) => !v)}>{walked ? "✓" : "Marcar"}</button></div>
          <div className="tip"><b>💡 Consejo</b><p>No necesitas hacerlo perfecto. La meta es repetir buenas decisiones la mayoría de los días.</p></div>
        </aside>
      </div>

      <section className="panel weekly">
        <div className="panelHead"><div><p className="eyebrow">SEGUIMIENTO</p><h2>Esta semana</h2></div><span className="badge">0 días registrados</span></div>
        <div className="emptyChart"><div className="line" /><span>Registra tu peso para comenzar a ver tu tendencia.</span></div>
      </section>

      <footer>NutriTrack · Tu perfil y dieta se guardan en este dispositivo.</footer>

      {modalAbierto && (
        <ProfileModal
          perfilInicial={perfil}
          onClose={() => setModalAbierto(false)}
          onGuardar={guardarPerfil}
        />
      )}

      <style jsx>{`
        .page{min-height:100vh}.topbar{height:72px;background:#fff;border-bottom:1px solid #e4e9e5;display:flex;align-items:center;justify-content:space-between;padding:0 max(24px,calc((100% - 1120px)/2))}.logo{font-size:22px;letter-spacing:-.5px}.subtitle{color:#718077;font-size:14px}.ctaTop{background:#315d46;color:#fff;border:none;padding:10px 16px;border-radius:20px;font-size:13px;font-weight:600}.hero{max-width:1120px;margin:36px auto 24px;padding:0 24px;display:grid;grid-template-columns:1.4fr 1fr;gap:24px;align-items:end}.eyebrow{font-size:11px;letter-spacing:1.3px;color:#718078;font-weight:700;margin:0 0 8px}.hero h1{font-size:42px;letter-spacing:-2px;margin:0 0 8px}.hero h1 span{font-size:30px;color:#829088}.hero p:not(.eyebrow){color:#68756e;margin:0;line-height:1.5}.promo{max-width:1120px;margin:0 auto 8px;padding:22px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px;background:#315d46;color:#fff;border-radius:16px;width:calc(100% - 48px)}.promo h3{margin:0 0 6px;font-size:19px;letter-spacing:-.4px}.promo p{margin:0;font-size:14px;color:#d7e5dd;line-height:1.5}.ctaBig{background:#fff;color:#315d46;border:none;padding:12px 20px;border-radius:10px;font-weight:700;font-size:14px;white-space:nowrap}.progressCard,.panel,.stats article{background:#fff;border:1px solid #e3e9e5;border-radius:16px;box-shadow:0 2px 8px #17211b08}.progressCard{padding:20px}.progressTop{display:flex;justify-content:space-between;margin-bottom:12px}.progressTop b{font-size:20px}.bar{height:9px;background:#e8eeea;border-radius:99px;overflow:hidden}.bar i{display:block;height:100%;background:#315d46;border-radius:99px}.progressCard small{display:block;color:#7a867f;margin-top:9px}.grid{max-width:1120px;margin:0 auto;padding:0 24px}.planWrap{margin:24px auto}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.stats article{padding:18px}.stats span{font-size:10px;letter-spacing:1px;color:#78847d;font-weight:700;display:block}.stats strong{display:block;font-size:25px;margin:7px 0 12px}.stats button,.check,.habitsPanel button{border:1px solid #d7dfda;background:#f7f9f8;color:#315d46;border-radius:8px;padding:7px 10px;font-size:12px}.contentGrid{max-width:1120px;margin:24px auto;display:grid;grid-template-columns:1.5fr 1fr;gap:24px;padding:0 24px}.panel{padding:24px}.panelHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.panel h2{margin:0;font-size:22px;letter-spacing:-.5px}.badge{font-size:11px;color:#637169;background:#f1f4f2;padding:7px 10px;border-radius:20px}.meal{display:flex;align-items:center;gap:14px;padding:16px 0;border-top:1px solid #edf0ee}.mealNumber{width:30px;height:30px;border-radius:50%;background:#edf3ef;color:#315d46;display:grid;place-items:center;font-weight:700;font-size:13px}.meal.done .mealNumber{background:#315d46;color:#fff}.mealBody{flex:1}.mealTitle{display:flex;gap:10px;align-items:center}.mealTitle small{font-size:11px;color:#88938d}.mealBody p{margin:6px 0 0;color:#68756e;font-size:13px;line-height:1.45}.check{white-space:nowrap}.done .mealBody{opacity:.55}.habit{display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-top:1px solid #edf0ee}.habit div{display:flex;flex-direction:column;gap:5px}.habit small{font-size:11px;color:#7c8881}.habit strong{font-size:14px;color:#315d46}.tip{margin-top:18px;padding:14px;background:#f4f7f5;border-radius:12px;font-size:12px}.tip p{color:#69766e;line-height:1.5;margin:6px 0 0}.weekly{max-width:1072px;margin:0 auto 30px}.emptyChart{height:150px;border:1px dashed #d7dfda;border-radius:12px;display:flex;align-items:center;justify-content:center;position:relative;color:#7c8881;font-size:13px}.line{position:absolute;left:8%;right:8%;top:50%;border-top:1px solid #e5ebe7}.emptyChart span{position:relative;background:#fff;padding:0 12px}footer{text-align:center;color:#8a958e;font-size:11px;padding:8px 24px 30px}@media(max-width:800px){.hero,.contentGrid{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,1fr)}.hero h1{font-size:34px}.promo{flex-direction:column;align-items:flex-start}}@media(max-width:480px){.topbar{padding:0 16px}.subtitle{display:none}.grid,.hero,.contentGrid{padding:0 16px}.stats{gap:9px}.stats article{padding:14px}.panel{padding:18px}.meal{align-items:flex-start}.check{padding:6px 8px}}
      `}</style>
    </main>
  );
}
