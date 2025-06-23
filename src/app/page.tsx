'use client'
import About from '@/components/About';
import Contacto from '@/components/Contacto';
import Footer from '@/components/Footer';
import Head from '@/components/Head';
import Hero from '@/components/Hero';
import Proyecto from '@/components/Proyecto';
import Servicios from '@/components/Servicios';
import Tecnologias from '@/components/Tecnologias';

export default function HomePage() {
  return (
    <main className="h-screen">

      <Head />
      <Hero />

      <div id='proyecto'>
      <Proyecto />
      </div>

      <div id='tecnologias'>
        <Tecnologias/>
      </div>

      <div id='servicios'>
        <Servicios/>
      </div>

      <div id='about'>
        <About/>
      </div>

      <div id='contacto'>
        <Contacto/>
      </div>

      <Footer/>
    </main>
  );
}
