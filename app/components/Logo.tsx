"use client";

// Marca de NutriTrack: una hoja con una línea de progreso ascendente,
// sobre un cuadro redondeado con degradado de marca.
export function LogoMark({ size = 36 }: { size?: number }) {
  const id = "ntgrad";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1f5a44" />
          <stop offset="0.55" stopColor="#2f7d5c" />
          <stop offset="1" stopColor="#46c185" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${id})`} />
      {/* Hoja */}
      <path
        d="M20 9c-6.2 1-10 5.2-10 10.8 0 2.1.6 4 1.6 5.6C13.4 21 16.6 17.9 21 16c-3.4 2.8-5.7 6.3-6.7 10.6 1.6.9 3.5 1.4 5.6 1.4 6 0 10.4-4.4 10.4-11C30.3 11.3 26 9 20 9Z"
        fill="#fff"
        fillOpacity="0.95"
      />
      {/* Línea de progreso */}
      <path d="M9 29.5l4.5-3 3.2 2 5.3-4.4 3.6 2.4 4.9-4.8" stroke="#c9f5df" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}

export function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <span className="wm">
      Nutri<span className="accent">Track</span>
      <style jsx>{`
        .wm{font-family:var(--font-display),sans-serif;font-weight:800;letter-spacing:-.03em;font-size:${small ? "16px" : "19px"};color:var(--text);line-height:1}
        .accent{color:var(--primary-2)}
      `}</style>
    </span>
  );
}
