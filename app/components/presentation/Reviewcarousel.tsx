'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export type Review = {
    name: string;
    role: string;
    avatar: string;
    stars: number;
    text: string;
};

const DEFAULT_REVIEWS: Review[] = [
    {
        name: 'Sofía Martínez',
        role: 'CEO · StartupHub',
        avatar: 'https://i.pravatar.cc/80?img=47',
        stars: 5,
        text: 'NovaForge transformó nuestra idea en un producto real en tiempo récord. El proceso por fases nos dio total control y confianza desde el primer día.',
    },
    {
        name: 'Diego Romero',
        role: 'Fundador · EcomPlus',
        avatar: 'https://i.pravatar.cc/80?img=11',
        stars: 5,
        text: 'Diseño impecable y código limpio. Entregaron cada fase sin sorpresas. Nuestro e-commerce convierte mucho mejor que el anterior.',
    },
    {
        name: 'Laura Gómez',
        role: 'Directora de Marketing · Innova',
        avatar: 'https://i.pravatar.cc/80?img=49',
        stars: 5,
        text: 'La landing que crearon duplicó nuestras conversiones en el primer mes. Saben exactamente cómo combinar diseño y estrategia.',
    },
    {
        name: 'Carlos Vidal',
        role: 'CTO · DevScale',
        avatar: 'https://i.pravatar.cc/80?img=12',
        stars: 5,
        text: 'El dashboard maneja miles de registros sin problema. Arquitectura sólida, bien documentada y fácil de escalar.',
    },
    {
        name: 'Ana Ruiz',
        role: 'Propietaria · Boutique Alma',
        avatar: 'https://i.pravatar.cc/80?img=45',
        stars: 5,
        text: 'Desde el diseño en Figma hasta el despliegue, todo fue fluido. Mi tienda online quedó exactamente como la imaginaba.',
    },
    {
        name: 'Marcos León',
        role: 'Product Manager · Fintera',
        avatar: 'https://i.pravatar.cc/80?img=15',
        stars: 5,
        text: 'Seguridad, rendimiento y UI de primer nivel. El MVP que lanzamos nos abrió la puerta a nuestra ronda de inversión.',
    },

    // ➕ Más reseñas (mismo formato, sin cambiar UI)
    {
        name: 'Javier Castillo',
        role: 'CTO · Fintech Solutions',
        avatar: 'https://i.pravatar.cc/80?img=32',
        stars: 5,
        text: 'Entrega puntual, métricas claras y performance excelente. Pasamos a 90+ en Lighthouse sin sacrificar diseño.',
    },
    {
        name: 'María Torres',
        role: 'Directora Comercial · Vela Group',
        avatar: 'https://i.pravatar.cc/80?img=28',
        stars: 5,
        text: 'Nos ayudaron a ordenar el mensaje y a convertir más. El proceso fue muy transparente y rápido.',
    },
    {
        name: 'Andrés Ruiz',
        role: 'Founder · EcommercePro',
        avatar: 'https://i.pravatar.cc/80?img=21',
        stars: 5,
        text: 'Arquitectura limpia y escalable. Se nota el enfoque en SEO técnico y accesibilidad desde el inicio.',
    },
    {
        name: 'Sofía Navarro',
        role: 'Brand Manager · Lumen',
        avatar: 'https://i.pravatar.cc/80?img=19',
        stars: 5,
        text: 'Diseño premium y ejecución impecable. La nueva landing elevó nuestra marca y mejoró el lead quality.',
    },
];

