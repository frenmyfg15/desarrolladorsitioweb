'use client'
import Head from '@/components/Head';
import Hero from '@/components/Hero';
import Proyecto from '@/components/Proyecto';

export default function HomePage() {
  return (
    <main className="h-screen">
      {/* Header fijo, fuera del flujo */}
      <Head />
      <Hero />
      <Proyecto />
      <section className="h-screen flex items-center justify-center bg-gray-900 z-50">
        <h1 className="text-white text-3xl">Esta es otra seccion</h1>
      </section>
    </main>
  );
}
