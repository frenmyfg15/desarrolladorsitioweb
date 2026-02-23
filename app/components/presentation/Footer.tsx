'use client';

import React from 'react';
import { Mail, MessageCircle, Github, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer
            className="
                relative z-[999]
                overflow-x-hidden
                px-20 pt-16 pb-10
                max-[1100px]:px-10
                max-[900px]:px-6
            "
            style={{ backgroundColor: '#36DBBA' }}
        >
            {/* Top */}
            <div className="grid grid-cols-12 gap-10">

                {/* Navigation */}
                <div className="col-span-4 max-[1000px]:col-span-6 max-[520px]:col-span-12 flex flex-col gap-3 min-w-0">
                    <p className="font-bold text-white">Navegación</p>
                    <ul className="flex flex-col gap-2 text-white/70 min-w-0 text-sm">
                        <li><a href="#top" className="hover:text-white transition-colors">Inicio</a></li>
                        <li><a href="#reviews" className="hover:text-white transition-colors">Reseñas</a></li>
                        <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
                        <li><a href="#desarrollo" className="hover:text-white transition-colors">Desarrollo</a></li>
                        <li><a href="#seguridad" className="hover:text-white transition-colors">Seguridad</a></li>
                        <li><a href="#nosotros" className="hover:text-white transition-colors">Nosotros</a></li>
                        <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                        <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
                    </ul>
                </div>

                {/* Services */}
                <div className="col-span-4 max-[1000px]:col-span-6 max-[520px]:col-span-12 flex flex-col gap-3 min-w-0">
                    <p className="font-bold text-white">Servicios</p>
                    <ul className="flex flex-col gap-2 text-white/70 min-w-0 text-sm">
                        <li><a href="#servicios" className="hover:text-white transition-colors">Landing pages</a></li>
                        <li><a href="#servicios" className="hover:text-white transition-colors">Webs corporativas</a></li>
                        <li><a href="#servicios" className="hover:text-white transition-colors">Dashboards</a></li>
                        <li><a href="#servicios" className="hover:text-white transition-colors">Apps web y mobile</a></li>
                        <li><a href="#servicios" className="hover:text-white transition-colors">E-commerce</a></li>
                        <li><a href="#servicios" className="hover:text-white transition-colors">UI / UX</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="col-span-4 max-[1000px]:col-span-12 flex flex-col gap-3 min-w-0">
                    <p className="font-bold text-white">Contacto</p>

                    <div className="flex flex-col gap-2 text-white/70 min-w-0">
                        <a href="mailto:contacto@novaforge.dev" className="flex items-center gap-2 min-w-0 hover:text-white transition-colors">
                            <Mail className="w-4 h-4 text-white shrink-0" />
                            <span className="text-sm min-w-0 truncate">contacto@novaforge.dev</span>
                        </a>
                        <a href="#contacto" className="flex items-center gap-2 min-w-0 hover:text-white transition-colors">
                            <MessageCircle className="w-4 h-4 text-white shrink-0" />
                            <span className="text-sm min-w-0 truncate">WhatsApp directo</span>
                        </a>
                    </div>

                    <div className="flex items-center gap-3 mt-2 max-[520px]:justify-center">
                        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                            className="p-3 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 transition-colors">
                            <Github className="w-4 h-4 text-white" />
                        </a>
                        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                            className="p-3 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 transition-colors">
                            <Linkedin className="w-4 h-4 text-white" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="mt-14 border-t border-white/25" />

            {/* Bottom */}
            <div className="mt-6 flex items-center justify-between gap-4 flex-wrap max-[520px]:justify-center max-[520px]:text-center">
                <p className="text-xs text-white/60">
                    © {new Date().getFullYear()} NovaForge. Todos los derechos reservados.
                </p>
                <div className="flex items-center gap-4 text-xs text-white/60 flex-wrap justify-center">
                    <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                    <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    <a href="#" className="hover:text-white transition-colors">Términos</a>
                </div>
            </div>
        </footer>
    );
}