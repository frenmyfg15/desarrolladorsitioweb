'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

const tecnologias = [
  { nombre: 'React', imagen: '/tecnologias/react.png' },
  { nombre: 'Next.js', imagen: '/tecnologias/nextjs.png' },
  { nombre: 'Tailwind', imagen: '/tecnologias/tailwind.png' },
  { nombre: 'Node.js', imagen: '/tecnologias/nodejs.png' },
  { nombre: 'TypeScript', imagen: '/tecnologias/typescript.png' },
  { nombre: 'MySQL', imagen: '/tecnologias/mysql.png' },
  { nombre: 'MongoDB', imagen: '/tecnologias/mongodb.png' },
  { nombre: 'Firebase', imagen: '/tecnologias/firebase.png' },
  { nombre: 'Prisma', imagen: '/tecnologias/prisma.png' },
  { nombre: 'GitHub', imagen: '/tecnologias/github.png' },
  { nombre: 'Vercel', imagen: '/tecnologias/vercel.png' },
]

export default function Tecnologias() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgFondoRef = useRef<HTMLImageElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [startY, setStartY] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setStartY(sectionRef.current?.offsetTop || 0)
        }
      },
      { threshold: 0.3 }
    )

    const section = sectionRef.current
    if (section) observer.observe(section)

    return () => {
      if (section) observer.unobserve(section)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const handleScroll = () => {
      const scroll = window.scrollY - startY

      if (imgRef.current && scroll >= 0) {
        const moveX = Math.min(Math.max(scroll * 0.5, -500), 500)
        imgRef.current.style.transform = `translateX(${moveX}px)`
        imgRef.current.style.transition = 'transform 0.2s ease-out'
      }

      if (imgFondoRef.current && scroll >= 0) {
        const moveX = Math.min(Math.max(scroll * -0.5, -500), 500)
        imgFondoRef.current.style.transform = `translateX(${moveX}px)`
        imgFondoRef.current.style.transition = 'transform 0.2s ease-out'
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible, startY])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen px-6 py-16 bg-fixed bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url('/fondo.png'), url('/fondo2.png')`,
      }}
    >
      <div className="absolute top-0 left-0 w-full h-50 bg-gradient-to-b from-gray-900 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />

      <div className="text-center max-w-4xl mx-auto z-10 mb-12">
        <h1 className={`text-white font-black text-3xl md:text-5xl lg:text-6xl ${isVisible ? 'animate__animated animate__fadeInDown' : ''}`}>
          Tecnologías
        </h1>
        <p className={`mt-4 text-gray-300 text-base md:text-lg ${isVisible ? 'animate__animated animate__fadeIn' : ''}`}>
          Estas son algunas de las tecnologías utilizadas en desarrollo web moderno: rendimiento, accesibilidad y diseño.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-4 md:px-10 z-10">
        {tecnologias.map((tech, i) => (
          <div
            key={i}
            className="w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center justify-center text-white text-sm hover:scale-105 transition"
          >
            <Image
              src={tech.imagen}
              alt={tech.nombre}
              width={48}
              height={48}
              className="mb-2 object-contain"
            />
            <span>{tech.nombre}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
