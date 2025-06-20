import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

export default function Hero() {

  const imgRef = useRef<HTMLImageElement>(null);
  const prevScroll = useRef(0);
  const imgFondoRef = useRef<HTMLImageElement>(null);


  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      prevScroll.current = currentScroll;

      if (imgRef.current) {
        const moveX = Math.min(Math.max(currentScroll * 0.5, -500), 500); // límite de -500 a 500px
        imgRef.current.style.transform = `translateX(${moveX}px)`;
        imgRef.current.style.transition = 'transform 0.2s ease-out';
      }
      if (imgFondoRef.current) {
        const moveX = Math.min(Math.max(currentScroll * -0.5, -500), 500); // hacia la izquierda
        imgFondoRef.current.style.transform = `translateX(${moveX}px)`;
        imgFondoRef.current.style.transition = 'transform 0.2s ease-out';
      }

    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      className="flex items-center justify-center h-screen px-10 py-10 flex-wrap gap-x-20 bg-transparent relative overflow-hidden pt-10 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url('/fondo.png'), url('/fondo2.png')`
      }}
    >

      {/* Texto principal */}
      <div className="flex flex-col justify-between gap-y-10 w-full max-w-[30rem] md:max-w-[40rem] lg:max-w-[48rem] z-10 md:pt-10">
        <h1 className="font-black text-3xl md:text-5xl lg:text-6xl text-center animate__animated animate__backInLeft animate__faster text-shadow-2xs">
          DESARROLLADOR FULL STACK
        </h1>

        <p className="font-bold text-base md:text-lg lg:text-xl text-center animate__animated animate__backInLeft animate__fast">
          Experiencia en construcción de interfaces modernas, APIs eficientes y soluciones multiplataformas
        </p>

        <p className="hidden lg:block text-base text-center animate__animated animate__backInLeft animate__fast">
          También experiencia trabajando en equipos ágiles y manteniendo buenas prácticas de desarrollo.
        </p>

        <div className="flex gap-5 md:gap-8 justify-center animate__animated animate__backInLeft">
          <Link href="">
            <span className="bg-white/20 px-10 py-2 md:px-12 md:py-3 rounded-2xl font-black shadow-d hover:scale-110 transition">
              GITHUB
            </span>
          </Link>
          <Link href="">
            <span className="bg-gradient-to-r from-[#22FF00] to-[#009966] px-10 py-2 md:px-12 md:py-3 rounded-2xl font-black text-white shadow-d hover:scale-110 transition">
              LINKEDIN
            </span>
          </Link>
        </div>
      </div>

      <div className="w-[250%] h-screen absolute bottom-0 animate__animated animate__fadeInUp">
        <Image ref={imgFondoRef} src="/montañas.png" alt="Fondo" fill className="object-cover" />
        {/* Capa de desvanecido */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-900 via-white/0 to-transparent pointer-events-none" />
      </div>

      <div className='w-[300px] h-[300px]'>
        <div className="animate__animated animate__fadeInRight absolute bottom-0">
          <img
            ref={imgRef}
            src="/dev.png"
            alt="Imagen flotante"
            width={500} height={500}
          />
        </div>
      </div>


    </section>
  )
}
