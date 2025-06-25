'use client'

import React from 'react'
import Footer from '../components/Footer'
import Menu from '../components/Menu'

export default function PoliticaPrivacidad() {
  return (
    <>
      <Menu />
      <main className="relative isolate mx-auto max-w-5xl px-6 py-12 text-gray-800 h-screen">
        <div className="rounded-3xl border border-white/20 bg-white/60 backdrop-blur-md shadow-xl p-8 md:p-12 space-y-8 transition-all duration-500">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Política de Privacidad</h1>

          <section className="space-y-6 text-sm md:text-base leading-relaxed text-gray-700">
            <p>
              En <strong>Brillo Hogar</strong>, nos comprometemos a proteger tu privacidad y garantizar que tus datos personales sean tratados de forma segura, confidencial y conforme al RGPD.
            </p>

            <div>
              <h2 className="text-xl font-semibold text-emerald-600">1. Responsable del tratamiento</h2>
              <p>
                <strong>Nombre comercial:</strong> Brillo Hogar<br />
                <strong>Teléfono:</strong> 617 547 481<br />
                <strong>Correo electrónico:</strong> info@brillohogar.com<br />
                <strong>Dirección:</strong> Valdemoro, Madrid, España
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-600">2. Finalidad del tratamiento</h2>
              <p>
                Usamos tus datos para responder a solicitudes, gestionar presupuestos y prestar nuestros servicios. No compartimos tu información sin tu consentimiento.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-600">3. Derechos del usuario</h2>
              <p>
                Puedes ejercer tus derechos (acceso, rectificación, cancelación, oposición, etc.) escribiendo a nuestro email o contactando por teléfono.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-600">4. Conservación de los datos</h2>
              <p>
                Solo almacenamos tu información durante el tiempo necesario para cumplir con su finalidad o con obligaciones legales.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-600">5. Seguridad de los datos</h2>
              <p>
                Aplicamos medidas de seguridad técnicas y organizativas para proteger tu información.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-600">6. Cambios en esta política</h2>
              <p>
                Esta política puede cambiar. Te recomendamos revisarla periódicamente para estar informado.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>

  )
}
