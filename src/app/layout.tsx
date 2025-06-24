import type { Metadata } from "next"
import "./globals.css"
import { Kanit } from "next/font/google"
import 'animate.css'

// Fuente principal: Kanit
const kanit = Kanit({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Desarrollador Web Full Stack | TuNombre.dev",
  description:
    "Portafolio y servicios de desarrollo web moderno con React, Next.js, Tailwind, Node.js y más. Sitios rápidos, accesibles y optimizados para SEO.",
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
  creator: "Frenmy Garcia",
  generator: "Next.js",
  openGraph: {
    title: "Frenmy Garcia | Desarrollo Web Moderno",
    description:
      "Desarrollador web especializado en crear sitios rápidos, escalables y optimizados para SEO. Proyectos personalizados y tecnología moderna.",
    url: "https://www.desarrolladorsitioweb.es/",
    siteName: "Frenmy Garcia",
    images: [
      {
        url: "/logo2.png",
        width: 1200,
        height: 630,
        alt: "Frenmy Garcia Portafolio",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  metadataBase: new URL("https://www.desarrolladorsitioweb.es/"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-title" content="Frenmy Garcia" />
      </head>
      <body
        className={`${kanit.className} antialiased text-white scroll-smooth overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  )
}
