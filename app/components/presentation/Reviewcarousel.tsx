'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export type Review = {
    name: string;
    role: string;
    avatar: string;
    stars: number;
    text: string;
};

const DEFAULT_REVIEWS: Review[] = [
    { name: 'Sofía Martínez', role: 'CEO · StartupHub', avatar: 'https://i.pravatar.cc/80?img=47', stars: 5, text: 'NovaForge transformó nuestra idea en un producto real en tiempo récord. El proceso por fases nos dio total control y confianza desde el primer día.' },
    { name: 'Diego Romero', role: 'Fundador · EcomPlus', avatar: 'https://i.pravatar.cc/80?img=11', stars: 5, text: 'Diseño impecable y código limpio. Entregaron cada fase sin sorpresas. Nuestro e-commerce convierte mucho mejor que el anterior.' },
    { name: 'Laura Gómez', role: 'Directora de Marketing · Innova', avatar: 'https://i.pravatar.cc/80?img=49', stars: 5, text: 'La landing que crearon duplicó nuestras conversiones en el primer mes. Saben exactamente cómo combinar diseño y estrategia.' },
    { name: 'Carlos Vidal', role: 'CTO · DevScale', avatar: 'https://i.pravatar.cc/80?img=12', stars: 5, text: 'El dashboard maneja miles de registros sin problema. Arquitectura sólida, bien documentada y fácil de escalar.' },
    { name: 'Ana Ruiz', role: 'Propietaria · Boutique Alma', avatar: 'https://i.pravatar.cc/80?img=45', stars: 5, text: 'Desde el diseño en Figma hasta el despliegue, todo fue fluido. Mi tienda online quedó exactamente como la imaginaba.' },
    { name: 'Marcos León', role: 'Product Manager · Fintera', avatar: 'https://i.pravatar.cc/80?img=15', stars: 5, text: 'Seguridad, rendimiento y UI de primer nivel. El MVP que lanzamos nos abrió la puerta a nuestra ronda de inversión.' },
];

function Stars({ n, color = '#36DBBA' }: { n: number; color?: string }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: n }).map((_, i) => (
                <Star key={i} className="w-4 h-4" style={{ fill: color, color }} />
            ))}
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="shrink-0 w-[340px] max-[520px]:w-[80vw] rounded-3xl border border-secondary/20 bg-white/60 backdrop-blur-md shadow-sm px-6 py-5 flex flex-col gap-4 snap-center">
            <Stars n={review.stars} />
            <p className="text-sm text-text-secondary leading-relaxed flex-1">"{review.text}"</p>
            <div className="flex items-center gap-3 pt-3 border-t border-secondary/10">
                <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div>
                    <p className="text-sm font-bold text-text-primary leading-none">{review.name}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{review.role}</p>
                </div>
            </div>
        </div>
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
    const CARD_W = 356;

    useEffect(() => {
        trackRef.current?.scrollTo({ left: active * CARD_W, behavior: 'smooth' });
    }, [active]);

    useEffect(() => {
        if (!autoPlayMs) return;
        const id = setInterval(() => setActive((a) => (a + 1) % reviews.length), autoPlayMs);
        return () => clearInterval(id);
    }, [autoPlayMs, reviews.length]);

    const prev = () => setActive((a) => Math.max(0, a - 1));
    const next = () => setActive((a) => Math.min(reviews.length - 1, a + 1));

    return (
        <div className="relative z-[999] bg-transparent flex flex-col gap-6 w-full">

            {/* Header */}
            <div className="flex items-end justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                    <Stars n={5} color={accentColor} />
                    <p className="font-bold text-text-primary text-2xl mt-1">{title}</p>
                    <p className="text-sm text-text-secondary">{subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={prev} disabled={active === 0} aria-label="Anterior"
                        className="w-10 h-10 rounded-2xl border border-secondary/20 bg-white/50 backdrop-blur-md flex items-center justify-center text-secondary disabled:opacity-30 hover:bg-white/70 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={next} disabled={active === reviews.length - 1} aria-label="Siguiente"
                        className="w-10 h-10 rounded-2xl border border-secondary/20 bg-white/50 backdrop-blur-md flex items-center justify-center text-secondary disabled:opacity-30 hover:bg-white/70 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Track */}
            <div ref={trackRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: 'none' }}>
                {reviews.map((r) => <ReviewCard key={r.name} review={r} />)}
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2">
                {reviews.map((_, i) => (
                    <button key={i} onClick={() => setActive(i)} aria-label={`Reseña ${i + 1}`}
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ width: active === i ? '2.5rem' : '0.5rem', backgroundColor: active === i ? accentColor : '#d1d5db' }}
                    />
                ))}
            </div>
        </div>
    );
}