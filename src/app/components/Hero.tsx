'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

export default function Hero() {
  const derecha = useRef<HTMLImageElement>(null)
  const prevScroll = useRef(0)
  const izquierda = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      prevScroll.current = currentScroll

      if (derecha.current) {
        const moveX = Math.min(Math.max(currentScroll * 0.5, -500), 500)
        derecha.current.style.transform = `translateX(${moveX}px)`
        derecha.current.style.transition = 'transform 0.2s ease-out'
      }
      if (izquierda.current) {
        const moveX = Math.min(Math.max(currentScroll * -0.5, -500), 500)
        izquierda.current.style.transform = `translateX(${moveX}px)`
        izquierda.current.style.transition = 'transform 0.2s ease-out'
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="bg-[#F0FDF4] min-h-screen flex items-center justify-center pt-40 px-6 py-20 shadow-md relative">
      {/* SVG decorativo grande con gradiente */}
      <div className='w-full h-screen absolute bottom-0 left-0'>

        <Image src={'/hero/fondo.svg'} alt='fondo animado para el hero' fill className='object-cover' />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center z-10">
        {/* Contenido SEO */}
        <div ref={izquierda} className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E293B] leading-tight tracking-tight">
            Impulsa tu presencia digital con impacto
          </h1>
          <h2 className="text-lg md:text-xl text-[#475569] font-medium leading-snug">
            Creamos experiencias digitales modernas, desde sitios web estratégicos hasta aplicaciones móviles que conectan y convierten.
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            En <strong>Nova Forge</strong> potenciamos marcas mediante soluciones a medida: diseño elegante, rendimiento técnico, posicionamiento SEO y escalabilidad. Ya seas una startup o una empresa consolidada, te ayudamos a destacar con tecnología y propósito.
          </p>
          <Link
            href="/#contacto"
            className="inline-block px-6 py-3 text-sm font-semibold rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md hover:scale-105 transition-transform"
          >
            Solicita tu propuesta personalizada
          </Link>
        </div>


        {/* Imagen lateral */}
        <div ref={derecha} className="flex justify-center">
          <Image
            src="/fondo.webp"
            width={500}
            height={500}
            alt="Ilustración de desarrollo web y aplicaciones"
            className="w-full h-auto max-w-md"
          />
        </div>
      </div>
    </section>
  )
}
