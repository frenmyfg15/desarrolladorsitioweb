'use client';

import Image from 'next/image';

type Props = {
    /** Ruta del logo, ej: "/logo.svg" o "/logo.png" */
    logoSrc: any;
    /** Texto opcional */
    label?: string;
};

export default function LoadingScreen({ logoSrc, label = 'Cargando…' }: Props) {
    return (
        <div className="relative flex min-h-[60vh] w-full items-center justify-center bg-white">
            {/* Fondo sutil (blanco, moderno) */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-zinc-100 blur-3xl opacity-70" />
                <div className="absolute -bottom-28 left-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-zinc-100 blur-3xl opacity-60" />
            </div>

            <div className="relative flex flex-col items-center gap-6 px-6 text-center">
                {/* Halo */}
                <div className="absolute -z-10 h-44 w-44 rounded-full bg-zinc-100 blur-2xl animate-[glow_2.4s_ease-in-out_infinite]" />

                {/* Logo + animación */}
                <div className="relative grid place-items-center">
                    {/* Anillo spinner */}
                    <div className="absolute h-36 w-36 rounded-full border border-zinc-200" />
                    <div className="absolute h-36 w-36 rounded-full border-2 border-transparent border-t-zinc-400 animate-spin [animation-duration:1.1s]" />

                    {/* “Float” del logo */}
                    <div className="animate-[float_1.8s_ease-in-out_infinite]">
                        <div className="rounded-3xl bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] ring-1 ring-zinc-200">
                            <Image
                                src={logoSrc}
                                alt="Logo"
                                width={160}
                                height={160}
                                priority
                                className="h-28 w-28 object-contain md:h-32 md:w-32"
                            />
                        </div>
                    </div>
                </div>

                {/* Texto */}
                <div className="flex flex-col items-center gap-2">
                    <p className="text-base font-medium text-zinc-800">{label}</p>

                    {/* Barra de progreso “shimmer” */}
                    <div className="h-2 w-56 overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200">
                        <div className="h-full w-1/2 rounded-full bg-zinc-300/70 animate-[shimmer_1.2s_ease-in-out_infinite]" />
                    </div>

                    <p className="text-xs text-zinc-500">Estamos preparando tu panel…</p>
                </div>
            </div>

            {/* Keyframes */}
            <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes glow {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.06);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-30%);
            opacity: 0.55;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            transform: translateX(130%);
            opacity: 0.55;
          }
        }
      `}</style>
        </div>
    );
}
