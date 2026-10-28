import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lidia Penteado | Arquitetura e Interiores de Alto Padrão",
  description:
    "Arquiteta desde 2010, à frente da Pitaya Arquitetura Estratégica em Valinhos (SP). Casas de alto padrão, interiores, retrofit de fachadas, clínicas e escritórios, com neuroarquitetura.",
  openGraph: {
    title: "Lidia Penteado Arquiteta",
    description: "Espaço, legado e permanência. Arquitetura e interiores de alto padrão em Valinhos, Campinas e região.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${instrument.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
