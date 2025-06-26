'use client'
import { motion } from 'framer-motion'
import { Cloud, LockIcon, ServerIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react';

const features = [
  {
    name: 'Despliegue inmediato',
    description:
      'Publicamos tu sitio rápidamente, optimizado y listo para producir resultados desde el primer día.',
    icon: Cloud,
  },
  {
    name: 'Certificados SSL',
    description: 'Seguridad integrada con HTTPS y certificados actualizados para proteger tu sitio y tus usuarios.',
    icon: LockIcon,
  },
  {
    name: 'Copias automáticas',
    description: 'Realizamos respaldos periódicos de tus bases de datos y contenido para tu tranquilidad.',
    icon: ServerIcon,
  },
]

export default function Enfoque() {

  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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
    <div className="overflow-hidden bg-white py-24 shadow-md" ref={sectionRef}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
          {/* Texto */}
          <motion.div
            className="lg:pt-4 lg:pr-8"
            initial={{ opacity: 0, x: -250 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="lg:max-w-lg">
              <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Nuestro enfoque
              </h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Sitios web seguros, rápidos y escalables
              </p>
              <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                Diseñamos soluciones digitales con foco en rendimiento, experiencia de usuario y facilidad de gestión.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base text-gray-700 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 h-5 w-5 text-emerald-500"
                      />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>

          {/* Imagen */}
          <motion.img
            initial={{ opacity: 0, x: 250 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            alt="Product screenshot"
            src="/enfoque/fondo.png"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  )
}
