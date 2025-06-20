'use client'
import Head from '@/components/Head';
import Hero from '@/components/Hero';

export default function HomePage() {
  return (
    <main className="bg-gray-900 h-screen snap-y snap-mandatory overflow-y-scroll">
      {/* Header fijo, fuera del flujo */}
      <Head />

      {/* Sección 1 (Hero), ajustada con padding-top si el header mide 64px (h-16) */}
      <section className="h-screen snap-start">
        <Hero />
      </section>

      {/* Sección 2 */}
      <section className="h-screen snap-start flex items-center justify-center">
        <h1 className="text-white text-3xl">Esta es otra seccion</h1>
      </section>
    </main>
  );
}
