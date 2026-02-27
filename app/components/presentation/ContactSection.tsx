'use client';

import React, { useMemo, useState } from 'react';
import { MessageCircle, Send, Mail, User, Layers, Text, DollarSign } from 'lucide-react';

const WHATSAPP_PHONE = '34604894472';

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl border border-secondary/30 bg-secondary/5">
            <MessageCircle className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold text-text-secondary">{children}</span>
        </span>
    );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-text-secondary">{label}</span>
            <div className="rounded-3xl border border-secondary/20 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
                <div className="text-secondary shrink-0">{icon}</div>
                <div className="flex-1">{children}</div>
            </div>
        </label>
    );
}

const MONEDAS = [
    { value: 'EUR', symbol: '€', label: '€ Euro' },
    { value: 'DOP', symbol: 'RD$', label: 'RD$ Peso dominicano' },
];

function buildWhatsAppMessage(data: { nombre: string; email: string; servicio: string; presupuesto: string; moneda: string; mensaje: string }) {
    const moneda = MONEDAS.find(m => m.value === data.moneda);
    return [
        'Hola NovaForge 👋',
        '',
        'Quiero solicitar información / presupuesto:',
        `• Nombre: ${data.nombre || '—'}`,
        `• Email: ${data.email || '—'}`,
        `• Servicio: ${data.servicio || '—'}`,
        `• Presupuesto estimado: ${data.presupuesto ? `${moneda?.symbol}${data.presupuesto}` : '—'}`,
        '',
        'Mensaje:',
        data.mensaje || '—',
    ].join('\n');
}

