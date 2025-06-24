'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export default function Contacto() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    motivo: '',
    presupuesto: '',
    mensaje: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const numeroWhatsApp = '+34604894472'
    const mensaje = 
      `Hola, soy *${formData.nombre}*.\n\n` +
      `Correo: ${formData.email}\n` +
      `Teléfono: ${formData.telefono}\n` +
      `Motivo de contacto: ${formData.motivo}\n` +
      `Presupuesto estimado: ${formData.presupuesto}\n` +
      `Mensaje:\n${formData.mensaje}`

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

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
      className="relative px-6 py-32 min-h-screen bg-gray-900 text-white flex flex-col justify-center"
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
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg p-8 space-y-6"
          >
            <div>
              <label htmlFor="nombre" className="block text-sm mb-1 text-gray-300">Nombre</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                required
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22FF00]"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm mb-1 text-gray-300">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                id="telefono"
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22FF00]"
                placeholder="+54 9 11 2345 6789"
              />
            </div>

            <div>
              <label htmlFor="motivo" className="block text-sm mb-1 text-gray-300">Motivo de contacto</label>
              <select
                name="motivo"
                id="motivo"
                required
                onChange={handleChange}
                className="w-full bg-black border border-white rounded-xl px-4 py-3 text-white  focus:outline-none focus:ring-2 focus:ring-[#22FF00]"
              >
                <option value="">Selecciona una opción</option>
                <option value="Reclutador de talentos">Reclutador de talentos</option>
                <option value="Landing Page">Landing Page</option>
                <option value="Sitio corporativo">Sitio corporativo</option>
                <option value="Web + Admin Panel">Web + Admin Panel</option>
                <option value="Otras ideas">Otras ideas</option>
              </select>
            </div>

            <div>
              <label htmlFor="presupuesto" className="block text-sm mb-1 text-gray-300">Presupuesto estimado (USD)</label>
              <input
                type="text"
                name="presupuesto"
                id="presupuesto"
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22FF00]"
                placeholder="Ej. 1000 - 3000"
              />
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm mb-1 text-gray-300">Mensaje</label>
              <textarea
                name="mensaje"
                id="mensaje"
                rows={5}
                required
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22FF00]"
                placeholder="Cuéntame sobre tu proyecto..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#22FF00] to-[#009966] text-black font-bold py-3 rounded-xl hover:bg-[#1ed300] transition flex justify-center items-center gap-3 cursor-pointer hover:scale-110"
            >
              <FaWhatsapp size={30}/>
              WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
