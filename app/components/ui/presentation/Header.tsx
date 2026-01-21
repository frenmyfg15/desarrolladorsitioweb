import logo from '@/app/assets/novaforge/logo.png'
import Image from 'next/image'
import { Code2, LayoutGrid, LogIn, Mail, MessageSquareQuote, ShieldCheck, Users, X } from "lucide-react";
import { useState } from 'react';


export default function Header() {

    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className='fixed top-0 left-0 w-full z-100'>
            <div className=' flex justify-between p-6 items-center'>
                <div className='flex gap-2 items-center z-100'>
                    <Image
                        src={logo}
                        alt='Company logo'
                        className='w-[50px]'
                    />
                    <h1 className='text-xl text-text-primary font-semibold'>
                        NovaForge
                    </h1>
                </div>

                {/* Vista ordenador */}
                <div className='hidden gap-6 items-center lg:flex'>
                    <nav className='flex gap-7 items-center p-3 bg-bg-secondary-20 rounded-[50px] backdrop-blur-lg border-2 border-white box-border'>
                        <a href="" className='text-text-secondary text-[16px] hover:scale-[0.7] transition-all duration-75'>SERVICIOS</a>
                        <a href="" className='text-text-secondary text-[16px] hover:scale-[0.7] transition-all duration-75'>DESARROLLO</a>
                        <a href="" className='text-text-secondary text-[16px] hover:scale-[0.7] transition-all duration-75'>SEGURIDAD</a>
                        <a href="" className='text-text-secondary text-[16px] hover:scale-[0.7] transition-all duration-75'>NOSOTROS</a>
                        <a href="" className='text-text-secondary text-[16px] hover:scale-[0.7] transition-all duration-75'>OPINIONES</a>
                    </nav>
                    <a href="" className=' bg-primary text-white font-semibold py-3 px-5 rounded-[50px]'>CONTACTAR</a>
                </div>

                {/* Vista tablet y móvil */}
                <div className='lg:hidden flex'>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="relative h-6 w-6 z-100"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 bg-primary
                                transition-transform duration-200
                                ${showMenu ? 'rotate-45' : '-translate-y-2'}`}
                        />
                        <span
                            className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 bg-secondary
                                transition-transform duration-200
                                ${showMenu ? '-rotate-45' : 'translate-y-2'}`}
                        />
                    </button>


                    <div
                        className={`
                            fixed top-0 left-0 h-full px-6 pr-10
                            bg-white/20 backdrop-blur-lg
                            border-2 border-white
                            flex flex-col justify-between
                            pb-6 pt-30
                            transform-gpu transition-transform duration-300 ease-out
                            ${showMenu ? "translate-x-0" : "translate-x-[-100%]"}
                            `}
                    >
                        <nav className='flex flex-col gap-10 text-text-secondary text-[16px] font-light'>
                            <a href="#servicios" className={`flex items-center gap-4 px-3 py-2 text-primary font-medium`}>
                                <LayoutGrid size={20} />
                                Servicios
                            </a>

                            <a href="#desarrollo" className="flex items-center gap-4 px-3 py-2 ">
                                <Code2 size={20} />
                                Desarrollo
                            </a>

                            <a href="#seguridad" className="flex items-center gap-4 px-3 py-2 ">
                                <ShieldCheck size={20} />
                                Seguridad
                            </a>

                            <a href="#nosotros" className="flex items-center gap-4 px-3 py-2 ">
                                <Users size={20} />
                                Nosotros
                            </a>

                            <a href="#opiniones" className="flex items-center gap-4 px-3 py-2 ">
                                <MessageSquareQuote size={20} />
                                Opiniones
                            </a>

                            <a href="#opiniones" className="flex items-center gap-4 px-3 py-2 ">
                                <Mail size={20} />
                                Contactar
                            </a>
                        </nav>

                        <a
                            href=""
                            className="
                                    flex items-center justify-center gap-3
                                    border-2 border-primary-50
                                    font-normal
                                    py-3 px-7
                                    rounded-[50px]
                                    text-primary
                                    transition-all duration-200
                                    hover:bg-primary hover:text-white
                                    "
                        >
                            <LogIn size={18} />
                            Iniciar Sesión
                        </a>


                    </div>
                </div>
            </div>
        </header>
    )
}