export default function ContactSection() {
    const servicios = useMemo(() => [
        'Landing page', 'Web completa por secciones', 'Dashboard',
        'App simple', 'App normal', 'App compleja', 'E-commerce',
        'Ficha de Google (GBP)', 'Diseño UI/UX', 'Tarjetas empresariales',
        'Página con animaciones', 'Otro',
    ], []);

    const [form, setForm] = useState({
        nombre: '', email: '',
        servicio: 'Landing page',
        presupuesto: '',
        moneda: 'EUR',
        mensaje: '',
    });
    const [error, setError] = useState<string | null>(null);

    function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
        setForm((p) => ({ ...p, [key]: value }));
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!form.nombre.trim()) return setError('Por favor, escribe tu nombre.');
        if (!form.email.trim()) return setError('Por favor, escribe tu email.');
        if (!form.mensaje.trim()) return setError('Cuéntanos brevemente qué necesitas.');
        const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(buildWhatsAppMessage(form))}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    const monedaActual = MONEDAS.find(m => m.value === form.moneda)!;

    return (
        <section className="relative z-[999] bg-white/0 px-20 py-20 max-[1100px]:px-10 max-[900px]:px-6">

            {/* Header */}
            <div className="flex flex-col items-center gap-4 text-center mb-16">
                <Pill>Contacto</Pill>
                <h2 className="text-text-primary font-bold text-5xl leading-[1.1] max-[900px]:text-4xl max-[520px]:text-[28px]">
                    Hablemos y te enviamos una <span className="text-primary">propuesta</span>
                </h2>
                <p className="text-text-secondary text-xl leading-relaxed max-w-[760px] max-[900px]:text-base">
                    Rellena el formulario y se abrirá WhatsApp con el mensaje listo para enviar. Sin compromiso.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-12 gap-10 max-[1100px]:gap-8 items-start max-w-[1100px] mx-auto">

                {/* Form */}
                <div className="col-span-7 max-[1100px]:col-span-12">
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">

                        <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
                            <Field label="Tu nombre" icon={<User className="w-4 h-4" />}>
                                <input
                                    value={form.nombre}
                                    onChange={(e) => update('nombre', e.target.value)}
                                    placeholder="Ej: Carlos Pérez"
                                    className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-secondary/50 text-sm"
                                />
                            </Field>
                            <Field label="Email" icon={<Mail className="w-4 h-4" />}>
                                <input
                                    value={form.email}
                                    onChange={(e) => update('email', e.target.value)}
                                    placeholder="carlos@email.com"
                                    className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-secondary/50 text-sm"
                                />
                            </Field>
                        </div>

                        <Field label="Servicio" icon={<Layers className="w-4 h-4" />}>
                            <select
                                value={form.servicio}
                                onChange={(e) => update('servicio', e.target.value)}
                                className="w-full bg-transparent outline-none text-text-primary text-sm"
                            >
                                {servicios.map((s) => <option key={s} value={s} className="text-black">{s}</option>)}
                            </select>
                        </Field>

                        {/* Presupuesto manual + moneda */}
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-text-secondary">Presupuesto estimado</span>
                            <div className="rounded-3xl border border-secondary/20 bg-white shadow-sm flex items-center overflow-hidden">

                                {/* Selector de moneda */}
                                <div className="flex items-center gap-1 pl-4 pr-3 border-r border-secondary/20 shrink-0">
                                    <DollarSign className="w-4 h-4 text-secondary" />
                                    <select
                                        value={form.moneda}
                                        onChange={(e) => update('moneda', e.target.value)}
                                        className="bg-transparent outline-none text-text-primary text-sm font-semibold cursor-pointer pr-1"
                                    >
                                        {MONEDAS.map(m => (
                                            <option key={m.value} value={m.value} className="text-black">{m.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Prefijo símbolo */}
                                <span className="pl-4 text-sm font-semibold text-text-secondary shrink-0">
                                    {monedaActual.symbol}
                                </span>

                                {/* Input numérico */}
                                <input
                                    type="number"
                                    min="0"
                                    value={form.presupuesto}
                                    onChange={(e) => update('presupuesto', e.target.value)}
                                    placeholder="Ej: 1500"
                                    className="flex-1 px-3 py-3 bg-transparent outline-none text-text-primary placeholder:text-text-secondary/50 text-sm"
                                />
                            </div>
                        </div>

                        <Field label="Mensaje" icon={<Text className="w-4 h-4" />}>
                            <textarea
                                value={form.mensaje}
                                onChange={(e) => update('mensaje', e.target.value)}
                                placeholder="Cuéntanos qué necesitas, plazos, referencias, etc."
                                rows={5}
                                className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-secondary/50 resize-none text-sm"
                            />
                        </Field>

                        {error && (
                            <div className="rounded-3xl border border-red-400/30 bg-red-50 px-5 py-3">
                                <p className="text-sm font-semibold text-red-600">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="cursor-pointer w-full py-3.5 px-5 bg-primary text-white font-bold rounded-3xl flex gap-2 items-center justify-center transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
                        >
                            Enviar por WhatsApp <Send className="w-5 h-5" />
                        </button>

                        <p className="text-xs text-text-secondary text-center leading-relaxed">
                            Al enviar, se abrirá WhatsApp con el texto preparado. Puedes editarlo antes de enviar.
                        </p>
                    </form>
                </div>

                {/* Side info */}
                <div className="col-span-5 max-[1100px]:col-span-12 flex flex-col gap-4">
                    <div className="rounded-3xl border border-secondary/20 bg-secondary/5 px-6 py-5 flex flex-col gap-3">
                        <p className="font-bold text-text-primary">¿Por qué WhatsApp?</p>
                        <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                            <li className="flex items-start gap-2"><span className="text-primary font-bold mt-0.5">→</span> Respuesta en menos de 24h</li>
                            <li className="flex items-start gap-2"><span className="text-primary font-bold mt-0.5">→</span> Propuesta personalizada sin compromiso</li>
                            <li className="flex items-start gap-2"><span className="text-primary font-bold mt-0.5">→</span> Comunicación directa y ágil</li>
                            <li className="flex items-start gap-2"><span className="text-primary font-bold mt-0.5">→</span> Puedes compartir referencias e imágenes</li>
                        </ul>
                    </div>

                    {/* Info monedas */}
                    <div className="rounded-3xl border border-secondary/20 bg-white px-6 py-5 flex flex-col gap-3">
                        <p className="font-bold text-text-primary text-sm">Monedas aceptadas</p>
                        <div className="flex flex-col gap-2">
                            {MONEDAS.map(m => (
                                <div key={m.value} className="flex items-center gap-2 text-sm text-text-secondary">
                                    <span className="font-bold text-primary w-8">{m.symbol}</span>
                                    <span>{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}