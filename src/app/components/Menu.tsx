'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { AppWindow, Handshake, User, Send, Star, AlignCenter, X } from 'lucide-react'

export default function Menu() {
    const [open, setOpen] = useState(false);
    console.log(open)
    return (
        <section className={`flex justify-between px-6 py-4 fixed w-full items-center z-50 ${open ? '':'backdrop-blur-2xl'}  bg-white/5`}>
            <Link href={'/'} className="flex items-center gap-3">
                <Image src="/logo.png" width={40} height={40} alt="Logo de la página" />
                <span className="text-lg font-bold text-[#334155] tracking-tight">NovaForge</span>
            </Link>

            <nav className="gap-4 hidden md:flex">
                <Link href="/#nosotros">
                    <span className="p-2 rounded-xl text-sm font-medium text-[#334155] hover:bg-emerald-100 transition-colors">NOSOTROS</span>
                </Link>
                <Link href="/#servicios">
                    <span className="p-2 rounded-xl text-sm font-medium text-[#334155] hover:bg-emerald-100 transition-colors">SERVICIOS</span>
                </Link>
                <Link href="/#enfoque">
                    <span className="p-2 rounded-xl text-sm font-medium text-[#334155] hover:bg-emerald-100 transition-colors">ENFOQUE</span>
                </Link>
                <Link href="/#testimonios">
                    <span className="p-2 rounded-xl text-sm font-medium text-[#334155] hover:bg-emerald-100 transition-colors">TESTIMONIOS</span>
                </Link>
                <Link href="/#contacto">
                    <span className="p-2 rounded-xl text-sm font-semibold bg-gradient-to-br from-emerald-400 to-emerald-300 text-gray-900 shadow-md hover:scale-105 transition-transform">CONTACTAR</span>
                </Link>
            </nav>

            {/*Icono del menu en movil*/}
            <button className='z-50 cursor-pointer hover:scale-110 transition md:hidden' onClick={() => setOpen(ref => !ref)}>
                <span>
                    {
                        open ?
                        <X/>
                        :
                        <AlignCenter />
                    }
                </span>
            </button>

            {/*Navegador para movil*/}
            <nav className={`w-1/2 h-screen flex-col fixed right-0 top-0 shadow-md bg-white/5 backdrop-blur-sm pt-15 ${open ? 'flex':'hidden'}`}>
                <Link onClick={() => setOpen(ref => !ref)} href={'/#nosotros'} className='border-b-1 border-gray-200 py-3 ml-3 mr-3 hover:scale-105 hover:bg-emerald-100 transition'><span className='text-sm font-medium text-[#334155] flex gap-3 items-center'><User color='#009975' /> NOSOTROS</span></Link>
                <Link onClick={() => setOpen(ref => !ref)} href={'/#servicios'} className='border-b-1 border-gray-200 py-3 ml-3 mr-3 hover:scale-105 hover:bg-emerald-100 transition'><span className='text-sm font-medium text-[#334155] flex gap-3 items-center'><Handshake color='#009975' /> SERVICIOS</span></Link>
                <Link onClick={() => setOpen(ref => !ref)} href={'/#enfoque'} className='border-b-1 border-gray-200 py-3 ml-3 mr-3 hover:scale-105 hover:bg-emerald-100 transition'><span className='text-sm font-medium text-[#334155] flex gap-3 items-center'><AppWindow color='#009975' /> ENFOQUE</span></Link>
                <Link onClick={() => setOpen(ref => !ref)} href={'/#testimonios'} className='border-b-1 border-gray-200 py-3 ml-3 mr-3 hover:scale-105 hover:bg-emerald-100 transition'><span className='text-sm font-medium text-[#334155] flex gap-3 items-center'><Star color='#009975' /> TESTIMONIOS</span></Link>
                <Link onClick={() => setOpen(ref => !ref)} href={'/#contacto'} className='border-b-1 border-gray-200 py-3 ml-3 mr-3 hover:scale-105 hover:bg-emerald-100 transition'><span className='text-sm font-medium text-[#334155] flex gap-3 items-center'><Send color='#009975' /> CONTACTAR</span></Link>
            </nav>
        </section>
    )
}
