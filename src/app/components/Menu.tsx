'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AppWindow, Wrench, Handshake, User, Send, Star, AlignCenter, X } from 'lucide-react'

export default function Menu() {
    const [open, setOpen] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (open) setShouldRender(true);
    }, [open]);


    return (
        <section className={`flex justify-between px-6 py-4 fixed top-0 w-full items-center z-40 ${open ? '' : 'backdrop-blur-2xl'}  bg-white/5`}>
            <Link href={'/'} className="flex items-center gap-3">
                <Image src="/logo.webp" width={50} height={50} alt="Logo de la página" />
                <span className="text-lg font-bold text-[#334155] tracking-tight">NovaForge</span>
            </Link>

            <nav className="gap-4 hidden md:flex">
                <Link href="/#nosotros">
                    <span className="p-2 rounded-xl text-sm font-medium text-[#334155] hover:bg-emerald-100 transition-colors">NOSOTROS</span>
                </Link>
                <Link href="/#servicios">
                    <span className="p-2 rounded-xl text-sm font-medium text-[#334155] hover:bg-emerald-100 transition-colors">SERVICIOS</span>
                </Link>
                <Link href="/#planes">
                    <span className="p-2 rounded-xl text-sm font-medium text-[#334155] hover:bg-emerald-100 transition-colors">PLANES</span>
                </Link>
                <Link href="/#enfoque">
                    <span className="p-2 rounded-xl text-sm font-medium text-[#334155] hover:bg-emerald-100 transition-colors">ENFOQUE</span>
                </Link>
                <Link href="/#testimonios">
                    <span className="p-2 rounded-xl text-sm font-medium text-[#334155] hover:bg-emerald-100 transition-colors">TESTIMONIOS</span>
                </Link>
                <Link href="/#contacto">
                    <span className="p-2 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md hover:scale-105 transition-transform">CONTACTAR</span>
                </Link>
            </nav>

            {/*Icono del menu en movil*/}
            <button className='z-50 cursor-pointer hover:scale-110 transition md:hidden' 
            onClick={() => setOpen(ref => !ref)}>
                <span>
                    {
                        open ?
                            <X />
                            :
                            <AlignCenter />
                    }
                </span>
            </button>

            {/*Navegador para movil*/}
            {shouldRender && (
            <div
                className={`
                    h-screen w-[50%] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-tl-2xl rounded-bl-2xl fixed top-0 right-0 z-40 shadow-d
                    animate__animated animate__faster
                    ${open ? 'animate__slideInRight' : 'animate__slideOutRight'}
                    flex flex-col pt-20 md:hidden
                `}
                onAnimationEnd={() => {
                    if (!open) setShouldRender(false);
                }}
            >
                <Link onClick={() => setOpen(ref => !ref)} href={'/#nosotros'} className='border-b-1 border-gray-200 py-3 ml-3 mr-3 hover:scale-105 hover:bg-white rounded-md transition'><span className='text-sm font-medium text-[#334155] flex gap-3 items-center'><User color='#009975' /> NOSOTROS</span></Link>
                <Link onClick={() => setOpen(ref => !ref)} href={'/#servicios'} className='border-b-1 border-gray-200 py-3 ml-3 mr-3 hover:scale-105 hover:bg-white rounded-md transition'><span className='text-sm font-medium text-[#334155] flex gap-3 items-center'><Wrench color='#009975' /> SERVICIOS</span></Link>
                <Link onClick={() => setOpen(ref => !ref)} href={'/#planes'} className='border-b-1 border-gray-200 py-3 ml-3 mr-3 hover:scale-105 hover:bg-white rounded-md transition'><span className='text-sm font-medium text-[#334155] flex gap-3 items-center'><Handshake color='#009975' /> PLANES</span></Link>
                <Link onClick={() => setOpen(ref => !ref)} href={'/#enfoque'} className='border-b-1 border-gray-200 py-3 ml-3 mr-3 hover:scale-105 hover:bg-white rounded-md transition'><span className='text-sm font-medium text-[#334155] flex gap-3 items-center'><AppWindow color='#009975' /> ENFOQUE</span></Link>
                <Link onClick={() => setOpen(ref => !ref)} href={'/#testimonios'} className='border-b-1 border-gray-200 py-3 ml-3 mr-3 hover:scale-105 hover:bg-white rounded-md transition'><span className='text-sm font-medium text-[#334155] flex gap-3 items-center'><Star color='#009975' /> TESTIMONIOS</span></Link>
                <Link onClick={() => setOpen(ref => !ref)} href={'/#contacto'} className='border-b-1 border-gray-200 py-3 ml-3 mr-3 hover:scale-105 hover:bg-white rounded-md transition'><span className='text-sm font-medium text-[#334155] flex gap-3 items-center'><Send color='#009975' /> CONTACTAR</span></Link>
            </div>)}
        </section>
    )
}
