'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

type ContactoProps = {
  modo?: 'oscuro' | 'blanco'
}

export default function Contacto({ modo = 'oscuro' }: ContactoProps) {
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

  const isWhite = modo === 'blanco'
  const bgColor = isWhite ? 'bg-white' : 'bg-gray-900'
  const textColor = isWhite ? 'text-gray-800' : 'text-white'
  const labelColor = isWhite ? 'text-gray-700' : 'text-gray-300'
  const inputTextColor = isWhite ? 'text-gray-900' : 'text-white'
  const inputBg = isWhite ? 'bg-white border-gray-300' : 'bg-black/20 border-white/10'
  const placeholderColor = isWhite ? 'placeholder-gray-400' : 'placeholder-gray-500'

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className={`relative px-6 py-32 min-h-screen ${bgColor} ${textColor} flex flex-col justify-center`}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className={`space-y-6 ${isVisible ? 'animate__animated animate__fadeInLeft' : ''}`}>
          <h2 className={`text-4xl md:text-2xl font-extrabold text-center`}>
            ¿Trabajamos juntos?
          </h2>
          <p className={`text-lg ${isWhite ? 'text-gray-600' : 'text-gray-100'}`}>
            ¿Tienes una idea, proyecto o negocio digital? Estoy listo para ayudarte a desarrollarlo desde cero o mejorar lo que ya tienes.
          </p>
        </div>

        <div className={`relative w-full ${isVisible ? 'animate__animated animate__fadeInRight' : ''}`}>
          <form
            onSubmit={handleSubmit}
            className={`rounded-3xl shadow-lg p-8 space-y-6 backdrop-blur-xl ${isWhite ? 'bg-white border border-gray-200' : 'bg-white/5 border border-white/10'}`}
          >
            {[
              { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Tu nombre completo' },
              { name: 'email', label: 'Correo', type: 'email', placeholder: 'correo@ejemplo.com' },
              { name: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '+54 9 11 2345 6789' },
              { name: 'presupuesto', label: 'Presupuesto estimado (USD)', type: 'text', placeholder: 'Ej. 1000 - 3000' },
            ].map(field => (
              <div key={field.name}>
                <label htmlFor={field.name} className={`block text-sm mb-1 ${labelColor}`}>{field.label}</label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.name !== 'telefono'}
                  onChange={handleChange}
                  className={`w-full ${inputBg} rounded-xl px-4 py-3 ${inputTextColor} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-[#22FF00]`}
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <div>
              <label htmlFor="motivo" className={`block text-sm mb-1 ${labelColor}`}>Motivo de contacto</label>
              <select
                name="motivo"
                id="motivo"
                required
                onChange={handleChange}
                className={`w-full ${inputBg} rounded-xl px-4 py-3 ${inputTextColor} focus:outline-none focus:ring-2 focus:ring-[#22FF00]`}
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
              <label htmlFor="mensaje" className={`block text-sm mb-1 ${labelColor}`}>Mensaje</label>
              <textarea
                name="mensaje"
                id="mensaje"
                rows={5}
                required
                onChange={handleChange}
                className={`w-full ${inputBg} rounded-xl px-4 py-3 ${inputTextColor} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-[#22FF00]`}
                placeholder="Cuéntame sobre tu proyecto..."
              />
            </div>

            <button
              type="submit"
              className={`${isWhite ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white' : 'bg-gradient-to-r from-[#22FF00] to-[#009966] text-black '} w-full  
              font-bold py-3 rounded-xl transition flex justify-center 
              items-center gap-3 cursor-pointer hover:scale-110`}
            >
              <FaWhatsapp size={24} />
              Contactar por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
