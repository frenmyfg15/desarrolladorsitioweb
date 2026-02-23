'use client';

import React, { useMemo } from 'react';

import { Code2, Palette, Database, Server, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';

function Chip({ children }: { children: React.ReactNode }) {
    return (
        <span className="px-3 py-1 rounded-3xl border border-secondary/20 bg-secondary/5 text-xs font-semibold text-text-secondary">
            {children}
        </span>
    );
}

function TimelineItem({
    icon,
    title,
    desc,
    isLast,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    isLast?: boolean;
}) {
    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-2xl border border-secondary/20 bg-white/60 backdrop-blur-md flex items-center justify-center text-secondary shadow-sm shrink-0">
                    {icon}
                </div>
                {!isLast && <div className="w-[2px] flex-1 bg-secondary/15 mt-2" />}
            </div>
            <div className="pb-5">
                <p className="font-bold text-text-primary text-sm">{title}</p>
                <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{desc}</p>
            </div>
        </div>
    );
}

// Galería pequeña de imágenes — reemplaza los src cuando tengas las reales
// 🔁 Reemplaza estos src por tus imágenes reales (ej: '/sections/dev-1.png')
const gallery = [
    { src: 'https://res.cloudinary.com/dcn4vq1n4/image/upload/v1771865889/fkxg4ofc9qtkwvwynrbl.png', alt: 'App móvil', label: 'App móvil' },
    { src: 'https://res.cloudinary.com/dcn4vq1n4/image/upload/v1771865633/rvv7oxkosefaqwp8sxo6.png', alt: 'Desarrollo de código', label: 'Código limpio' },
    { src: 'https://res.cloudinary.com/dcn4vq1n4/image/upload/v1771865686/lpysg1ip0obkb9qcyzx2.png', alt: 'Terminal y backend', label: 'Backend sólido' },
    { src: 'https://res.cloudinary.com/dcn4vq1n4/image/upload/v1771865762/wstw2mymexfuwysxpohe.png', alt: 'Diseño UI en pantalla', label: 'UI/UX Figma' },
];

export default function DevelopmentSection() {
    const tech = useMemo(
        () => [
            'Figma', 'TypeScript', 'React', 'Vue 3',
            'React Native', 'Node.js', 'PostgreSQL', 'Prisma',
            'Railway', 'JWT', 'Expo', 'Motion',
        ],
        []
    );

    const timeline = useMemo(
        () => [
            {
                icon: <Sparkles className="w-4 h-4" />,
                title: '1) Propuesta con opciones',
                desc: 'MVP, estándar o completo — con tiempos y coste claros.',
            },
            {
                icon: <Palette className="w-4 h-4" />,
                title: '2) Diseño en Figma',
                desc: 'Pantallas aprobadas antes de programar. Sin retrabajos.',
            },
            {
                icon: <Database className="w-4 h-4" />,
                title: '3) Base de datos + reglas',
                desc: 'Modelo sólido de entidades, relaciones y permisos.',
            },
            {
                icon: <Server className="w-4 h-4" />,
                title: '4) Backend / API',
                desc: 'Endpoints, validaciones y seguridad con JWT/roles.',
            },
            {
                icon: <Smartphone className="w-4 h-4" />,
                title: '5) Cliente / App',
                desc: 'Interfaz web o móvil con UX cuidado y estados completos.',
            },
            {
                icon: <ShieldCheck className="w-4 h-4" />,
                title: '6) Entrega + pago por fase',
                desc: 'Cada fase entregada y pagada. Control total en cada paso.',
            },
        ],
        []
    );

    return (
        <section className="relative z-[999] bg-transparent px-20 py-20 max-[1100px]:px-10 max-[900px]:px-6">

            {/* ── Header ── */}
            <div className="flex flex-col gap-3 max-w-[820px] mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl border border-secondary/30 bg-secondary/5 w-fit">
                    <Code2 className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-semibold text-text-secondary">Desarrollo</span>
                </div>

                <h2 className="text-text-primary font-bold text-5xl leading-[1.1] max-[900px]:text-4xl max-[520px]:text-[28px]">
                    Tecnología + proceso para entregar{' '}
                    <span className="text-primary">sin sorpresas</span>
                </h2>

                <p className="text-text-secondary text-lg leading-relaxed max-[900px]:text-base max-w-[600px]">
                    Diseñamos, desarrollamos y desplegamos por fases. Entregas claras, medibles y pagadas paso a paso.
                </p>
            </div>

            {/* ── Grid principal ── */}
            <div className="grid grid-cols-12 gap-6 items-start">

                {/* Columna izquierda — galería + stack */}
                <div className="col-span-5 max-[1100px]:col-span-12 flex flex-col gap-5">

                    {/* Imagen principal */}
                    <div className="rounded-3xl overflow-hidden border border-secondary/20 shadow-sm relative w-full h-[280px] bg-secondary/5">
                        {/* 🔁 Reemplaza src por tu imagen real: '/sections/dev-main.png' */}
                        <img
                            src={gallery[0].src}
                            alt={gallery[0].alt}
                            className="object-cover w-full h-full"
                        />
                        <div className="absolute bottom-3 left-3 rounded-2xl bg-white/70 backdrop-blur-md px-3 py-1.5 border border-secondary/20 shadow-sm">
                            <p className="text-xs font-bold text-text-primary">{gallery[0].label}</p>
                        </div>
                    </div>

                    {/* Sub-galería 3 imágenes */}
                    <div className="grid grid-cols-3 gap-3">
                        {gallery.slice(1).map((img) => (
                            <div
                                key={img.alt}
                                className="rounded-2xl overflow-hidden border border-secondary/20 shadow-sm relative w-full h-[110px] bg-secondary/5"
                            >
                                {/* 🔁 Reemplaza src por tus imágenes reales */}
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm px-2 py-1">
                                    <p className="text-[10px] font-semibold text-white truncate">{img.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stack */}
                    <div className="rounded-3xl border border-secondary/20 bg-white/50 backdrop-blur-md px-5 py-5 shadow-sm">
                        <p className="font-bold text-text-primary text-sm mb-3">Stack que usamos</p>
                        <div className="flex flex-wrap gap-2">
                            {tech.map((t) => (
                                <Chip key={t}>{t}</Chip>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Columna derecha — timeline */}
                <div className="col-span-7 max-[1100px]:col-span-12">
                    <div className="rounded-3xl border border-secondary/20 bg-white/50 backdrop-blur-md px-6 py-6 shadow-sm">
                        <p className="font-bold text-text-primary mb-1">Cómo lo hacemos</p>
                        <p className="text-xs text-text-secondary leading-relaxed mb-6">
                            Un flujo simple y claro: sabes siempre qué se entrega y qué sigue.
                        </p>

                        {timeline.map((t, idx) => (
                            <TimelineItem
                                key={t.title}
                                icon={t.icon}
                                title={t.title}
                                desc={t.desc}
                                isLast={idx === timeline.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}