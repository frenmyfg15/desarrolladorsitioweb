'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {AppWindow, SquareMousePointer, Handshake, User, Send} from 'lucide-react'
import logo from '../../../../public/logo2.webp'

export default function Head() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);



  return (
    <section className='fixed p-5 w-full top-0 z-40 border border-white/10  h-15 items-center flex shadow-d'>
      <div className='flex w-full justify-between items-center'>
        <div className='flex gap-5 items-center'><span className='font-black'><Image src={logo} alt='Logo de la página' className='w-[30px] rotate-90' /></span><span className='text-verde font-black text-shadow-2xs text-2xl'>DEVELOPER</span></div>
        <div className='gap-4 hidden md:flex'>
          <Link href={'/porfolio/#proyecto'}><span className=' px-2 py-2 rounded-2xl text-shadow-md text-white'>PROYECTOS</span></Link>
          <Link href={'/porfolio/#tecnologias'}><span className=' px-2 py-2 rounded-2xl text-shadow-md text-white'>TECNOLOGÍAS</span></Link>
          <Link href={'/porfolio/#servicios'}><span className=' px-2 py-2 rounded-2xl text-shadow-md text-white'>SERVICIOS</span></Link>
          <Link href={'/porfolio/#acercade'}><span className=' px-2 py-2 rounded-2xl text-shadow-md text-white'>ACERCA DE</span></Link>
          <Link href={'/porfolio/#contacto'}>
            <span className='bg-gradient-to-r from-[#22FF00] to-[#009966] px-4 py-2 rounded-2xl text-white shadow-d'>
              CONTACTO
            </span>
          </Link>

        </div>


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
      h-screen w-[50%] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-tl-2xl rounded-bl-2xl fixed top-0 right-0 z-40 shadow-d
      animate__animated animate__faster
      ${isOpen ? 'animate__slideInRight' : 'animate__slideOutRight'}
      flex flex-col items-center pt-20 md:hidden
    `}
          onAnimationEnd={() => {
            if (!isOpen) setShouldRender(false);
          }}
        >
          <div className='border-b-1 w-[80%] h-10 items-center flex border-gray-300'>
            <Link href="/porfolio/#proyecto" className='text-sm font-medium flex gap-3 text-white' onClick={() => setIsOpen(!isOpen)}><AppWindow color='#22FF00'/> PROYECTOS</Link>
          </div>

          <div className='border-b-1 w-[80%] h-10 items-center flex border-gray-300'>
            <Link href="/porfolio/#tecnologias" className='text-sm font-medium flex gap-3 text-white' onClick={() => setIsOpen(!isOpen)}><SquareMousePointer color='#22FF00'/>TECNOLOGÍAS</Link>
          </div>

          <div className='border-b-1 w-[80%] h-10 items-center flex border-gray-300'>
            <Link href="/porfolio/#servicios" className='text-sm font-medium flex gap-3 text-white' onClick={() => setIsOpen(!isOpen)}><Handshake color='#22FF00'/>SERVICIOS</Link>
          </div>

          <div className='border-b-1 w-[80%] h-10 items-center flex border-gray-300'>
            <Link href="/porfolio/#acercade" className='text-sm font-medium flex gap-3 text-white' onClick={() => setIsOpen(!isOpen)}><User color='#22FF00'/>ABOUT</Link>
          </div>

          <div className='border-b-1 w-[80%] h-10 items-center flex border-gray-300 text-white'>

          <Link href="/porfolio/#contacto" className='text-sm font-medium flex gap-3 text-white' onClick={() => setIsOpen(!isOpen)}><Send color='#22FF00'/>CONTACTOS</Link>
          </div>
        </div>
      )}


    </section>
  )
}
