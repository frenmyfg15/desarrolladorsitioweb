'use client';

import React, { useMemo } from 'react';
import { Mail, MessageCircle } from 'lucide-react';

const NAV_LINKS = [
    { href: '#top', label: 'Inicio' },
    { href: '#reviews', label: 'Reseñas' },
    { href: '#servicios', label: 'Servicios' },
    { href: '#desarrollo', label: 'Desarrollo' },
    { href: '#seguridad', label: 'Seguridad' },
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contacto', label: 'Contacto' },
] as const;

const SERVICE_LINKS = [
    { href: '#servicios', label: 'Landing pages' },
    { href: '#servicios', label: 'Webs corporativas' },
    { href: '#servicios', label: 'Dashboards' },
    { href: '#servicios', label: 'Apps web y mobile' },
    { href: '#servicios', label: 'E-commerce' },
    { href: '#servicios', label: 'UI / UX' },
] as const;

export default function Footer() {
    // ✅ Evita render mismatch e innecesario 'use client' por Date en render:
    // calculo una vez y no lo rehago en cada render.
    const year = useMemo(() => new Date().getFullYear(), []);

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
            aria-label="Pie de página"
        >
            {/* Top */}
            <div className="grid grid-cols-12 gap-10">
                {/* Navigation */}
                <nav
                    className="col-span-4 max-[1000px]:col-span-6 max-[520px]:col-span-12 flex flex-col gap-3 min-w-0"
                    aria-label="Navegación del sitio"
                >
                    <p className="font-bold text-white">Navegación</p>
                    <ul className="flex flex-col gap-2 text-white/70 min-w-0 text-sm">
                        {NAV_LINKS.map((l) => (
                            <li key={l.href}>
                                <a href={l.href} className="hover:text-white transition-colors">
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Services */}
                <nav
                    className="col-span-4 max-[1000px]:col-span-6 max-[520px]:col-span-12 flex flex-col gap-3 min-w-0"
                    aria-label="Servicios"
                >
                    <p className="font-bold text-white">Servicios</p>
                    <ul className="flex flex-col gap-2 text-white/70 min-w-0 text-sm">
                        {SERVICE_LINKS.map((l, i) => (
                            <li key={`${l.href}-${i}`}>
                                <a href={l.href} className="hover:text-white transition-colors">
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Contact */}
                <div className="col-span-4 max-[1000px]:col-span-12 flex flex-col gap-3 min-w-0">
                    <p className="font-bold text-white">Contacto</p>

                    <address className="not-italic flex flex-col gap-2 text-white/70 min-w-0">
                        <a
                            href="mailto:contacto@novaforge.dev"
                            className="flex items-center gap-2 min-w-0 hover:text-white transition-colors"
                            aria-label="Enviar email a contacto@novaforge.dev"
                        >
                            <Mail className="w-4 h-4 text-white shrink-0" aria-hidden="true" focusable="false" />
                            <span className="text-sm min-w-0 truncate">contacto@novaforge.dev</span>
                        </a>

                        <a
                            href="#contacto"
                            className="flex items-center gap-2 min-w-0 hover:text-white transition-colors"
                            aria-label="Ir a la sección de contacto por WhatsApp"
                        >
                            <MessageCircle className="w-4 h-4 text-white shrink-0" aria-hidden="true" focusable="false" />
                            <span className="text-sm min-w-0 truncate">WhatsApp directo</span>
                        </a>
                    </address>
                </div>
            </div>

            {/* Divider */}
            <div className="mt-14 border-t border-white/25" />

            {/* Bottom */}
            <div className="mt-6 flex items-center justify-between gap-4 flex-wrap max-[520px]:justify-center max-[520px]:text-center">
                <p className="text-xs text-white/60">© {year} NovaForge. Todos los derechos reservados.</p>

                <nav className="flex items-center gap-4 text-xs text-white/60 flex-wrap justify-center" aria-label="Enlaces legales">
                    {/* Mantengo href="#" como en tu diseño; idealmente enlazar a rutas reales */}
                    <a href="#" className="hover:text-white transition-colors">
                        Privacidad
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                        Cookies
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                        Términos
                    </a>
                </nav>
            </div>
        </footer>
    );
}