'use client'

import { useState } from 'react'
import { Field, Label, Switch } from '@headlessui/react'
import { MessageCircle } from 'lucide-react'

export default function Contacto() {
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    const firstName = formData.get('first-name')
    const lastName = formData.get('last-name')
    const email = formData.get('email')
    const phone = formData.get('phone-number')
    const service = formData.get('service')
    const message = formData.get('message')

    const fullMessage = `Hola, me gustaría contratar el servicio de *${service}*.

Nombre: ${firstName} ${lastName}
Email: ${email}
Teléfono: ${phone}
Mensaje: ${message}`

    const whatsappURL = `https://wa.me/52XXXXXXXXXX?text=${encodeURIComponent(fullMessage)}`
    window.open(whatsappURL, '_blank')
  }

  return (
    <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          Contáctanos hoy
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Obtén un 15% de descuento si completas este formulario ahora mismo.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
              Nombre
            </label>
            <div className="mt-2.5">
              <input
                name="first-name"
                type="text"
                required
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-emerald-600"
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold text-gray-900">
              Apellido
            </label>
            <div className="mt-2.5">
              <input
                name="last-name"
                type="text"
                required
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-emerald-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="service" className="block text-sm font-semibold text-gray-900">
              Servicio
            </label>
            <div className="mt-2.5">
              <select
                name="service"
                required
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-900 focus:outline-emerald-600"
              >
                <option value="">Selecciona un servicio</option>
                <option value="Landing page">Landing page</option>
                <option value="Página corporativa">Página corporativa (+5 páginas)</option>
                <option value="Sistema con login">Sistema con login y panel</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <input
                name="email"
                type="email"
                required
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-900 focus:outline-emerald-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone-number" className="block text-sm font-semibold text-gray-900">
              Teléfono
            </label>
            <div className="mt-2.5">
              <input
                name="phone-number"
                type="tel"
                required
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-900 focus:outline-emerald-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
              Mensaje
            </label>
            <div className="mt-2.5">
              <textarea
                name="message"
                rows={4}
                placeholder="Cuéntanos lo que necesitas..."
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-gray-900 focus:outline-emerald-600"
              />
            </div>
          </div>
          <Field className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center">
              <Switch
                checked={agreed}
                onChange={setAgreed}
                className="group flex w-8 cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-300 transition-colors data-[checked=true]:bg-emerald-500"
              >
                <span className="sr-only">Aceptar política</span>
                <span
                  aria-hidden="true"
                  className="size-4 transform rounded-full bg-white shadow-sm transition group-data-[checked=true]:translate-x-3.5"
                />
              </Switch>
            </div>
            <Label className="text-sm text-gray-600">
              Acepto la{' '}
              <a href="#" className="font-semibold text-emerald-600 underline">
                política de privacidad
              </a>
              .
            </Label>
          </Field>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full rounded-md bg-emerald-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <MessageCircle className="size-4" />
            Contactar por WhatsApp
          </button>
        </div>
      </form>
    </div>
  )
}
