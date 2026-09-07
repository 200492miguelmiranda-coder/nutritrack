import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque, Fredoka, Sora } from "next/font/google";
import "./globals.css";

const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fontBricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["600", "700", "800"],
});

const fontFredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
  weight: ["500", "600", "700"],
});

const fontSora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
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
  const fuentes = `${fontBody.variable} ${fontBricolage.variable} ${fontFredoka.variable} ${fontSora.variable}`;
  return (
    <html lang="es" className={fuentes}>
      <body>{children}</body>
    </html>
  );
}
