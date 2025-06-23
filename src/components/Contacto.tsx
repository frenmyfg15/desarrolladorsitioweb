'use client'

import React, { useEffect, useRef, useState } from 'react'

export default function Contacto() {
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
      id="contacto"
      className="relative px-6 py-32 min-h-screen bg-gray-900 text-white"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        <div className={`space-y-6 ${isVisible ? 'animate__animated animate__fadeInLeft' : ''}`}>
          <h2 className="text-4xl md:text-2xl font-extrabold text-white text-center">
            ¿Trabajamos juntos?
          </h2>
          <p className="text-gray-100 text-lg">
            ¿Tienes una idea, proyecto o negocio digital? Estoy listo para ayudarte a desarrollarlo desde cero o mejorar lo que ya tienes.
          </p>
        </div>


        <div className={`relative w-full ${isVisible ? 'animate__animated animate__fadeInRight' : ''}`}>
          <form
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg p-8 space-y-6"
            method="POST"
            action="https://formspree.io/f/tu_id"
          >
            <div>
              <label htmlFor="nombre" className="block text-sm mb-1 text-gray-300">Nombre</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22FF00]"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-1 text-gray-300">Correo</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22FF00]"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm mb-1 text-gray-300">Mensaje</label>
              <textarea
                name="mensaje"
                id="mensaje"
                rows={5}
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22FF00]"
                placeholder="Cuéntame sobre tu proyecto..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#22FF00] text-black font-bold py-3 rounded-xl hover:bg-[#1ed300] transition"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
