import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from 'next/font/google'
import CookiesBanner from "./components/CookiesBanner";
import 'animate.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "Desarrolladores Web Full Stack",
  description:
    "Servicios de desarrollo web moderno con React, Next.js, Tailwind, Node.js y más. Sitios rápidos, accesibles y optimizados para SEO.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  keywords: [
    "desarrollador web",
    "desarrollo web full stack",
    "freelance react nextjs",
    "portafolio de programador",
    "servicios de desarrollo web",
    "seo técnico",
    "tailwind",
    "node.js",
    "diseño responsive"
  ],
  authors: [{ name: "Frenmy Garcia", url: "https://www.desarrolladorsitioweb.es/" }],
  creator: "NovaForge",
  generator: "Next.js",
  openGraph: {
    title: "NovaForge | Desarrollo Web Moderno",
    description:
      "Desarrollador web especializado en crear sitios rápidos, escalables y optimizados para SEO. Proyectos personalizados y tecnología moderna.",
    url: "https://www.desarrolladorsitioweb.es/",
    siteName: "NovaForge",
    locale: "es_ES",
    type: "website",
  },
  metadataBase: new URL("https://www.desarrolladorsitioweb.es/"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${outfit.className}`}
      >
        {children}
      </body>
      <CookiesBanner/>
    </html>
  );
}
