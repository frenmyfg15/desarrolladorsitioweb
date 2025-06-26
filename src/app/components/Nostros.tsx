'use client'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const links = [
  { name: 'Sobre nosotros', href: '#' },
  { name: 'Equipo creativo', href: '#' },
  { name: 'Nuestra misión', href: '#' },
  { name: 'Contacto directo', href: '#' },
]
const stats = [
  { name: 'Proyectos completados', value: '120+' },
  { name: 'Clientes felices', value: '95%' },
  { name: 'Miembros en el equipo', value: '15' },
  { name: 'Años de experiencia', value: '6+' },
]

export default function Nosotros() {

  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="relative isolate overflow-hidden py-24 sm:py-32 shadow-md bg-white" ref={sectionRef}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl lg:mx-0"
          initial={{ opacity: 0, x: 250 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-5xl font-bold tracking-tight text-black sm:text-6xl">Nos apasiona crear soluciones digitales</h2>
          <p className="mt-8 text-lg text-gray-900 sm:text-xl">
            Somos una agencia enfocada en el desarrollo de sitios modernos, eficientes y personalizados. Ayudamos a marcas y startups a destacar en la era digital.
          </p>
        </motion.div>
        <motion.div
          className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none"
          initial={{ opacity: 0, x: -250 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold text-emerald-400 sm:grid-cols-2 md:flex lg:gap-x-10">
            {links.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-emerald-300 transition">
                {link.name} <span aria-hidden="true">&rarr;</span>
              </a>
            ))}
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse gap-1">
                <dt className="text-base text-gray-400">{stat.name}</dt>
                <dd className="text-4xl font-bold tracking-tight text-black">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  )
}
