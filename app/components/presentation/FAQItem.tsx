'use client';

import React, { useMemo, useState } from 'react';
import { HelpCircle, Plus, Minus } from 'lucide-react';

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(' ');
}

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl border border-secondary/30 bg-secondary/5">
            <HelpCircle className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold text-text-secondary">{children}</span>
        </span>
    );
}

type FaqItem = {
    q: string;
    a: React.ReactNode;
};

function FaqRow({
    item,
    open,
    onToggle,
}: {
    item: FaqItem;
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="rounded-3xl border border-secondary/20 bg-white shadow-sm overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                className={cx(
                    'w-full text-left',
                    'px-6 py-5',
                    'flex items-center justify-between gap-4',
                    'transition-colors duration-300',
                    'hover:bg-secondary/5'
                )}
                aria-expanded={open}
            >
                <p className="font-bold text-text-primary text-base max-[520px]:text-sm">{item.q}</p>
                <span className="shrink-0 rounded-2xl border border-secondary/20 bg-secondary/5 p-2 text-secondary">
                    {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
            </button>

            <div
                className={cx(
                    'grid transition-all duration-300 ease-out',
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
            >
                <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-sm text-text-secondary leading-relaxed">{item.a}</div>
                </div>
            </div>
        </div>
    );
}

export default function FAQSection() {
    const faqs = useMemo<FaqItem[]>(
        () => [
            {
                q: '¿Cómo empiezo un proyecto con NovaForge?',
                a: (
                    <>
                        Primero entendemos tu objetivo y te enviamos una propuesta con opciones (alcance, tiempos y coste).
                        Tú eliges la opción más adecuada para la primera entrega.
                    </>
                ),
            },
            {
                q: '¿Por qué trabajáis por fases y pagos por fase?',
                a: (
                    <>
                        Porque reduce riesgos para ambas partes: tú ves avances reales con entregas cerradas,
                        y nosotros trabajamos con un alcance claro. Sin ataduras y con valor entregado en cada fase.
                    </>
                ),
            },
            {
                q: '¿Qué fases típicas tiene un proyecto?',
                a: (
                    <>
                        Suele ser: <b>maquetación en Figma</b> → <b>base de datos</b> → <b>backend/API</b> →{' '}
                        <b>frontend/cliente</b> → integraciones → optimización y despliegue.
                    </>
                ),
            },
            {
                q: '¿Puedo contratar solo diseño UI/UX o solo desarrollo?',
                a: (
                    <>
                        Sí. Podemos hacer únicamente UI/UX (Figma + prototipo) o solo desarrollo si ya tienes diseño.
                        También podemos mejorar y unificar un producto existente.
                    </>
                ),
            },
            {
                q: '¿Qué tecnologías utilizáis?',
                a: (
                    <>
                        Depende del proyecto, pero normalmente trabajamos con <b>TypeScript</b>, <b>React</b> o <b>Vue 3</b>,{' '}
                        <b>Node.js</b>, despliegue en cloud (p.ej. Railway) y autenticación con <b>JWT</b>.
                        Para mobile usamos <b>React Native</b> y <b>Expo</b>.
                    </>
                ),
            },
            {
                q: '¿Incluye mantenimiento y soporte?',
                a: (
                    <>
                        Podemos incluirlo como una fase adicional o como un plan mensual. Lo definimos en la propuesta
                        según el tipo de producto y tu necesidad de evolución.
                    </>
                ),
            },
            {
                q: '¿Cuánto tarda un proyecto?',
                a: (
                    <>
                        Depende del alcance, pero lo trabajamos por entregas. La primera fase suele ser la más rápida
                        (diseño o MVP) para que puedas validar cuanto antes.
                    </>
                ),
            },
            {
                q: '¿Mi web estará optimizada para SEO y rendimiento?',
                a: (
                    <>
                        Sí: base de SEO técnico, rendimiento, accesibilidad y estructura limpia. Si necesitas SEO avanzado
                        (estrategia, contenidos, enlazado, etc.) también lo contemplamos.
                    </>
                ),
            },
        ],
        []
    );

    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <section className="relative z-[900] bg-white px-20 py-20 max-[900px]:px-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-4 text-center">
                <Pill>Preguntas frecuentes</Pill>

                <h2 className="text-text-primary font-bold text-5xl leading-[1.1] max-[900px]:text-4xl max-[520px]:text-[28px]">
                    Resolvemos tus dudas <span className="text-primary">antes de empezar</span>
                </h2>

                <p className="text-text-secondary text-xl leading-relaxed max-w-[860px] max-[900px]:text-base">
                    Respuestas directas sobre nuestro proceso, fases, pagos y tecnologías.
                </p>
            </div>

            {/* FAQ list */}
            <div className="mt-12 grid grid-cols-2 gap-4 max-[1000px]:grid-cols-1">
                {faqs.map((f, idx) => (
                    <FaqRow
                        key={f.q}
                        item={f}
                        open={openIdx === idx}
                        onToggle={() => setOpenIdx((cur) => (cur === idx ? null : idx))}
                    />
                ))}
            </div>

            <div className="mt-10 flex justify-center">
                <p className="text-xs text-text-secondary text-center max-w-[720px]">
                    ¿No encuentras tu pregunta? Escríbenos y te respondemos con una propuesta adaptada a tu caso.
                </p>
            </div>
        </section>
    );
}