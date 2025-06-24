'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, Variants } from 'framer-motion'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const contentParallaxY = useTransform(scrollYProgress, [0, 1], [-40, 40])

  const fadeLeft: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 50, damping: 14, delay: 0.2 },
    },
  }

  const fadeRight: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 50, damping: 14, delay: 0.3 },
    },
  }

  const fadeItem: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25 },
    },
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen px-6 py-20 bg-fixed bg-cover bg-center overflow-hidden flex flex-col justify-center"
      style={{
        backgroundImage: `url('/fondo.png'), url('/fondo2.png')`,
      }}
    >
      {/* Gradientes superiores e inferiores */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-0" />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        style={{ y: contentParallaxY }}
      >
        {/* Tarjeta 1: Presentación */}
        <motion.div
          variants={fadeLeft}
          className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            ¿Quién soy?
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Soy un <strong>desarrollador web full stack</strong> con enfoque en crear
            <strong> experiencias digitales modernas y funcionales</strong>. Me apasiona transformar ideas en soluciones web reales y efectivas.
          </p>
        </motion.div>

        {/* Tarjeta 2: Tecnologías */}
        <motion.div
          variants={fadeRight}
          className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Tecnologías que domino
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm md:text-base">
            {[
              'React, Next.js y TypeScript',
              'Node.js, Express y API REST',
              'MongoDB, MySQL y Firebase',
              'Diseño UX/UI y SEO técnico',
            ].map((tech, idx) => (
              <motion.li key={idx} variants={fadeItem}>
                {tech}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Tarjeta 3: Experiencia */}
        <motion.div
          variants={fadeLeft}
          className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Experiencia Profesional
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-2">
            Más de 5 años creando productos digitales, trabajando con startups, agencias y proyectos freelance.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm md:text-base">
            <li>Desarrollo full stack a medida</li>
            <li>Implementación CI/CD y despliegues en Vercel, AWS</li>
            <li>Metodologías ágiles (Scrum, Kanban)</li>
          </ul>
        </motion.div>

        {/* Tarjeta 4: Compromiso */}
        <motion.div
          variants={fadeRight}
          className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            ¿Qué ofrezco?
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Compromiso total con la calidad del código, escalabilidad del producto y una experiencia de usuario refinada desde el primer momento.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