function Stars({ n, color = '#36DBBA' }: { n: number; color?: string }) {
    // Iconos decorativos: ocultos a lectores para evitar ruido repetitivo
    return (
        <div className="flex gap-0.5" aria-label={`${n} de 5 estrellas`} role="img">
            {Array.from({ length: n }).map((_, i) => (
                <Star
                    key={i}
                    className="w-4 h-4"
                    style={{ fill: color, color }}
                    aria-hidden="true"
                    focusable="false"
                />
            ))}
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    return (
        <article className="shrink-0 w-[340px] max-[520px]:w-[80vw] rounded-3xl border border-secondary/20 bg-white/60 backdrop-blur-md shadow-sm px-6 py-5 flex flex-col gap-4 snap-center">
            <Stars n={review.stars} />
            <p className="text-sm text-text-secondary leading-relaxed flex-1">"{review.text}"</p>

            <div className="flex items-center gap-3 pt-3 border-t border-secondary/10">
                {/* ✅ next/image: lazy por defecto + mejor optimización de red */}
                {/* No cambia el layout porque fijamos width/height y mantenemos las mismas clases */}
                <Image
                    src={review.avatar}
                    alt={`Foto de ${review.name}`}
                    width={40}
                    height={40}
                    sizes="40px"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    loading="lazy"
                />
                <div>
                    <p className="text-sm font-bold text-text-primary leading-none">{review.name}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{review.role}</p>
                </div>
            </div>
        </article>
    );
}

type ReviewsCarouselProps = {
    reviews?: Review[];
    title?: string;
    subtitle?: string;
    accentColor?: string;
    autoPlayMs?: number;
};

export default function ReviewsCarousel({
    reviews = DEFAULT_REVIEWS,
    title = 'Lo que dicen nuestros clientes',
    subtitle = '+50 proyectos entregados · 5.0 valoración media',
    accentColor = '#36DBBA',
    autoPlayMs = 3500,
}: ReviewsCarouselProps) {
    const [active, setActive] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);

    // Evita “magic numbers” rígidos: usa el ancho real de la card (incluye gap)
    const cardStepRef = useRef<number>(356);

    const regionId = useId();
    const titleId = `${regionId}-title`;

    // Ajusta el step al montar (mismo layout, pero scroll más preciso en responsive)
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        const first = el.querySelector<HTMLElement>('[data-review-card="true"]');
        if (!first) return;

        const cardW = first.getBoundingClientRect().width;
        // gap-4 = 16px (Tailwind) → mismo que tu diseño actual
        cardStepRef.current = Math.round(cardW + 16);
    }, []);

    // Scroll suave cuando cambia active
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        el.scrollTo({ left: active * cardStepRef.current, behavior: 'smooth' });
    }, [active]);

    // Autoplay pausado si el usuario prefiere menos movimiento (a11y / UX)
    const reducedMotion = useMemo(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    }, []);

    useEffect(() => {
        if (!autoPlayMs || reviews.length <= 1 || reducedMotion) return;

        const id = window.setInterval(() => {
            setActive((a) => (a + 1) % reviews.length);
        }, autoPlayMs);

        return () => window.clearInterval(id);
    }, [autoPlayMs, reviews.length, reducedMotion]);

    const prev = useCallback(() => setActive((a) => Math.max(0, a - 1)), []);
    const next = useCallback(() => setActive((a) => Math.min(reviews.length - 1, a + 1)), [reviews.length]);

    // Asegura active válido si cambia el array de reviews
    useEffect(() => {
        setActive((a) => Math.min(a, Math.max(0, reviews.length - 1)));
    }, [reviews.length]);

    return (
        <section
            className="relative z-[999] bg-transparent flex flex-col gap-6 w-full"
            aria-labelledby={titleId}
            role="region"
        >
            {/* Header */}
            <div className="flex items-end justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                    <Stars n={5} color={accentColor} />
                    {/* Mantengo el mismo layout: solo añado id para semántica */}
                    <p id={titleId} className="font-bold text-text-primary text-2xl mt-1">
                        {title}
                    </p>
                    <p className="text-sm text-text-secondary">{subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={prev}
                        disabled={active === 0}
                        aria-label="Reseña anterior"
                        className="w-10 h-10 rounded-2xl border border-secondary/20 bg-white/50 backdrop-blur-md flex items-center justify-center text-secondary disabled:opacity-30 hover:bg-white/70 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" aria-hidden="true" focusable="false" />
                    </button>

                    <button
                        type="button"
                        onClick={next}
                        disabled={active === reviews.length - 1}
                        aria-label="Siguiente reseña"
                        className="w-10 h-10 rounded-2xl border border-secondary/20 bg-white/50 backdrop-blur-md flex items-center justify-center text-secondary disabled:opacity-30 hover:bg-white/70 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" aria-hidden="true" focusable="false" />
                    </button>
                </div>
            </div>

            {/* Track */}
            <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
                style={{ scrollbarWidth: 'none' }}
                // Mejor a11y: indica que es un carrusel scrollable
                aria-label="Carrusel de reseñas"
            >
                {reviews.map((r, idx) => (
                    <div key={`${r.name}-${idx}`} data-review-card="true">
                        <ReviewCard review={r} />
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2" aria-label="Paginación de reseñas">
                {reviews.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`Ir a la reseña ${i + 1} de ${reviews.length}`}
                        aria-current={active === i ? 'true' : undefined}
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                            width: active === i ? '2.5rem' : '0.5rem',
                            backgroundColor: active === i ? accentColor : '#d1d5db',
                        }}
                    />
                ))}
            </div>
        </section>
    );
}