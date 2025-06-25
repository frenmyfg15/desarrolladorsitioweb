import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Carlos Méndez',
    date: 'Hace 1 semana',
    rating: 5,
    content:
      'Excelente servicio. La landing quedó increíble y el tiempo de entrega fue más rápido de lo esperado. Muy recomendable.',
  },
  {
    name: 'Lucía Fernández',
    date: 'Hace 3 días',
    rating: 5,
    content:
      'Muy profesionales, entendieron justo lo que necesitábamos para nuestra página corporativa. Comunicación clara y efectiva.',
  },
  {
    name: 'Juan Ríos',
    date: 'Hace 2 semanas',
    rating: 4,
    content:
      'Buen trabajo y diseño moderno. Solo mejoraría un poco el tiempo de respuesta en soporte, pero en general excelente.',
  },
]

export default function Testimonios() {
  return (
    <section className="bg-[#F0FDF4] py-24 sm:py-32 px-6 shadow-md">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Opiniones reales de nuestros clientes
        </h2>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
                  <p className="text-xs text-gray-500">{t.date}</p>
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
        </div>
      </div>
    </section>
  )
}
