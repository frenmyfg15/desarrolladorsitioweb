'use client'

import React, { useEffect, useRef, useState } from 'react'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
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
      id="about"
      className="relative min-h-screen px-6 py-20 bg-fixed bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url('/fondo.png'), url('/fondo2.png')`,
      }}
    >

      <div className="absolute top-0 left-0 w-full h-50 bg-gradient-to-b from-gray-900 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        <div className={`space-y-6 ${isVisible ? 'animate__animated animate__fadeInLeft' : ''}`}>
          <h2 className="text-4xl md:text-2xl font-extrabold leading-tight text-white text-center">
            Transformo ideas en experiencias digitales
          </h2>
          <p className="text-gray-100 text-lg">
            Soy desarrollador web especializado en <strong>aplicaciones modernas, optimizadas y escalables</strong> para negocios, startups y marcas personales. Combino diseño funcional con tecnología de punta para crear productos centrados en el usuario.
          </p>
          <p className="text-gray-200 text-base">
            Trabajo con <strong>React, Next.js, TypeScript, Node.js</strong> y sistemas como <strong>MongoDB, MySQL y Firebase</strong>. Mis soluciones están pensadas para ser <strong>rápidas, seguras, accesibles y posicionarse bien en buscadores</strong>.
          </p>
          <p className="text-gray-300 text-sm">
            Cada línea de código que escribo está orientada a resolver problemas reales, impulsar marcas digitales y ofrecer un rendimiento sobresaliente.
          </p>
        </div>


        <div className={`relative w-full h-96 md:h-full ${isVisible ? 'animate__animated animate__fadeInRight' : ''}`}>
          <div className="absolute inset-0 bg-[#22FF00]/10 backdrop-blur-xl border border-[#22FF00]/30 rounded-3xl shadow-xl p-8 flex flex-col justify-center">
            <h3 className="text-white text-2xl font-semibold mb-2">+5 años de experiencia</h3>
            <p className="text-gray-100">
              Desarrollo web full stack, consultoría técnica y diseño UX/UI adaptado a resultados.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-200 list-disc list-inside">
              <li>Proyectos escalables y mantenibles</li>
              <li>SEO técnico y accesibilidad</li>
              <li>Deploy profesional en Vercel, AWS, etc.</li>
              <li>Metodologías ágiles y comunicación fluida</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
