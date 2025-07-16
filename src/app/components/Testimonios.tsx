'use client'

import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// Función utilitaria para calcular "hace cuanto tiempo"
const timeAgo = (dateString: string): string => {
  const now = new Date();
  const pastDate = new Date(dateString);
  const diffTime = Math.abs(now.getTime() - pastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Diferencia en días

  if (diffDays === 0) {
    return 'Hoy';
  } else if (diffDays === 1) {
    return 'Ayer';
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30); // Aproximado
    return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `Hace ${years} año${years > 1 ? 's' : ''}`;
  }
}

const testimonials = [
  {
    name: 'Carlos Méndez',
    // Usamos el formato 'YYYY-MM-DD' para facilitar la creación de objetos Date
    date: '2025-07-09', // Hace aproximadamente 1 semana desde hoy (16/07/2025)
    rating: 5,
    content:
      'Excelente servicio. La landing quedó increíble y el tiempo de entrega fue más rápido de lo esperado. Muy recomendable.',
  },
  {
    name: 'Lucía Fernández',
    date: '2025-07-13', // Hace aproximadamente 3 días
    rating: 5,
    content:
      'Muy profesionales, entendieron justo lo que necesitábamos para nuestra página corporativa. Comunicación clara y efectiva.',
  },
  {
    name: 'Juan Ríos',
    date: '2025-07-02', // Hace aproximadamente 2 semanas
    rating: 4,
    content:
      'Buen trabajo y diseño moderno. Solo mejoraría un poco el tiempo de respuesta en soporte, pero en general excelente.',
  },
  {
    name: 'Sofía Giménez',
    date: '2025-05-20', // Ejemplo de un testimonio más antiguo
    rating: 5,
    content:
      'Diseño impecable y funcionalidad perfecta. Mi tienda online superó todas mis expectativas. ¡Grandes profesionales!',
  },
]

export default function Testimonios() {

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
    <section className=" py-24 sm:py-32 px-6 shadow-md" ref={sectionRef}>
      <div className="mx-auto max-w-7xl">
        <motion.h2
          className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
          initial={{ opacity: 0, x: 250 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Opiniones reales de nuestros clientes
        </motion.h2>
        <motion.div
          className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, x: -250 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold uppercase">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  {/* Aquí llamamos a la nueva función timeAgo */}
                  <p className="text-xs text-gray-500">{timeAgo(t.date)}</p>
                </div>
              </div>
              <div className="flex items-center mb-2">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
                {Array.from({ length: 5 - t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gray-300" />
                ))}
              </div>
              <p className="text-sm text-gray-700">{t.content}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}