import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Hero() {
  return (
    <section className='pt-40 flex items-center justify-center px-10 flex-wrap gap-20'>
      <div className='flex flex-col justify-between gap-y-10 w-full max-w-[30rem] md:max-w-[40rem] lg:max-w-[48rem]'>
        <h1 className='font-black text-3xl md:text-5xl lg:text-6xl text-center animate__animated animate__backInLeft animate__faster text-shadow-2xs'>
          DESARROLLADOR FULL STACK
        </h1>

        <p className='font-bold text-base md:text-lg lg:text-xl text-center animate__animated animate__backInLeft animate__fast'>
          Experiencia en construcción de interfaces modernas, APIs eficientes y soluciones multiplataformas
        </p>

        <p className='hidden md:block text-base text-center animate__animated animate__backInLeft animate__fast'>
          También experiencia trabajando en equipos ágiles y manteniendo buenas prácticas de desarrollo.
        </p>

        <div className='flex gap-5 md:gap-8 justify-center animate__animated animate__backInLeft'>
          <Link href={''} className='hover:scale-110 transition'>
            <span className='bg-white/20 px-10 py-2 md:px-12 md:py-3 rounded-2xl font-black shadow-d'>GITHUB</span>
          </Link>
          <Link href={''} className='hover:scale-110 transition'>
            <span className='bg-gradient-to-r from-[#22FF00] to-[#009966] px-10 py-2 md:px-12 md:py-3 rounded-2xl font-black text-white shadow-d'>LINKEDIN</span>
          </Link>
        </div>
      </div>
      {/* Imágenes 3D animadas */}
      <div>
        <div className='animate__animated animate__backInRight animate__faster'>
          <Image src="/movil.png" alt="React" width={300} height={300} className='ml-0 animate__animated animate__pulse animate__infinite' />
        </div>
      </div>
    </section>
  )
}
