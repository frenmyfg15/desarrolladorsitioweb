'use client';

import logo from '@/app/assets/novaforge/logo.webp';
import Image from 'next/image';
import Link from 'next/link';
import {
    Code2,
    HelpCircle,
    LayoutGrid,
    LogIn,
    Mail,
    ShieldCheck,
    Users,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(' ');
}

const NAV = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#desarrollo', label: 'Desarrollo' },
    { href: '#seguridad', label: 'Seguridad' },
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#faq', label: 'FAQ' },
] as const;

export default function Header() {
    const [showMenu, setShowMenu] = useState(false);

    const panelRef = useRef<HTMLDivElement>(null);
    const toggleBtnRef = useRef<HTMLButtonElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    const closeMenu = useCallback(() => setShowMenu(false), []);
    const toggleMenu = useCallback(() => setShowMenu((v) => !v), []);

    const mobileItems = useMemo(
        () => [
            { href: '#servicios', label: 'Servicios', Icon: LayoutGrid },
            { href: '#desarrollo', label: 'Desarrollo', Icon: Code2 },
            { href: '#seguridad', label: 'Seguridad', Icon: ShieldCheck },
            { href: '#nosotros', label: 'Nosotros', Icon: Users },
            { href: '#faq', label: 'FAQ', Icon: HelpCircle },
            { href: '#contacto', label: 'Contactar', Icon: Mail },
        ],
        []
    );

    // Escape solo mientras el menú está abierto (menos listeners = menos JS activo)
    useEffect(() => {
        if (!showMenu) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeMenu();
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [showMenu, closeMenu]);

    // Bloquea scroll del body cuando el menú está abierto
    useEffect(() => {
        if (!showMenu) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [showMenu]);

    // Gestión de foco básica al abrir/cerrar (mejora accesibilidad del diálogo)
    useEffect(() => {
        if (showMenu) {
            closeBtnRef.current?.focus();
        } else {
            toggleBtnRef.current?.focus();
        }
    }, [showMenu]);

    return (
        <>
            {/* ── Header bar ── */}
            <header className="fixed top-0 left-0 right-0 z-[1000]">
                <div className="px-6 pt-6 max-[900px]:px-4">
                    <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/30 bg-white/20 backdrop-blur-lg px-5 py-3">
                        {/* Brand */}
                        <a href="#top" className="flex items-center gap-3 min-w-0" aria-label="Ir al inicio">
                            <div className="shrink-0 rounded-2xl border border-white/30 bg-white/15 p-2">
                                <Image
                                    src={logo}
                                    alt="NovaForge — logotipo"
                                    width={34}
                                    height={34}
                                    sizes="34px"
                                    priority
                                    className="w-[34px] h-[34px] object-contain"
                                />
                            </div>
                            <span className="text-text-primary font-bold text-base">NovaForge</span>
                        </a>

                        {/* Desktop nav */}
                        <div className="hidden lg:flex items-center gap-4">
                            <nav
                                className="flex items-center gap-1 rounded-3xl border border-white/30 bg-white/15 backdrop-blur-lg p-1"
                                aria-label="Navegación principal"
                            >
                                {NAV.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className="px-4 py-2 rounded-3xl text-sm font-semibold text-text-secondary transition-all duration-200 hover:bg-white/25 hover:text-text-primary"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>

                            <Link
                                href="/login"
                                className="flex items-center gap-2 text-sm font-semibold text-text-primary px-4 py-2 rounded-3xl border border-white/30 bg-white/10 transition-all duration-200 hover:bg-white/25 hover:-translate-y-0.5"
                                aria-label="Ir a la página de inicio de sesión"
                            >
                                <LogIn size={18} aria-hidden="true" focusable="false" />
                                Login
                            </Link>

                            <a
                                href="#contacto"
                                className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-3xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
                            >
                                Contactar
                            </a>
                        </div>

                        {/* Mobile toggle */}
                        <div className="lg:hidden flex items-center">
                            <button
                                ref={toggleBtnRef}
                                onClick={toggleMenu}
                                type="button"
                                className="relative h-10 w-10 rounded-2xl border border-white/30 bg-white/15 backdrop-blur-lg flex items-center justify-center"
                                aria-label={showMenu ? 'Cerrar menú' : 'Abrir menú'}
                                aria-expanded={showMenu}
                                aria-controls="mobile-menu"
                            >
                                <span
                                    className={cx(
                                        'absolute h-0.5 w-5 bg-primary transition-transform duration-200',
                                        showMenu ? 'rotate-45' : '-translate-y-1.5'
                                    )}
                                    aria-hidden="true"
                                />
                                <span
                                    className={cx(
                                        'absolute h-0.5 w-5 bg-secondary transition-transform duration-200',
                                        showMenu ? '-rotate-45' : 'translate-y-1.5'
                                    )}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Overlay + panel móvil fuera del <header> para evitar overflow-x ── */}
            <div className="lg:hidden">
                {/* Overlay */}
                <div
                    className={cx(
                        'fixed inset-0 z-[990] bg-black/30 backdrop-blur-[2px] transition-opacity duration-200',
                        showMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    )}
                    onClick={closeMenu}
                    aria-hidden="true"
                />

                {/* Panel */}
                <div
                    id="mobile-menu"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menú móvil"
                    className={cx(
                        'fixed top-0 left-0 h-full z-[1000]',
                        'w-[86vw] max-w-[360px]',
                        'border-r border-gray-100 bg-white shadow-2xl',
                        'transform-gpu transition-transform duration-300 ease-out',
                        showMenu ? 'translate-x-0' : '-translate-x-full'
                    )}
                    ref={panelRef}
                >
                    <div className="h-full flex flex-col overflow-hidden">
                        {/* Header menú */}
                        <div className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="shrink-0 rounded-2xl border border-secondary/20 bg-secondary/5 p-2">
                                    <Image
                                        src={logo}
                                        alt="NovaForge — logotipo"
                                        width={32}
                                        height={32}
                                        sizes="32px"
                                        className="w-[32px] h-[32px] object-contain"
                                    />
                                </div>
                                <span className="text-text-primary font-bold truncate">NovaForge</span>
                            </div>

                            <button
                                ref={closeBtnRef}
                                onClick={closeMenu}
                                type="button"
                                className="h-10 w-10 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center"
                                aria-label="Cerrar menú"
                            >
                                <X className="w-5 h-5 text-text-primary" aria-hidden="true" focusable="false" />
                            </button>
                        </div>

                        {/* Nav móvil */}
                        <div className="px-5 py-5 overflow-y-auto flex-1">
                            <nav className="flex flex-col gap-2 text-text-secondary text-sm font-medium" aria-label="Navegación móvil">
                                {mobileItems.map(({ href, label, Icon }) => (
                                    <a
                                        key={href}
                                        href={href}
                                        onClick={closeMenu}
                                        className="flex items-center gap-3 px-4 py-3 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-secondary/5 hover:border-secondary/20 transition-colors"
                                    >
                                        <Icon size={18} className="text-secondary" aria-hidden="true" focusable="false" />
                                        {label}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Bottom action */}
                        <div className="px-5 pb-6 mt-auto border-t border-gray-100 pt-4">
                            <Link
                                href="/login"
                                onClick={closeMenu}
                                className="flex items-center justify-center gap-2 border border-primary/40 bg-white font-bold py-3 px-6 rounded-3xl text-primary transition-all duration-200 hover:bg-primary hover:text-white"
                                aria-label="Iniciar sesión"
                            >
                                <LogIn size={18} aria-hidden="true" focusable="false" />
                                Iniciar sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}