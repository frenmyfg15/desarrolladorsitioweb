'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import logo from '../../public/logo2.png'

export default function Head() {
  const [isOpen, setIsOpen] = useState(false);       // Intención de mostrar
const [shouldRender, setShouldRender] = useState(false); // Control de visibilidad real

useEffect(() => {
  if (isOpen) setShouldRender(true); // Montar antes de animar entrada
}, [isOpen]);



  return (
    <section className='fixed p-5 w-full top-0 z-40 bg-gray-900/80'>
      <div className='flex w-full justify-between items-center'>
        <div className='flex gap-2 items-center'><span className='font-black'><Image src={logo} alt='Logo de la página' className='w-[80px] rotate-90' /></span><span className='text-verde font-black text-shadow-2xs text-2xl'>DEVELOPER</span></div>
        <div className='gap-8 hidden md:flex'>
          <Link href={'/'}><span className='bg-white/20 px-4 py-2 rounded-2xl font-black shadow-d'>PROYECTOS</span></Link>
          <Link href={'/'}> <span className='bg-white/20 px-4 py-2 rounded-2xl font-black shadow-d'>TECNOLOGÍAS</span> </Link>
          <Link href={'/'}>
  <span className='bg-gradient-to-r from-[#22FF00] to-[#009966] px-4 py-2 rounded-2xl font-black text-white shadow-d'>
    CONTACTO
  </span>
</Link>

        </div>

        {/* Hamburger Button for Mobile */}
        <button
          className={`md:hidden mb-2 cursor-pointer hover:scale-110 z-50 ${isOpen ? 'text-black' : 'text-verde'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            ></path>
          </svg>
        </button>
      </div>

{shouldRender && (
  <div
    className={`
      h-screen w-[50%] bg-white/90 fixed top-0 right-0 z-40
      animate__animated animate__faster
      ${isOpen ? 'animate__slideInRight' : 'animate__slideOutRight'}
      flex
    `}
    onAnimationEnd={() => {
      if (!isOpen) setShouldRender(false); // Desmontar después de animar salida
    }}
  >
    {/* Tu contenido */}
  </div>
)}


    </section>
  )
}
