'use client';

import React, { useMemo } from 'react';
import {
    Shield, LockKeyhole, KeyRound, Server, EyeOff, Database, CheckCircle2,
} from 'lucide-react';


const securityImg = 'https://res.cloudinary.com/dcn4vq1n4/image/upload/v1771866202/uvcjvyrpir2w0kt0mgsc.png';

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl border border-secondary/30 bg-secondary/5">
            <Shield className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold text-text-secondary">{children}</span>
        </span>
    );
}

function PrincipleCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="rounded-3xl border border-secondary/20 bg-white px-5 py-4 shadow-sm flex items-start gap-3">
            <div className="shrink-0 rounded-2xl border border-secondary/20 bg-secondary/5 p-2 text-secondary">
                {icon}
            </div>
            <div className="flex flex-col gap-0.5">
                <p className="font-bold text-text-primary text-sm">{title}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function Guarantee({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 rounded-3xl border border-white/30 bg-white/15 px-4 py-2">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <p className="text-xs font-semibold text-white/90">{text}</p>
        </div>
    );
}

export default function SecuritySection() {
    const principles = useMemo(() => [
        { icon: <LockKeyhole className="w-5 h-5" />, title: 'Diseño seguro por defecto', desc: 'La seguridad se define desde la arquitectura, no como parche final.' },
        { icon: <KeyRound className="w-5 h-5" />, title: 'Autenticación y sesiones', desc: 'JWT, expiración, revocación y control de sesiones.' },
        { icon: <Database className="w-5 h-5" />, title: 'Protección de datos', desc: 'Aislamiento por empresa, mínimo privilegio y queries seguras.' },
        { icon: <Server className="w-5 h-5" />, title: 'Infraestructura', desc: 'Variables de entorno, despliegues controlados y buenas prácticas.' },
        { icon: <EyeOff className="w-5 h-5" />, title: 'Privacidad en la UI', desc: 'Nada de datos sensibles por IDs, errores o pantallas sin permiso.' },
    ], []);

    const guarantees = useMemo(() => [
        'Roles y permisos claros',
        'Datos aislados por empresa',
        'JWT y sesiones seguras',
        'Validaciones server-side',
        'Buenas prácticas de despliegue',
    ], []);

    return (
        <section className="relative z-[999] bg-white px-20 py-20 max-[1100px]:px-10 max-[900px]:px-6 overflow-hidden">

            {/* ── Header ── */}
            <div className="relative flex flex-col gap-4 max-w-[720px] mb-12">
                <Pill>Seguridad</Pill>
                <h2 className="text-text-primary font-bold text-5xl leading-[1.1] max-[900px]:text-4xl max-[520px]:text-[28px]">
                    Seguridad integrada{' '}
                    <span className="text-primary">desde el inicio</span>
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed max-[900px]:text-base max-w-[560px]">
                    No añadimos seguridad al final. La construimos desde la base: arquitectura, permisos, datos y despliegue.
                </p>
            </div>

            {/* ── Content ── */}
            <div className="relative grid grid-cols-12 gap-8 max-[1100px]:gap-6 items-start">

                {/* Principles */}
                <div className="col-span-5 max-[1100px]:col-span-12 flex flex-col gap-3">
                    <p className="font-bold text-text-primary mb-1">Cómo protegemos tu proyecto</p>
                    {principles.map((p) => (
                        <PrincipleCard key={p.title} {...p} />
                    ))}
                </div>

                {/* Imagen estratégica grande */}
                <div className="col-span-7 max-[1100px]:col-span-12">
                    <div className="relative rounded-3xl overflow-hidden w-full h-[520px] max-[1100px]:h-[420px] max-[700px]:h-[320px]">

                        {/* Imagen de fondo */}
                        {/* 🔁 Reemplaza src por tu imagen real */}
                        <img
                            src={securityImg}
                            alt="Seguridad en NovaForge"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Overlay degradado */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Texto estratégico sobre la imagen */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 max-[700px]:p-6 flex flex-col gap-4">
                            <p className="text-white font-bold text-3xl max-[700px]:text-2xl leading-tight">
                                Tu producto, protegido.<br />
                                <span style={{ color: '#36DBBA' }}>Sin compromisos.</span>
                            </p>
                            <p className="text-white/70 text-sm leading-relaxed max-w-[420px]">
                                Cada línea de código que escribimos tiene en cuenta la seguridad.
                                No es un extra — es el estándar con el que operamos desde el día uno.
                            </p>

                            {/* Garantías */}
                            <div className="flex flex-wrap gap-2 mt-1">
                                {guarantees.map((g) => (
                                    <Guarantee key={g} text={g} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}