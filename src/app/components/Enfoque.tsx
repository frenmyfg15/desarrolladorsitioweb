import { Cloud, LockIcon, ServerIcon } from 'lucide-react'

const features = [
  {
    name: 'Despliegue inmediato',
    description:
      'Publicamos tu sitio rápidamente, optimizado y listo para producir resultados desde el primer día.',
    icon: Cloud,
  },
  {
    name: 'Certificados SSL',
    description: 'Seguridad integrada con HTTPS y certificados actualizados para proteger tu sitio y tus usuarios.',
    icon: LockIcon,
  },
  {
    name: 'Copias automáticas',
    description: 'Realizamos respaldos periódicos de tus bases de datos y contenido para tu tranquilidad.',
    icon: ServerIcon,
  },
]

export default function Enfoque() {
  return (
    <div className="overflow-hidden bg-[#F0FDF4] py-24 sm:py-32 shadow-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
          {/* Texto */}
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Nuestro enfoque
              </h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Sitios web seguros, rápidos y escalables
              </p>
              <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                Diseñamos soluciones digitales con foco en rendimiento, experiencia de usuario y facilidad de gestión.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base text-gray-700 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 h-5 w-5 text-emerald-500"
                      />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Imagen */}
          <img
            alt="Product screenshot"
            src="/enfoque/fondo.png"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  )
}
