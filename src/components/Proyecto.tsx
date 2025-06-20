'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Github, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const proyectos = [
    {
        titulo: 'FrioExpert RD',
        descripcion: 'Sitio web profesional para una empresa de servicios técnicos en electrodomésticos, climatización y refrigeración industrial en toda República Dominicana.',
        imagen: '/proyecto/proyecto1.png',
        web: 'https://serviciotecnicoreparaciodeelectrodomesticos.com.do/'
    },
    {
        titulo: 'Bienes Raices',
        descripcion: 'Presencia online de empresa inmobiliaria con sistema de login, protección de APIs y token de seguridad.',
        imagen: '/proyecto/proyecto4.png',
        web: 'https://bienes-raices-rd-frontend-9gbu.vercel.app/'
    },
    {
        titulo: 'BrilloHogar',
        descripcion: 'Sitio web para una empresa en España de servicios de limpieza con sistema de citas y panel de control.',
        imagen: '/proyecto/proyecto2.png',
        web: 'https://serviciodelimpiezahogarvaldemoro.es/'
    },
    {
        titulo: 'OficiosYa',
        descripcion: 'Plataforma web responsive que conecta usuarios con profesionales de distintos oficios.',
        imagen: '/proyecto/proyecto3.png',
        web: 'https://cozy-otter-c9b41f.netlify.app'
    },
]

export default function Proyecto() {
    const sectionRef = useRef<HTMLElement>(null)
    const imgFondoRef = useRef<HTMLImageElement>(null)
    const imgRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [startY, setStartY] = useState(0)
    const [index, setIndex] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (sectionRef.current) {
                        setStartY(sectionRef.current.offsetTop)
                    }
                }
            },
            { threshold: 0.3 }
        )

        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current)
        }
    }, [])

    useEffect(() => {
        if (!isVisible) return

        const handleScroll = () => {
            const relativeScroll = window.scrollY - startY
            if (imgRef.current && relativeScroll >= 0) {
                const moveX = Math.min(Math.max(relativeScroll * 0.5, -500), 500)
                imgRef.current.style.transform = `translateX(${moveX}px)`
                imgRef.current.style.transition = 'transform 0.2s ease-out'
            }

            if (imgFondoRef.current && relativeScroll >= 0) {
                const moveX = Math.min(Math.max(relativeScroll * -0.5, -500), 500)
                imgFondoRef.current.style.transform = `translateX(${moveX}px)`
                imgFondoRef.current.style.transition = 'transform 0.2s ease-out'
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isVisible, startY])

    const handlePrev = () => {
        setIndex((prev) => (prev === 0 ? proyectos.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setIndex((prev) => (prev === proyectos.length - 1 ? 0 : prev + 1))
    }

    const proyecto = proyectos[index]

    return (
        <section
            ref={sectionRef}
            className="flex flex-col min-h-screen bg-gray-900 overflow-hidden px-6 md:px-20 pt-20 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: `url('/fondo.png'), url('/fondo2.png')`,
            }}
        >
            {/* Encabezado */}
            <div className="text-center max-w-3xl mx-auto">
                <h1
                    className={`font-black text-3xl md:text-5xl lg:text-6xl text-white ${isVisible ? 'animate__animated animate__backInLeft animate__faster' : ''
                        }`}
                >
                    PROYECTOS
                </h1>
                <p className={`mt-4 text-gray-300 text-base md:text-lg ${isOpen ? 'hidden' : 'block'} ${isVisible ? 'animate__animated animate__backInLeft animate__faster' : ''}`}>
                    Algunos de los trabajos más recientes en los que se ha participado, con enfoque en desarrollo web, apps móviles y
                    experiencias interactivas de alto rendimiento.
                </p>
            </div>

            {/* Contenido central */}
            <div className="flex-grow flex justify-center items-center w-full">
                <div className="relative flex flex-wrap justify-center items-center gap-8 md:gap-12 max-w-7xl w-full px-4">
                    {/* Imagen ilustrativa */}
                    <div
                        className={`relative w-[350px] h-[350px] sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] transition-opacity duration-300 ${isVisible ? 'animate__animated animate__fadeInLeft' : ''
                            } ${isOpen ? 'hidden' : 'block'}`}
                    >
                        <Image
                            ref={imgFondoRef}
                            src="/proyecto/dev.png"
                            alt="Ilustración del desarrollador presentando un proyecto"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Botón para ver proyectos */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='hover:scale-110 transition cursor-pointer'

                    >
                        <span className="bg-gradient-to-r from-[#22FF00] to-[#009966] px-8 py-3 rounded-2xl font-black text-white shadow-d transition">
                            {isOpen ? 'OCULTAR PROYECTOS' : 'VER PROYECTOS'}

                        </span>
                    </button>

                    {/* Tarjeta de proyecto */}
                    <div
                        ref={imgRef}

                    >
                        <div className={`transition-all duration-300 ease-in-out bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 w-full max-w-lg ${isVisible ? 'animate__animated animate__fadeInRight' : ''
                            } ${isOpen ? 'block' : 'hidden'} shadow-d`}>


                            {/* Título y descripción encima de la imagen */}
                            <div className="mb-4">
                                <h2 className="text-white font-bold text-base mb-2 md:text-2xl">{proyecto.titulo}</h2>
                                <p className="text-gray-300 text-sm md:text-base">{proyecto.descripcion}</p>
                            </div>

                            {/* Imagen del proyecto */}
                            <div className="relative w-full h-52 sm:h-60 md:h-64 overflow-hidden rounded-lg border border-white/10">
                                <Image
                                    src={proyecto.imagen}
                                    alt={`Vista previa de ${proyecto.titulo}`}
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>

                            {/* Flechas */}
                            <div className="flex justify-center items-center gap-10 mt-6">
                                <button
                                    onClick={handlePrev}
                                    className="p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-d cursor-pointer hover:scale-110 hover:bg-white/20 transition"
                                    aria-label="Proyecto anterior"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-d cursor-pointer hover:scale-110 hover:bg-white/20 transition"
                                    aria-label="Proyecto siguiente"
                                >
                                    <ChevronRight size={24} />
                                </button>
                                <Link
                                    href={proyecto.web!}
                                    className="p-2 bg-gradient-to-r from-[#22FF00] to-[#009966] backdrop-blur-md border border-white/10 rounded-full shadow-d cursor-pointer hover:scale-110 hover:bg-white/20 transition"
                                    aria-label="Proyecto siguiente"
                                >
                                    <ArrowUpRight size={24} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
