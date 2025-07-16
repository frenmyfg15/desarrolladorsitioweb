'use client'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'


const stats = [
  { name: 'Proyectos entregados', value: '50+' },
  { name: 'Clientes satisfechos', value: '100%' },
  { name: 'Años de trayectoria', value: '4' },
  { name: 'Soluciones a medida', value: 'Siempre' },
]

export default function Nosotros() {

  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsVisible(true) } else {
          setIsVisible(false)
        }
      },
      { threshold: 0.3 }
    )

    const current = sectionRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [])

  return (
    <div className="relative isolate overflow-hidden py-24 sm:py-32 shadow-md bg-white" ref={sectionRef}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl lg:mx-0"
          initial={{ opacity: 0, x: 250 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-5xl font-bold tracking-tight text-black sm:text-6xl">
            Impulsamos tu visión digital con experiencia.
          </h2>
          <p className="mt-8 text-lg text-gray-900 sm:text-xl">
            Somos un equipo apasionado, especializado en crear sitios web y aplicaciones a medida que no solo lucen increíbles, sino que también impulsan tus objetivos de negocio. Nos enfocamos en la excelencia técnica, incluyendo la optimización de la arquitectura web, la mejora de la velocidad de carga, la implementación de Schema Markup y auditorías de rastreo e indexación, garantizando la máxima visibilidad orgánica. Trabajamos de principio a fin para asegurar que tu presencia digital sea excepcional y rentable.
          </p>
        </motion.div>
        <motion.div
          className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none"
          initial={{ opacity: 0, x: -250 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Se eliminó la sección de enlaces */}
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse gap-1">
                <dt className="text-base text-gray-500">{stat.name}</dt>
                <dd className="text-4xl font-bold tracking-tight text-gray-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  )
}
