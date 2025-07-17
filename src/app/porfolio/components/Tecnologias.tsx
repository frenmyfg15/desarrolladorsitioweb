'use client'

import Image from 'next/image'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform, Variants } from 'framer-motion'

const tecnologias = [
  { nombre: 'React', imagen: '/tecnologias/react.webp' },
  { nombre: 'Next.js', imagen: '/tecnologias/nextjs.webp' },
  { nombre: 'Tailwind', imagen: '/tecnologias/tailwind.webp' },
  { nombre: 'Node.js', imagen: '/tecnologias/nodejs.webp' },
  { nombre: 'TypeScript', imagen: '/tecnologias/typescript.webp' },
  { nombre: 'MySQL', imagen: '/tecnologias/mysql.webp' },
  { nombre: 'MongoDB', imagen: '/tecnologias/mongodb.webp' },
  { nombre: 'Firebase', imagen: '/tecnologias/firebase.webp' },
  { nombre: 'Prisma', imagen: '/tecnologias/prisma.webp' },
  { nombre: 'GitHub', imagen: '/tecnologias/github.webp' },
  { nombre: 'Vercel', imagen: '/tecnologias/vercel.webp' },
]

export default function Tecnologias() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const contentParallaxY = useTransform(scrollYProgress, [0, 1], [-50, 50])

  // --- Variantes de Framer Motion ---

  // Variantes para el contenedor principal de todo el contenido (header + tarjetas)
  const containerVariants: Variants = {
    hidden: { opacity: 0, x: '50vw' }, // Ajustado para que inicie más cerca o dentro del viewport
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
    visible: { opacity: 1, scale: 1, y: 0 },
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

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen px-6 py-20 bg-fixed bg-cover bg-center overflow-hidden flex flex-col justify-center"
      style={{
        backgroundImage: `url('/fondoPorfolio.webp'), url('/fondo2.webp')`,
      }}
    >
      {/* Degradados para ocultar bordes */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-0" />
      

      {/* Contenedor principal que se anima desde la derecha */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }} // Reducido para que la animación se dispare antes
        variants={containerVariants}
        style={{ y: contentParallaxY }} // Se mantiene el parallax general
        className="z-10"
      >
        {/* Header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <motion.h1
            variants={textVariants}
            className="text-white font-black text-3xl md:text-5xl lg:text-6xl"
          >
            Tecnologías
          </motion.h1>
          <motion.p
            variants={textVariants}
            className="mt-4 text-gray-300 text-base md:text-lg"
          >
            Estas son algunas de las tecnologías utilizadas en desarrollo web moderno: rendimiento, accesibilidad y diseño.
          </motion.p>
        </motion.div>

        {/* Contenedor de las tarjetas */}
        <div className="flex flex-wrap justify-center gap-6 px-4 md:px-10 z-10 items-center">
          {tecnologias.map((tech, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center justify-center text-white text-sm"
            >
              <Image
                src={tech.imagen}
                alt={tech.nombre}
                width={48}
                height={48}
                className="mb-2 object-contain"
              />
              <span>{tech.nombre}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}