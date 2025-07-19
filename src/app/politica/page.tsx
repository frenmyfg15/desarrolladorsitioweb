'use client'

import React from 'react'
import Menu from '../components/Menu'
import Footer from '../components/Footer'


export default function PoliticaEmpresa() {
  return (
    <>
      <Menu />

      <main className="relative isolate mx-auto max-w-5xl px-6 py-12 text-gray-800">
        <div className="rounded-3xl border border-white/20 bg-white/60 backdrop-blur-md shadow-xl p-8 md:p-12 space-y-8 transition-all duration-500">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Política de la Empresa</h1>

          <section className="space-y-6 text-sm md:text-base leading-relaxed text-gray-700">
            <p>
              En <strong>NovaForge</strong>, nos regimos por principios de calidad, integridad y responsabilidad. Nuestra política empresarial está diseñada para garantizar servicios eficientes, seguros y confiables.
            </p>

            <div>
              <h2 className="text-xl font-semibold text-emerald-600">Compromiso con la calidad</h2>
              <p>
                Nuestros servicios siguen altos estándares de limpieza profesional, con productos ecológicos y técnicas eficaces.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-600">Atención al cliente</h2>
              <p>
                Escuchamos tus necesidades y adaptamos nuestros servicios para brindar soluciones reales y efectivas.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-600">Seguridad y confianza</h2>
              <p>
                Contamos con un equipo confiable, seleccionado cuidadosamente, que opera en un ambiente ético y seguro.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-600">Sostenibilidad</h2>
              <p>
                Usamos productos biodegradables y trabajamos con procesos que reducen nuestro impacto ambiental.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-600">Actualización constante</h2>
              <p>
                Mejoramos continuamente nuestras políticas y métodos para estar siempre un paso adelante.
              </p>
            </div>

            <p>
              ¿Tienes preguntas o comentarios? Escríbenos a: <strong>novaforgeoficial@gmail.com</strong>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>

  )
}
