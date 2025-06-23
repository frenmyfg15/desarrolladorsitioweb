'use client'

import React, { useEffect, useRef, useState } from 'react'

const planes = [
  {
    nombre: 'Landing Page',
    precio: 'Desde $150',
    descripcion: 'Sitio web de una sola sección, ideal para presentar productos, portafolios o eventos.',
    beneficios: [
      'Diseño responsive',
      'Optimización SEO básica',
      'Tiempo de entrega rápido',
      'Integración con redes sociales'
    ],
  },
  {
    nombre: 'Sitio Corporativo',
    precio: 'Desde $400',
    descripcion: 'Web con múltiples secciones para empresas o negocios que requieren presencia online sólida.',
    beneficios: [
      'Diseño personalizado',
      'Múltiples páginas (Inicio, Servicios, Contacto...)',
      'SEO avanzado',
      'Formulario de contacto funcional'
    ],
  },
  {
    nombre: 'Web + Admin Panel',
    precio: 'Desde $800',
    descripcion: 'Sitio web con panel de administración para gestionar contenido dinámico sin código.',
    beneficios: [
      'Dashboard a medida',
      'Base de datos integrada',
      'Panel seguro y escalable',
      'Documentación técnica'
    ],
  },
]

export default function Servicios() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen px-6 py-20 bg-gray-900 overflow-hidden pt-10 pb-10"
    >

      <div className="text-center max-w-4xl mx-auto z-10 mb-12">
        <h2 className={`text-white font-black text-2xl md:text-5xl ${isVisible ? 'animate__animated animate__fadeInDown' : ''}`}>
          Servicios
        </h2>
        <p className={`mt-4 text-gray-300 text-base md:text-lg ${isVisible ? 'animate__animated animate__fadeIn' : ''}`}>
          Planes flexibles según tu proyecto, con enfoque en rendimiento, escalabilidad y posicionamiento SEO.
        </p>
      </div>


      <div className="flex flex-wrap justify-center gap-8 px-4 md:px-10 z-10">
        {planes.map((plan, i) => (
          <div
            key={i}
            className="w-full md:w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white hover:scale-105 transition shadow-xl"
          >
            <h3 className="text-xl font-bold mb-2">{plan.nombre}</h3>
            <p className="text-green-400 text-lg font-semibold mb-4">{plan.precio}</p>
            <p className="text-sm mb-4">{plan.descripcion}</p>
            <ul className="text-sm space-y-2">
              {plan.beneficios.map((b, j) => (
                <li key={j} className="before:content-['✔'] before:text-[#22FF00] before:mr-2">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
