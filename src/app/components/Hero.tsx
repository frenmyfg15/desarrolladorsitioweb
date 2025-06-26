'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

export default function Hero() {

    const derecha = useRef<HTMLImageElement>(null);
    const prevScroll = useRef(0);
    const izquierda = useRef<HTMLImageElement>(null);
  
  
    useEffect(() => {
      const handleScroll = () => {
        const currentScroll = window.scrollY;
        prevScroll.current = currentScroll;
  
        if (derecha.current) {
          const moveX = Math.min(Math.max(currentScroll * 0.5, -500), 500);
          derecha.current.style.transform = `translateX(${moveX}px)`;
          derecha.current.style.transition = 'transform 0.2s ease-out';
        }
        if (izquierda.current) {
          const moveX = Math.min(Math.max(currentScroll * -0.5, -500), 500);
          izquierda.current.style.transform = `translateX(${moveX}px)`;
          izquierda.current.style.transition = 'transform 0.2s ease-out';
        }
  
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
    <section className="bg-[#F0FDF4] min-h-screen flex items-center justify-center px-6 py-20 shadow-md">
      {/* SVG decorativo grande con gradiente */}
      <div className='w-full h-screen absolute bottom-0 left-0'>

        <Image src={'/hero/fondo.svg'} alt='fondo animado para el hero' fill className='object-cover'/>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center z-10">
        {/* Texto */}
        <div ref={izquierda}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#334155] mb-4">
            Impulsa tu presencia digital
          </h1>
          <h2 className="text-lg md:text-xl text-[#475569] mb-8">
            Desarrollo web moderno, rápido y personalizado para empresas creativas.
          </h2>
          <Link href={'/#contacto'} className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-300 text-gray-900 shadow-md hover:scale-105 transition-transform">
            Comienza ahora
          </Link>
        </div>

        {/* Imagen */}
        <div ref={derecha} className="flex justify-center">
          <Image
            src="/fondo.png"
            width={500}
            height={500}
            alt="Ilustración de tecnología"
            className="w-full h-auto max-w-md"
          />
        </div>
      </div>
    </section>
  )
}
