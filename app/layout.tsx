import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NutriTrack · Tu progreso, sin complicarte",
  description: "Tablero personal para bajar de peso, comer mejor y construir hábitos, con dietas flexibles hechas a tu medida.",
};

export const viewport: Viewport = {
  themeColor: "#22614a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fontBody.variable} ${fontDisplay.variable}`}>
      <body>{children}</body>
    </html>
  );
}
