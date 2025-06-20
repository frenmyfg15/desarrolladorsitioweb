'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'

export default function Hero() {

  useEffect(() => {
  const back = document.getElementById('layer-back');
  const front = document.getElementById('layer-front');

  const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20; // rango -10 a +10
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    if (back) {
      back.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px) scale(1.1)`;
    }

    if (front) {
      front.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    }
  };

  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);

  return (
    <section className="flex items-center justify-center h-screen px-10 py-10 flex-wrap gap-x-20 bg-transparent relative overflow-hidden pt-10">
<div className="w-full absolute h-screen top-[-10px] overflow-hidden perspective-[1000px]">
  {/* Capa trasera */}
  <div id="layer-back" className="absolute inset-0 will-change-transform transition-transform duration-300">
    <Image src="/fondo2.png" alt="Fondo 2" fill className="object-cover" />
  </div>

  {/* Capa delantera */}
  <div id="layer-front" className="absolute inset-0 will-change-transform transition-transform duration-300">
    <Image src="/fondo.png" alt="Fondo" fill className="object-cover" />
  </div>

  {/* Gradiente */}
  <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-900 via-white/0 to-transparent pointer-events-none z-10" />
</div>



      {/* Texto principal */}
      <div className="flex flex-col justify-between gap-y-10 w-full max-w-[30rem] md:max-w-[40rem] lg:max-w-[48rem] z-10 md:pt-10">
        <h1 className="font-black text-3xl md:text-5xl lg:text-6xl text-center animate__animated animate__backInLeft animate__faster text-shadow-2xs">
          DESARROLLADOR FULL STACK
        </h1>

        <p className="font-bold text-base md:text-lg lg:text-xl text-center animate__animated animate__backInLeft animate__fast">
          Experiencia en construcción de interfaces modernas, APIs eficientes y soluciones multiplataformas
        </p>

        <p className="hidden lg:block text-base text-center animate__animated animate__backInLeft animate__fast">
          También experiencia trabajando en equipos ágiles y manteniendo buenas prácticas de desarrollo.
        </p>

        <div className="flex gap-5 md:gap-8 justify-center animate__animated animate__backInLeft">
          <Link href="">
            <span className="bg-white/20 px-10 py-2 md:px-12 md:py-3 rounded-2xl font-black shadow-d hover:scale-110 transition">
              GITHUB
            </span>
          </Link>
          <Link href="">
            <span className="bg-gradient-to-r from-[#22FF00] to-[#009966] px-10 py-2 md:px-12 md:py-3 rounded-2xl font-black text-white shadow-d hover:scale-110 transition">
              LINKEDIN
            </span>
          </Link>
        </div>
      </div>

        <div className="animate__animated animate__backInRight animate__fast">
          <Image src="/developer.png" alt="Head" width={300} height={300} className='animate__animated animate__pulse animate__infinite animate__delay-0s'/>
        </div>

    </section>
  )
}
