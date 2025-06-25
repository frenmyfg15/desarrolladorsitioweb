'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../../../public/logo.png'
import Link from 'next/link'

export default function CookiesBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted')
    if (!accepted) {
      setVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true')
    setVisible(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('cookiesAccepted', 'false')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="animate-fadeIn fixed bottom-4 left-4 right-4 z-50 max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl md:left-6 md:right-auto md:p-6 flex gap-4 items-start">
      <div className="relative h-10 w-10 shrink-0">
        <Image
          src={logo}
          alt="Logotipo"
          fill
          className="object-contain"
        />
      </div>

      <div className="flex-1 text-sm text-gray-700">
        <p className="mb-4">
          Usamos cookies para mejorar tu experiencia, ofrecer servicios personalizados y analizar el uso del sitio.{' '}
          <Link href="/cookies" className="text-emerald-600 underline hover:text-emerald-700 font-medium">
            Ver política de cookies
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={acceptCookies}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-all"
          >
            Aceptar
          </button>
          <button
            onClick={rejectCookies}
            className="rounded-full bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-all"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  )
}
