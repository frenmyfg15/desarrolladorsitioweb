'use client'

import Link from 'next/link'

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer
            className="relative px-6 py-16 bg-fixed bg-cover bg-center overflow-hidden"
            style={{
                backgroundImage: `url('/fondo.png'), url('/fondo2.png')`,
            }}
        >


            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black via-transparent to-transparent pointer-events-none z-0" />

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                <div className="text-center md:text-left space-y-2">
                    <h3 className="text-xl font-bold text-white">Frenmy García</h3>
                    <p className="text-sm text-gray-200">
                        Desarrollo web moderno con foco en rendimiento, escalabilidad y SEO.
                    </p>
                </div>


                <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-100">
                    <Link href="/#about" className="hover:text-[#22FF00] transition">Sobre mí</Link>
                    <Link href="/#proyecto" className="hover:text-[#22FF00] transition">Proyectos</Link>
                    <Link href="/#servicios" className="hover:text-[#22FF00] transition">Servicios</Link>
                    <Link href="/#contacto" className="hover:text-[#22FF00] transition">Contacto</Link>
                </nav>
            </div>


            <div className="border-t border-white/10 my-6" />


            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
                <p>&copy; {year} Frenmy Gacría. Todos los derechos reservados.</p>


                <div className="mt-4 md:mt-0 flex gap-4">
                    <a href="https://www.linkedin.com/in/tuusuario" target="_blank" rel="noopener noreferrer" className="hover:text-[#22FF00] transition">
                        LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    )
}
