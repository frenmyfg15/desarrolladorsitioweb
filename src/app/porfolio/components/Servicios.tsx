'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, Variants } from 'framer-motion'
import Link from 'next/link' // Importa el componente Link de Next.js

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
    ejemploLink: 'https://serviciodelimpiezahogarvaldemoro.es/',
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
    ejemploLink: 'https://serviciotecnicoreparaciodeelectrodomesticos.com.do/inicio/',
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
    ejemploLink: 'https://mosaic.cruip.com/',
  },
]


export default function Servicios() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const contentParallaxY = useTransform(scrollYProgress, [0, 1], [-50, 50])

  // --- Framer Motion Variants ---

  const containerVariants: Variants = {
    hidden: { opacity: 0, x: '50vw' },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 20,
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  }

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
        scale: 1.05,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    },
    tap: { scale: 0.95 },
  }

  const buttonVariants: Variants = {
    hover: { scale: 1.05, backgroundColor: '#22FF00' },
    tap: { scale: 0.95 },
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen px-6 py-20 bg-gray-900 overflow-hidden pt-10 pb-10 flex flex-col justify-center"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        style={{ y: contentParallaxY }}
        className="z-10"
      >
        <motion.div
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <motion.h2
            variants={textVariants}
            className="text-white font-black text-2xl md:text-5xl"
          >
            Servicios
          </motion.h2>
          <motion.p
            variants={textVariants}
            className="mt-4 text-gray-300 text-base md:text-lg"
          >
            Planes flexibles según tu proyecto, con enfoque en rendimiento, escalabilidad y posicionamiento SEO.
          </motion.p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 px-4 md:px-10 z-10">
          {planes.map((plan, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full md:w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">{plan.nombre}</h3>
                <p className="text-green-400 text-lg font-semibold mb-4">{plan.precio}</p>
                <p className="text-sm mb-4">{plan.descripcion}</p>
                <ul className="text-sm space-y-2 mb-6">
                  {plan.beneficios.map((b, j) => (
                    <li key={j} className="before:content-['✔'] before:text-[#22FF00] before:mr-2">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              {plan.ejemploLink && (
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="mt-auto"
                >
                  <Link
                    href={plan.ejemploLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gradient-to-r from-[#22FF00] to-[#009966] py-2 px-4 rounded-lg font-semibold hover:scale-110 transition"
                  >
                    Ver Ejemplo
                  </Link>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}