'use client';

import React, { useEffect, useState } from 'react';
import { Check, FileText, Loader2, Pencil, User2, X } from 'lucide-react';

import { proyectoApi } from '@/app/api/proyectos/proyecto.api';
import type { TipoProyecto } from '@/app/api/proyectos/proyecto.api';

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(' ');
}

function Badge({
    children,
    tone = 'neutral',
}: {
    children: React.ReactNode;
    tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
}) {
    const tones: Record<string, string> = {
        neutral: 'border-[#DDEBE6] bg-white text-[#2B2E31] ring-1 ring-inset ring-[#DDEBE6]',
        brand: 'border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] ring-1 ring-inset ring-[#CDEFE6]',
        success: 'border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] ring-1 ring-inset ring-[#CDEFE6]',
        warning: 'border-[#EBD9B6] bg-[#FFF6DF] text-[#6A4A12] ring-1 ring-inset ring-[#EBD9B6]',
        danger: 'border-[#F3C6CE] bg-[#FFECEF] text-[#7B1E2B] ring-1 ring-inset ring-[#F3C6CE]',
    };

    return (
        <span
            className={cx(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                'shadow-[0_1px_0_rgba(0,0,0,0.02)]',
                tones[tone]
            )}
        >
            {children}
        </span>
    );
}

function GhostButton({
    onClick,
    disabled,
    children,
    className,
}: {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cx(
                'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold',
                'border-[#CDEFE6] bg-white text-[#1F3D3A] shadow-sm transition',
                'hover:bg-[#E9F7F3] hover:border-[#BEE7DC]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                'active:translate-y-[1px]',
                'disabled:cursor-not-allowed disabled:opacity-60',
                className ?? ''
            )}
        >
            {children}
        </button>
    );
}

function PrimaryButton({
    onClick,
    disabled,
    children,
    className,
}: {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cx(
                'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
                'bg-[#6FCFBA] text-[#1F3D3A]',
                'shadow-[0_10px_22px_rgba(111,207,186,0.28)]',
                'transition',
                'hover:brightness-[0.98] hover:shadow-[0_12px_26px_rgba(111,207,186,0.34)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                'active:translate-y-[1px]',
                'disabled:cursor-not-allowed disabled:opacity-60',
                className ?? ''
            )}
        >
            {children}
        </button>
    );
}

function Input({
    value,
    onChange,
    placeholder,
    leftIcon,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    leftIcon?: React.ReactNode;
}) {
    return (
        <div className="relative">
            {leftIcon ? (
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8F93]">
                    {leftIcon}
                </div>
            ) : null}
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cx(
                    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm',
                    leftIcon ? 'pl-10.5' : '',
                    'placeholder:text-[#8A8F93]',
                    'outline-none transition',
                    'border-[#DDEBE6] hover:border-[#BEE7DC]',
                    'focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25'
                )}
            />
        </div>
    );
}

