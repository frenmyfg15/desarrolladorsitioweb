import Image from 'next/image'
import React from 'react'

export default function Hero() {
  return (
    <section className="bg-[#F0FDF4] relative min-h-screen flex items-center justify-center px-6 py-20 overflow-x-hidden shadow-md">
      {/* SVG decorativo grande con gradiente */}
      <div className='w-full h-screen absolute bottom-0 left-0'>

        <Image src={'/hero/fondo.svg'} alt='fondo animado para el hero' fill className='object-cover'/>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center z-10">
        {/* Texto */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#334155] mb-4">
            Impulsa tu presencia digital
          </h1>
          <h2 className="text-lg md:text-xl text-[#475569] mb-8">
            Desarrollo web moderno, rápido y personalizado para empresas creativas.
          </h2>
          <button className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-300 text-gray-900 shadow-md hover:scale-105 transition-transform">
            Comienza ahora
          </button>
        </div>

        {/* Imagen */}
        <div className="flex justify-center">
          <Image
            src="/fondo.png"
            width={500}
            height={500}
            alt="Ilustración de tecnología"
            className="w-full h-auto max-w-md"
          />
        </div>
      </div>
    </section>
  )
}
