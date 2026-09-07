"use client";

import { PuntoPeso } from "@/app/hooks/useNutriData";

interface Props {
  puntos: PuntoPeso[];
  objetivo?: number;
}

// Gráfica de línea en SVG, sin librerías externas.
export default function WeightChart({ puntos, objetivo }: Props) {
  if (puntos.length < 2) {
    return (
      <div className="vacio">
        <span>Registra tu peso al menos dos días para ver tu tendencia.</span>
        <style jsx>{`
          .vacio{height:220px;border:1px dashed var(--border);border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--muted-2);font-size:13px;text-align:center;padding:0 24px}
        `}</style>
      </div>
    );
  }

  const W = 640;
  const H = 240;
  const padX = 40;
  const padY = 28;

  const valores = puntos.map((p) => p.valor);
  const min = Math.min(...valores, objetivo ?? Infinity);
  const max = Math.max(...valores);
  const rango = max - min || 1;
  const margen = rango * 0.15;
  const yMin = min - margen;
  const yMax = max + margen;

  const x = (i: number) => padX + (i * (W - padX * 2)) / (puntos.length - 1);
  const y = (v: number) => padY + ((yMax - v) / (yMax - yMin)) * (H - padY * 2);

  const linea = puntos.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.valor)}`).join(" ");
  const area = `${linea} L ${x(puntos.length - 1)} ${H - padY} L ${x(0)} ${H - padY} Z`;

  const yObjetivo = objetivo != null ? y(objetivo) : null;

  // Muestra a lo sumo ~6 etiquetas en el eje X
  const paso = Math.ceil(puntos.length / 6);

  return (
    <div className="wrap">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Gráfica de peso">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2f5d46" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2f5d46" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yObjetivo != null && (
          <g>
            <line x1={padX} y1={yObjetivo} x2={W - padX} y2={yObjetivo} stroke="#c6a15b" strokeWidth="1.5" strokeDasharray="5 5" />
            <text x={W - padX} y={yObjetivo - 6} textAnchor="end" fontSize="11" fill="#a5822f">Meta {objetivo} kg</text>
          </g>
        )}

        <path d={area} fill="url(#areaFill)" />
        <path d={linea} fill="none" stroke="#2f5d46" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {puntos.map((p, i) => (
          <g key={p.fecha + i}>
            <circle cx={x(i)} cy={y(p.valor)} r={i === puntos.length - 1 ? 5 : 3.5} fill="#fff" stroke="#2f5d46" strokeWidth="2.5" />
            {(i % paso === 0 || i === puntos.length - 1) && (
              <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#8a958e">{p.etiqueta}</text>
            )}
          </g>
        ))}
      </svg>
      <style jsx>{`
        .wrap{width:100%;overflow-x:auto}
        svg{width:100%;min-width:320px;height:auto;display:block}
      `}</style>
    </div>
  );
}