function ModalShell({
    open,
    title,
    description,
    onClose,
    children,
    footer,
    preventClose,
}: {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    preventClose?: boolean;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
                onMouseDown={() => {
                    if (!preventClose) onClose();
                }}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    className={cx(
                        'w-full max-w-2xl rounded-3xl border bg-white shadow-2xl',
                        'border-[#DDEBE6]'
                    )}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between gap-3 border-b border-[#DDEBE6] px-5 py-4">
                        <div className="min-w-0">
                            <div className="text-base font-semibold text-[#2B2E31]">{title}</div>
                            {description ? (
                                <div className="mt-1 text-sm text-[#8A8F93]">{description}</div>
                            ) : null}
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                if (!preventClose) onClose();
                            }}
                            className={cx(
                                'inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-[#2B2E31] shadow-sm transition',
                                'border-[#DDEBE6] hover:bg-[#F2F4F5]',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                                'active:translate-y-[1px]',
                                preventClose ? 'opacity-60 cursor-not-allowed' : ''
                            )}
                            title="Cerrar"
                            disabled={preventClose}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="px-5 py-4">{children}</div>

                    {footer ? (
                        <div className="flex items-center justify-end gap-2 border-t border-[#DDEBE6] px-5 py-4">
                            {footer}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function CheckboxRow({
    checked,
    onChange,
    title,
    desc,
    icon,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    title: string;
    desc: string;
    icon: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cx(
                'flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition',
                checked
                    ? 'border-[#CDEFE6] bg-[#E9F7F3]/35'
                    : 'border-[#DDEBE6] bg-white hover:bg-[#F2F4F5]'
            )}
        >
            <span
                className={cx(
                    'mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl border shadow-sm',
                    checked
                        ? 'border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A]'
                        : 'border-[#DDEBE6] bg-white text-[#8A8F93]'
                )}
            >
                {icon}
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-bold text-[#2B2E31]">{title}</div>
                    <Badge tone={checked ? 'success' : 'neutral'}>
                        {checked ? (
                            <span className="inline-flex items-center gap-1">
                                <Check className="h-3.5 w-3.5" /> Incluir
                            </span>
                        ) : (
                            'Omitir'
                        )}
                    </Badge>
                </div>
                <div className="mt-1 text-sm text-[#8A8F93]">{desc}</div>
            </div>
        </button>
    );
}

export function NewProyectoModal({
    open,
    onClose,
    empresaId,
    empresaNombre,
    onCreated,
}: {
    open: boolean;
    onClose: () => void;
    empresaId: string;
    empresaNombre?: string;
    onCreated: (proyectoId: string, selected: { req: boolean; pres: boolean; fases: boolean; facturas: boolean }) => void;
}) {
    const [step, setStep] = useState<1 | 2>(1);

    const [newNombre, setNewNombre] = useState('');
    const [newTipo, setNewTipo] = useState<TipoProyecto>('WEB');
    const [newDescripcion, setNewDescripcion] = useState('');

    const [err, setErr] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const [fillReq, setFillReq] = useState(true);
    const [fillPres, setFillPres] = useState(true);
    const [fillFases, setFillFases] = useState(true);
    const [fillFacturas, setFillFacturas] = useState(false);

    // Reset cuando se abre
    useEffect(() => {
        if (!open) return;
        setStep(1);
        setNewNombre('');
        setNewTipo('WEB');
        setNewDescripcion('');
        setErr(null);
        setCreating(false);

        setFillReq(true);
        setFillPres(true);
        setFillFases(true);
        setFillFacturas(false);
    }, [open]);

    function safeClose() {
        if (creating) return;
        onClose();
    }

    async function createAndContinue() {
        setErr(null);

        if (!newNombre.trim()) {
            setErr('El nombre del proyecto es obligatorio.');
            return;
        }

        setCreating(true);
        try {
            const { proyecto } = await proyectoApi.createForEmpresa(empresaId, {
                nombre: newNombre.trim(),
                tipo: newTipo,
                ...(newDescripcion.trim() ? { descripcion: newDescripcion.trim() } : {}),
            });

            onClose();
            onCreated(proyecto.id, { req: fillReq, pres: fillPres, fases: fillFases, facturas: fillFacturas });
        } catch (e: any) {
            setErr(e?.response?.data?.message ?? 'No se pudo crear el proyecto.');
        } finally {
            setCreating(false);
        }
    }

    return (
        <ModalShell
            open={open}
            onClose={safeClose}
            preventClose={creating}
            title={step === 1 ? 'Nuevo proyecto' : 'Configuración inicial'}
            description={
                step === 1
                    ? `Crear un proyecto para ${empresaNombre ?? 'esta empresa'}`
                    : 'Elige qué secciones quieres completar a continuación.'
            }
            footer={
                <>
                    <GhostButton
                        onClick={() => {
                            if (creating) return;
                            if (step === 1) safeClose();
                            else setStep(1);
                        }}
                        disabled={creating}
                    >
                        {step === 1 ? 'Cerrar' : 'Atrás'}
                    </GhostButton>

                    {step === 1 ? (
                        <PrimaryButton
                            onClick={() => {
                                setErr(null);
                                if (!newNombre.trim()) {
                                    setErr('El nombre del proyecto es obligatorio.');
                                    return;
                                }
                                setStep(2);
                            }}
                            disabled={creating}
                        >
                            Siguiente
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton onClick={createAndContinue} disabled={creating}>
                            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Crear y continuar
                        </PrimaryButton>
                    )}
                </>
            }
        >
            <div className="space-y-3">
                {err ? (
                    <div className="rounded-2xl border border-[#F3C6CE] bg-[#FFECEF] p-3 text-sm text-[#7B1E2B]">
                        {err}
                    </div>
                ) : null}

                {step === 1 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Nombre</div>
                            <div className="mt-2">
                                <Input value={newNombre} onChange={setNewNombre} placeholder="Ej: Web corporativa" />
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Tipo</div>
                            <div className="mt-2">
                                <select
                                    className={cx(
                                        'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm',
                                        'border-[#DDEBE6] hover:border-[#BEE7DC]',
                                        'focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25',
                                        'outline-none transition'
                                    )}
                                    value={newTipo}
                                    onChange={(e) => setNewTipo(e.target.value as TipoProyecto)}
                                >
                                    <option value="WEB">WEB</option>
                                    <option value="APP">APP</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Descripción</div>
                            <div className="mt-2">
                                <textarea
                                    className={cx(
                                        'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm',
                                        'border-[#DDEBE6] hover:border-[#BEE7DC]',
                                        'focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25',
                                        'outline-none transition'
                                    )}
                                    rows={4}
                                    value={newDescripcion}
                                    onChange={(e) => setNewDescripcion(e.target.value)}
                                    placeholder="Notas o alcance… (opcional)"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="text-sm font-semibold text-[#2B2E31]">Secciones a completar</div>

                        <CheckboxRow
                            checked={fillReq}
                            onChange={setFillReq}
                            title="Requisitos"
                            desc="Brief inicial: logo, copy, dominio, SEO, notas…"
                            icon={<FileText className="h-4 w-4" />}
                        />

                        <CheckboxRow
                            checked={fillPres}
                            onChange={setFillPres}
                            title="Presupuesto"
                            desc="Crear o revisar presupuesto y dejarlo listo para aceptar."
                            icon={<Check className="h-4 w-4" />}
                        />

                        <CheckboxRow
                            checked={fillFases}
                            onChange={setFillFases}
                            title="Fases"
                            desc="Definir fases del proyecto (1:N) y su orden."
                            icon={<Pencil className="h-4 w-4" />}
                        />

                        <CheckboxRow
                            checked={fillFacturas}
                            onChange={setFillFacturas}
                            title="Facturas"
                            desc="Crear facturas por fase (normalmente después de aceptar presupuesto)."
                            icon={<User2 className="h-4 w-4" />}
                        />

                        <div className="rounded-2xl border border-[#DDEBE6] bg-white p-3 text-sm text-[#8A8F93]">
                            Al crear, te llevaremos al detalle del proyecto para completar las secciones seleccionadas.
                        </div>
                    </div>
                )}
            </div>
        </ModalShell>
    );
}
