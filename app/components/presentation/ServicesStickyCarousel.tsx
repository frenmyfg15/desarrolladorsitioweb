'use client';

import React, { useMemo } from 'react';
import {
    Sparkles,
    Globe,
    LayoutDashboard,
    ShoppingCart,
    Smartphone,
    MapPin,
    Palette,
    CreditCard,
    Zap,
    MonitorSmartphone,
} from 'lucide-react';

type ServiceItem = {
    key: string;
    title: string;
    desc: string;
    tags: string[];
    icon: React.ReactNode;
};

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(' ');
}

function ServiceCard({ item }: { item: ServiceItem }) {
    return (
        <article
            className={cx(
                'text-left w-full',
                'rounded-3xl border border-secondary/20 bg-white',
                'px-6 py-5 shadow-sm',
                'transition-all duration-300 ease-out',
                'hover:-translate-y-0.5 hover:bg-secondary/5 hover:border-secondary/30 hover:shadow-md'
            )}
            aria-label={item.title}
        >
            <div className="flex items-start gap-4">
                <div
                    className="shrink-0 w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
                    aria-hidden="true"
                >
                    {item.icon}
                </div>

                <div className="flex flex-col gap-1.5">
                    {/* Mantengo h3 para la jerarquía dentro de la sección */}
                    <h3 className="font-bold text-lg text-text-primary leading-snug">{item.title}</h3>

                    <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>

                    <ul className="mt-2 flex flex-wrap gap-2" aria-label={`Etiquetas de ${item.title}`}>
                        {item.tags.map((t) => (
                            <li
                                key={t}
                                className="px-3 py-1 rounded-3xl border border-secondary/20 bg-secondary/5 text-xs font-semibold text-text-secondary"
                            >
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </article>
    );
}

export default function ServicesSection() {
    // ✅ useMemo no es necesario: es contenido estático y no cambia.
    // Mantengo la misma salida/render, pero simplifico JS.
    const services: ServiceItem[] = useMemo(
        () => [
            {
                key: 'landing',
                title: 'Landing page',
                desc: 'Perfectas para campañas, captación de leads y validación rápida.',
                tags: ['Conversión', 'SEO base', 'Rápida entrega'],
                icon: <Globe className="w-5 h-5" aria-hidden="true" focusable="false" />,
            },
            {
                key: 'web',
                title: 'Páginas completas por secciones',
                desc: 'Web corporativa: servicios, about, contacto, blog y más.',
                tags: ['Estructura', 'Branding', 'Escalable'],
                icon: <MonitorSmartphone className="w-5 h-5" aria-hidden="true" focusable="false" />,
            },
            {
                key: 'dashboard',
                title: 'Dashboards',
                desc: 'Paneles con tablas, filtros, permisos y métricas.',
                tags: ['Roles', 'CRUD', 'Analytics'],
                icon: <LayoutDashboard className="w-5 h-5" aria-hidden="true" focusable="false" />,
            },
            {
                key: 'apps',
                title: 'Apps (simple, normal y compleja)',
                desc: 'De MVP a producto robusto con módulos, auth y pagos.',
                tags: ['MVP', 'Arquitectura', 'Producto'],
                icon: <Smartphone className="w-5 h-5" aria-hidden="true" focusable="false" />,
            },
            {
                key: 'ecommerce',
                title: 'E-commerce',
                desc: 'Catálogo, carrito, checkout, pasarelas y analítica.',
                tags: ['Ventas', 'Checkout', 'Catálogo'],
                icon: <ShoppingCart className="w-5 h-5" aria-hidden="true" focusable="false" />,
            },
            {
                key: 'gmb',
                title: 'Fichas de Google',
                desc: 'Optimización para búsquedas locales y reputación.',
                tags: ['Local SEO', 'Visibilidad', 'Reseñas'],
                icon: <MapPin className="w-5 h-5" aria-hidden="true" focusable="false" />,
            },
            {
                key: 'uiux',
                title: 'Diseño UI/UX',
                desc: 'Interfaces con foco en usabilidad, claridad y conversión.',
                tags: ['UX', 'UI', 'Prototipos'],
                icon: <Palette className="w-5 h-5" aria-hidden="true" focusable="false" />,
            },
            {
                key: 'branding',
                title: 'Tarjetas empresariales',
                desc: 'Diseño coherente con tu marca, listo para imprimir.',
                tags: ['Branding', 'Impresión', 'Estilo'],
                icon: <CreditCard className="w-5 h-5" aria-hidden="true" focusable="false" />,
            },
            {
                key: 'motion',
                title: 'Páginas con animación',
                desc: 'Micro-interacciones y motion para un impacto moderno.',
                tags: ['Motion', 'Interacción', 'Impacto'],
                icon: <Zap className="w-5 h-5" aria-hidden="true" focusable="false" />,
            },
        ],
        []
    );

    return (
        <section className="relative z-[999] bg-white px-20 py-16 flex flex-col gap-10 max-[900px]:px-6">
            {/* Header */}
            <header className="flex flex-col items-center gap-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl border border-secondary/30 bg-secondary/5">
                    <Sparkles className="w-4 h-4 text-secondary" aria-hidden="true" focusable="false" />
                    <p className="text-sm font-semibold text-text-secondary">Servicios</p>
                </div>

                <h2
                    className="
            text-text-primary font-bold text-5xl leading-[1.1]
            max-[900px]:text-4xl
            max-[520px]:text-[28px]
          "
                >
                    Diseños, desarrollo y crecimiento <span className="text-primary">en un solo lugar</span>
                </h2>

                <p className="text-text-secondary text-xl max-w-[860px] max-[900px]:text-base">
                    Todo lo que necesitas para lanzar, crecer y escalar tu presencia digital.
                </p>
            </header>

            {/* Grid */}
            <div
                className="
          grid grid-cols-3 gap-6
          max-[1150px]:grid-cols-2
          max-[650px]:grid-cols-1
        "
                role="list"
                aria-label="Listado de servicios"
            >
                {services.map((s) => (
                    <div key={s.key} role="listitem">
                        <ServiceCard item={s} />
                    </div>
                ))}
            </div>
        </section>
    );
}