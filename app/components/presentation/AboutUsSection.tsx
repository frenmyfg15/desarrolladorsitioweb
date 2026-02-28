'use client';

import React from 'react';
import { Heart, Target, Users, Lightbulb } from 'lucide-react';

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl border border-secondary/30 bg-secondary/5">
            <Users className="w-4 h-4 text-secondary" aria-hidden="true" focusable="false" />
            <span className="text-sm font-semibold text-text-secondary">{children}</span>
        </span>
    );
}

function Value({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="shrink-0 text-primary" aria-hidden="true">
                {icon}
            </div>
            <div className="flex flex-col gap-1">
                <p className="font-bold text-text-primary">{title}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

export default function AboutUsSection() {
    return (
        <section className="relative z-90 px-20 py-20 max-[900px]:px-6" aria-labelledby="about-title">
            <div
                className="
          grid grid-cols-12 gap-12 items-start
          max-[1100px]:grid-cols-1
        "
            >
                {/* Left – Manifesto */}
                <header className="col-span-5 flex flex-col gap-6">
                    <Pill>Sobre nosotros</Pill>

                    <h2
                        id="about-title"
                        className="
              text-text-primary font-bold text-5xl leading-[1.1]
              max-[900px]:text-4xl
              max-[520px]:text-[28px]
            "
                    >
                        No hacemos webs.
                        <br />
                        <span className="text-primary">Construimos productos</span>.
                    </h2>

                    <p className="text-text-secondary text-xl leading-relaxed max-[900px]:text-base">
                        Somos un equipo de diseño y desarrollo enfocado en crear soluciones digitales que tienen sentido para el
                        negocio y para las personas que las usan.
                    </p>

                    <p className="text-text-secondary leading-relaxed">
                        Creemos en los procesos claros, en hablar sin tecnicismos innecesarios y en entregar valor real en cada fase.
                        No vendemos humo ni promesas vagas: preferimos resultados, transparencia y relaciones a largo plazo.
                    </p>
                </header>

                {/* Right – Narrative blocks */}
                <div className="col-span-7 flex flex-col gap-8">
                    <article
                        className="
              rounded-3xl border border-secondary/20 bg-white/55 backdrop-blur-md
              px-8 py-8 shadow-sm
            "
                        aria-labelledby="about-how-think"
                    >
                        <div className="flex flex-col gap-3 max-w-[720px]">
                            <p id="about-how-think" className="font-bold text-text-primary text-xl">
                                Cómo pensamos
                            </p>
                            <p className="text-text-secondary leading-relaxed">
                                Cada proyecto es distinto. Antes de escribir una línea de código, entendemos el contexto, el objetivo y
                                las limitaciones reales. Pensamos en escalabilidad, mantenimiento y experiencia de usuario desde el
                                inicio.
                            </p>
                        </div>
                    </article>

                    <article
                        className="
              rounded-3xl border border-secondary/20 bg-white/55 backdrop-blur-md
              px-8 py-8 shadow-sm
            "
                        aria-labelledby="about-how-work"
                    >
                        <div className="flex flex-col gap-3 max-w-[720px]">
                            <p id="about-how-work" className="font-bold text-text-primary text-xl">
                                Cómo trabajamos
                            </p>
                            <p className="text-text-secondary leading-relaxed">
                                Proyectos por fases, entregas claras y pagos por fase. Así mantienes el control, reduces riesgos y ves
                                avances reales desde el primer momento.
                            </p>
                        </div>
                    </article>

                    <article
                        className="
              rounded-3xl border border-secondary/20 bg-white/55 backdrop-blur-md
              px-8 py-8 shadow-sm
            "
                        aria-labelledby="about-values"
                    >
                        <div className="flex flex-col gap-4 max-w-[720px]">
                            <p id="about-values" className="font-bold text-text-primary text-xl">
                                Lo que nos importa
                            </p>

                            <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
                                <Value
                                    icon={<Target className="w-5 h-5" aria-hidden="true" focusable="false" />}
                                    title="Impacto real"
                                    desc="Que el proyecto funcione para tu negocio, no solo que se vea bonito."
                                />
                                <Value
                                    icon={<Heart className="w-5 h-5" aria-hidden="true" focusable="false" />}
                                    title="Relación a largo plazo"
                                    desc="Preferimos clientes satisfechos que proyectos rápidos sin continuidad."
                                />
                                <Value
                                    icon={<Lightbulb className="w-5 h-5" aria-hidden="true" focusable="false" />}
                                    title="Claridad"
                                    desc="Sin jerga innecesaria, sin promesas vacías, sin letra pequeña."
                                />
                                <Value
                                    icon={<Users className="w-5 h-5" aria-hidden="true" focusable="false" />}
                                    title="Colaboración"
                                    desc="Trabajamos contigo, no solo para ti."
                                />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}