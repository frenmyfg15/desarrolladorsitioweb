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
    <section className='fixed p-5 w-full top-0 z-40 bg-gray-900/20  h-15 items-center flex shadow-d'>
      <div className='flex w-full justify-between items-center'>
        <div className='flex gap-5 items-center'><span className='font-black'><Image src={logo} alt='Logo de la página' className='w-[30px] rotate-90' /></span><span className='text-verde font-black text-shadow-2xs text-2xl'>DEVELOPER</span></div>
        <div className='gap-8 hidden md:flex'>
          <Link href={'/'}><span className='bg-white/20 px-4 py-2 rounded-2xl font-black shadow-d'>PROYECTOS</span></Link>
          <Link href={'/'}>
            <span className='bg-gradient-to-r from-[#22FF00] to-[#009966] px-4 py-2 rounded-2xl font-black text-white shadow-d'>
              CONTACTO
            </span>
          </Link>

        </div>

        {/* Hamburger Button for Mobile */}
        <button
          className={`md:hidden mb-2 cursor-pointer hover:scale-110 z-50 ${isOpen ? 'text-white' : 'text-verde'}`}
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
      h-screen w-[50%] bg-white/5 backdrop-blur-md border border-white/10 rounded-tl-2xl rounded-bl-2xl fixed top-0 right-0 z-40
      animate__animated animate__faster
      ${isOpen ? 'animate__slideInRight' : 'animate__slideOutRight'}
      flex flex-col items-center pt-20
    `}
          onAnimationEnd={() => {
            if (!isOpen) setShouldRender(false);
          }}
        >
          <div className='border-b-2 w-[80%] h-10 items-center flex border-t-2 border-[#22FF00]'>
            <Link href="/#proyecto" className='text-shadow-2xs font-black' onClick={() => setIsOpen(!isOpen)}>PROYECTOS</Link>
          </div>

          <div className='border-b-2 w-[80%] h-10 items-center flex border-[#22FF00]'>

          <Link href="" className='text-shadow-2xs font-black' onClick={() => setIsOpen(!isOpen)}>CONTACTOS</Link>
          </div>
        </div>
      )}


    </section>
  )
}
