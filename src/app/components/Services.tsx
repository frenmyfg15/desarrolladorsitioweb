'use client'

import { CheckIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const tiers = [
  {
    name: 'Landing Page',
    id: 'tier-landing',
    href: '#contacto',
    priceMonthly: '99', // Solo el número, el símbolo se añade dinámicamente
    description: 'Una página moderna, rápida y optimizada para conversiones.',
    features: [
      'Diseño responsive',
      'Optimización SEO básica',
      'Animaciones suaves',
      'Formulario de contacto',
    ],
    featured: false,
  },
  {
    name: 'Corporativa',
    id: 'tier-corporativa',
    href: '#contacto',
    priceMonthly: '249',
    description: 'Sitio completo con +5 secciones para representar tu empresa.',
    features: [
      '5+ páginas internas',
      'Blog o noticias',
      'Formularios personalizados',
      'Animaciones y scroll interactivo',
      'Integraciones básicas (Mailchimp, WhatsApp)',
    ],
    featured: false,
  },
  {
    name: 'Avanzada',
    id: 'tier-avanzada',
    href: '#contacto',
    priceMonthly: '599',
    description: 'Aplicación web con panel, login y funcionalidades dinámicas.',
    features: [
      'Autenticación de usuarios',
      'Panel de administración',
      'Dashboard personalizado',
      'Base de datos integrada',
      'Rutas protegidas y roles',
    ],
    featured: true,
  },
]

function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}


export default function Services() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const [currencySymbol, setCurrencySymbol] = useState('$')
  const [currencyCode, setCurrencyCode] = useState('USD')

  useEffect(() => {
    // Determina la moneda basada en el dominio
    if (typeof window !== 'undefined' && window.location.hostname.endsWith('.es')) {
      setCurrencySymbol('€')
      setCurrencyCode('EUR')
    } else {
      setCurrencySymbol('$')
      setCurrencyCode('USD')
    }

    // Observador para las animaciones
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

  return (
    <div ref={sectionRef} className="relative isolate px-6 py-24 sm:py-32 lg:px-8 shadow-md bg-white">

      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-emerald-200 to-emerald-400 opacity-20"
        />
      </div>

      <motion.div
        className="mx-auto max-w-4xl text-center"
        initial={{ opacity: 0, x: 250 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-base font-semibold text-emerald-600">Servicios</h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Planes de desarrollo web
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-600">
          Elige el tipo de proyecto ideal según tus necesidades y escala de crecimiento.
        </p>
      </motion.div>

      <motion.div
        className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-10 lg:max-w-5xl lg:grid-cols-3 lg:gap-x-8"
        initial={{ opacity: 0, x: -250 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'bg-emerald-600 text-white shadow-md' : 'backdrop-blur-3xl bg-white/5 shadow-md',
              'rounded-3xl p-8 sm:p-10 ring-1 ring-white'
            )}
          >
            <h3 className="text-lg font-semibold">{tier.name}</h3>
            <p className="mt-4 flex items-baseline gap-x-1">
              <span className={classNames(tier.featured ? 'text-emerald-100' : 'text-gray-500', 'text-sm font-normal')}>
                desde
              </span>
              <span className={classNames(tier.featured ? 'text-white' : 'text-gray-900', 'text-4xl font-bold')}>
                {currencySymbol}{tier.priceMonthly}
              </span>
              <span className={classNames(tier.featured ? 'text-emerald-100' : 'text-gray-500')}>{currencyCode}</span>
            </p>
            <p className={classNames(tier.featured ? 'text-emerald-100' : 'text-gray-600', 'mt-4 text-sm')}>
              {tier.description}
            </p>
            <ul className={classNames(tier.featured ? 'text-emerald-50' : 'text-gray-600', 'mt-6 space-y-3 text-sm')}>
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-x-2">
                  <CheckIcon className={classNames(tier.featured ? 'text-white' : 'text-emerald-500', 'h-5 w-5')} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              className={classNames(
                tier.featured
                  ? 'bg-white text-emerald-700 hover:bg-gray-100'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
                'mt-8 inline-block w-full rounded-md px-4 py-2 text-center text-sm font-semibold transition-colors'
              )}
            >
              Empezar ahora
            </a>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
