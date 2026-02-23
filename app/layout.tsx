import type { Metadata } from "next";
import "./api/interceptors";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const BASE_URL = "https://www.desarrolladorsitioweb.es/";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Títulos ──────────────────────────────────────────────────────────────
  title: {
    default: "NovaForge — Diseño web, desarrollo y apps a medida",
    template: "%s | NovaForge",
  },

  // ── Descripción ───────────────────────────────────────────────────────────
  description:
    "Agencia de desarrollo web y apps. Creamos landing pages, webs corporativas, dashboards, e-commerce y apps móviles con diseño UI/UX, entrega por fases y pago por fase. España y República Dominicana.",

  // ── Keywords ──────────────────────────────────────────────────────────────
  keywords: [
    "desarrollo web", "agencia web", "diseño web", "landing page",
    "aplicaciones móviles", "app a medida", "dashboard", "e-commerce",
    "diseño UI UX", "React", "Next.js", "TypeScript", "Node.js",
    "desarrollo por fases", "NovaForge", "República Dominicana", "España",
  ],

  // ── Autores y categoría ───────────────────────────────────────────────────
  authors: [{ name: "NovaForge", url: BASE_URL }],
  creator: "NovaForge",
  publisher: "NovaForge",
  category: "technology",

  // ── Open Graph (Facebook, LinkedIn, WhatsApp) ────────────────────────────
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: BASE_URL,
    siteName: "NovaForge",
    title: "NovaForge — Diseño web, desarrollo y apps a medida",
    description:
      "Creamos landing pages, webs corporativas, dashboards, e-commerce y apps móviles. Entrega por fases, pago por fase. Sin sorpresas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NovaForge — Diseño web y desarrollo a medida",
      },
    ],
  },

  // ── Twitter / X Card ─────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "NovaForge — Diseño web, desarrollo y apps a medida",
    description:
      "Creamos landing pages, webs corporativas, dashboards, e-commerce y apps móviles. Entrega por fases, pago por fase.",
    images: ["/og-image.png"],
    creator: "@novaforge",
  },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ── Verificación ──────────────────────────────────────────────────────────
  // verification: {
  //   google: "TU_GOOGLE_SEARCH_CONSOLE_TOKEN",
  // },

  // ── App / PWA ─────────────────────────────────────────────────────────────
  applicationName: "NovaForge",
  appleWebApp: {
    capable: true,
    title: "NovaForge",
    statusBarStyle: "default",
  },

  // ── Iconos ────────────────────────────────────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} font-sans antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}