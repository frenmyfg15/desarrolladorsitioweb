'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const proyectos = [
  {
    titulo: 'Servicio Tecnico RD',
    descripcion: 'Sitio web profesional para una empresa de servicios técnicos en electrodomésticos, climatización y refrigeración industrial en toda República Dominicana.',
    imagen: '/proyecto/proyecto1.png',
    web: 'https://serviciotecnicoreparaciodeelectrodomesticos.com.do/',
  },
  {
    titulo: 'Bienes Raices',
    descripcion: 'Presencia online de empresa inmobiliaria con sistema de login, protección de APIs y token de seguridad.',
    imagen: '/proyecto/proyecto4.png',
    web: 'https://bienes-raices-rd-frontend-9gbu.vercel.app/',
  },
  {
    titulo: 'BrilloHogar',
    descripcion: 'Sitio web para una empresa en España de servicios de limpieza con sistema de citas y panel de control.',
    imagen: '/proyecto/proyecto2.png',
    web: 'https://serviciodelimpiezahogarvaldemoro.es/',
  },
  {
    titulo: 'OficiosYa',
    descripcion: 'Plataforma web responsive que conecta usuarios con profesionales de distintos oficios.',
    imagen: '/proyecto/proyecto3.png',
    web: 'https://cozy-otter-c9b41f.netlify.app',
  },
]

export default function Proyecto() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgFondoContainer = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  const [isVisible, setIsVisible] = useState(false)
  const [startY, setStartY] = useState(0)
  const [index, setIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const proyecto = proyectos[index]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (sectionRef.current) setStartY(sectionRef.current.offsetTop)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
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

      if (imgFondoContainer.current && scroll >= 0) {
        const moveX = Math.min(Math.max(scroll * -0.5, -500), 500)
        imgFondoContainer.current.style.transform = `translateX(${moveX}px)`
        imgFondoContainer.current.style.transition = 'transform 0.2s ease-out'
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible, startY])

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? proyectos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setIndex((prev) => (prev === proyectos.length - 1 ? 0 : prev + 1))
  }

  return (
    <section
      ref={sectionRef}
      className="flex flex-col min-h-screen bg-gray-900 overflow-hidden px-6 md:px-20 pt-20 bg-cover bg-center bg-no-repeat bg-fixed"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className={`font-black text-3xl md:text-5xl lg:text-6xl text-white ${isVisible ? 'animate__animated animate__fadeInUp' : ''}`}>
          PROYECTOS
        </h1>
        <p className={`mt-4 text-gray-300 text-base md:text-lg ${isVisible ? 'animate__animated animate__fadeInUp' : ''}`}>
          Algunos trabajos recientes enfocados en desarrollo web, aplicaciones y experiencias digitales modernas.
        </p>
      </div>

      {/* Contenido */}
      <div className="flex-grow flex justify-center items-center w-full">
        <div className="relative flex flex-wrap justify-center items-center gap-8 max-w-7xl w-full px-4">
          {/* Imagen lateral */}
          <div
            ref={imgFondoContainer}
            className={`relative w-[350px] h-[350px] sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] transition-opacity duration-300 ${
              isVisible ? 'animate__animated animate__fadeInLeft' : ''
            } ${isOpen ? 'hidden' : 'block'}`}
          >
            <Image
              src="/proyecto/dev.png"
              alt="Ilustración de desarrollador"
              fill
              className="object-contain"
            />
          </div>

          {/* Botón */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hover:scale-110 transition cursor-pointer"
          >
            <span className="bg-gradient-to-r from-[#22FF00] to-[#009966] px-8 py-3 rounded-2xl font-black text-white shadow-md">
              {isOpen ? 'OCULTAR PROYECTOS' : 'VER PROYECTOS'}
            </span>
          </button>

          {/* Contenido del proyecto */}
          <div ref={imgRef} className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-md"
                >
                  <div className="mb-4">
                    <h2 className="text-white font-bold text-base mb-2 md:text-2xl">{proyecto.titulo}</h2>
                    <p className="text-gray-300 text-sm md:text-base">{proyecto.descripcion}</p>
                  </div>

                  <div className="relative w-full h-52 sm:h-60 md:h-64 overflow-hidden rounded-lg border border-white/10 mb-4">
                    <Image
                      src={proyecto.imagen}
                      alt={`Vista previa de ${proyecto.titulo}`}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="flex justify-center items-center gap-10">
                    <button
                      onClick={handlePrev}
                      className="p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-sm hover:scale-110 hover:bg-white/20 transition"
                      aria-label="Anterior"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-sm hover:scale-110 hover:bg-white/20 transition"
                      aria-label="Siguiente"
                    >
                      <ChevronRight size={24} />
                    </button>
                    <Link
                      href={proyecto.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Visitar ${proyecto.titulo}`}
                      aria-label={`Ir al sitio de ${proyecto.titulo}`}
                      className="p-2 bg-gradient-to-r from-[#22FF00] to-[#009966] rounded-full shadow-sm hover:scale-110 transition"
                    >
                      <ArrowUpRight size={24} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
