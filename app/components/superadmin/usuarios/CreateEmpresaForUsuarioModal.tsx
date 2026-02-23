'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Check, Loader2, X } from 'lucide-react';

import { usuarioApi } from '@/app/api/usuarios/usuario.api';

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(' ');
}

function IconButton({
    onClick,
    title,
    disabled,
    children,
    variant = 'neutral',
}: {
    onClick?: () => void;
    title?: string;
    disabled?: boolean;
    children: React.ReactNode;
    variant?: 'neutral' | 'brand';
}) {
    const v =
        variant === 'brand'
            ? cx(
                'border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A]',
                'hover:bg-[#DFF3ED] hover:border-[#BEE7DC]'
            )
            : cx(
                'border-[#DDEBE6] bg-white text-[#2B2E31]',
                'hover:bg-[#F2F4F5] hover:border-[#CFE4DD]'
            );

    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={cx(
                'inline-flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition',
                v,
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                'active:translate-y-[1px]',
                'disabled:cursor-not-allowed disabled:opacity-60'
            )}
        >
            {children}
        </button>
    );
}

function GhostButton({
    onClick,
    disabled,
    children,
}: {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cx(
                'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold',
                'border-[#CDEFE6] bg-white text-[#1F3D3A]',
                'shadow-sm transition',
                'hover:bg-[#E9F7F3] hover:border-[#BEE7DC]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                'active:translate-y-[1px]',
                'disabled:cursor-not-allowed disabled:opacity-60'
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
}: {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
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
                'disabled:cursor-not-allowed disabled:opacity-60'
            )}
        >
            {children}
        </button>
    );
}

function ModalShell({
    open,
    title,
    description,
    onClose,
    children,
    footer,
}: {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
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
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[8px]" onMouseDown={onClose} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    className={cx(
                        'w-full max-w-2xl rounded-3xl border bg-white',
                        'border-[#DDEBE6]',
                        'shadow-[0_24px_80px_rgba(0,0,0,0.18)]'
                    )}
                    onMouseDown={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                >
                    <div className="flex items-start justify-between gap-4 border-b border-[#DDEBE6] px-6 py-5">
                        <div className="min-w-0">
                            <div className="text-base font-semibold tracking-tight text-[#2B2E31]">{title}</div>
                            {description ? <div className="mt-1 text-sm text-[#8A8F93]">{description}</div> : null}
                        </div>
                        <IconButton onClick={onClose} title="Cerrar" variant="neutral">
                            <X className="h-4 w-4" />
                        </IconButton>
                    </div>

                    <div className="px-6 py-5">{children}</div>

                    {footer ? (
                        <div className="flex items-center justify-end gap-2 border-t border-[#DDEBE6] bg-[#E9F7F3]/35 px-6 py-4">
                            {footer}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function TextInput({
    value,
    onChange,
    placeholder,
    disabled,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
}) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cx(
                'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm',
                'placeholder:text-[#8A8F93]',
                'outline-none transition',
                'border-[#DDEBE6] hover:border-[#BEE7DC]',
                'focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25',
                'disabled:cursor-not-allowed disabled:opacity-60'
            )}
        />
    );
}

export type CreateEmpresaForm = {
    nombre: string;
    cif: string;
    correo: string;
    telefono: string;
};

export default function CreateEmpresaForUsuarioModal({
    open,
    onClose,
    usuarioId,
    usuarioCorreo,
    onCreated,
}: {
    open: boolean;
    onClose: () => void;
    usuarioId: string;
    usuarioCorreo?: string | null;
    onCreated: () => Promise<void> | void;
}) {
    const [form, setForm] = useState<CreateEmpresaForm>({
        nombre: '',
        cif: '',
        correo: '',
        telefono: '',
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        setForm({ nombre: '', cif: '', correo: '', telefono: '' });
        setError(null);
        setSaving(false);
    }, [open]);

    const canSave = useMemo(() => !!form.nombre.trim(), [form.nombre]);

    async function submit() {
        setError(null);

        if (!canSave) {
            setError('El nombre es obligatorio.');
            return;
        }

        setSaving(true);
        try {
            await usuarioApi.createEmpresaForUsuario(usuarioId, {
                nombre: form.nombre.trim(),
                ...(form.cif.trim() ? { cif: form.cif.trim() } : {}),
                ...(form.correo.trim() ? { correo: form.correo.trim() } : {}),
                ...(form.telefono.trim() ? { telefono: form.telefono.trim() } : {}),
            });

            onClose();
            await onCreated();
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudo crear la empresa.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <ModalShell
            open={open}
            onClose={() => {
                if (saving) return;
                onClose();
            }}
            title="Crear empresa"
            description={usuarioCorreo ? `Se asignará al usuario ${usuarioCorreo}` : 'Se asignará al usuario seleccionado.'}
            footer={
                <>
                    <GhostButton onClick={onClose} disabled={saving}>
                        Cancelar
                    </GhostButton>

                    <PrimaryButton onClick={submit} disabled={saving || !canSave}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Crear empresa
                    </PrimaryButton>
                </>
            }
        >
            {error ? (
                <div className="mb-4 rounded-2xl border border-[#F3C6CE] bg-[#FFECEF] p-3 text-sm text-[#7B1E2B]">
                    {error}
                </div>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Nombre *</label>
                    <TextInput
                        value={form.nombre}
                        onChange={(v) => setForm((p) => ({ ...p, nombre: v }))}
                        placeholder="Empresa S.L."
                        disabled={saving}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">CIF (opcional)</label>
                    <TextInput
                        value={form.cif}
                        onChange={(v) => setForm((p) => ({ ...p, cif: v }))}
                        placeholder="B12345678"
                        disabled={saving}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Teléfono (opcional)</label>
                    <TextInput
                        value={form.telefono}
                        onChange={(v) => setForm((p) => ({ ...p, telefono: v }))}
                        placeholder="+34…"
                        disabled={saving}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Correo empresa (opcional)</label>
                    <TextInput
                        value={form.correo}
                        onChange={(v) => setForm((p) => ({ ...p, correo: v }))}
                        placeholder="contacto@empresa.com"
                        disabled={saving}
                    />
                </div>

                <div className="md:col-span-2 rounded-2xl border border-[#DDEBE6] bg-white p-3 text-sm text-[#8A8F93]">
                    <div className="inline-flex items-center gap-2 font-semibold text-[#2B2E31]">
                        <Building2 className="h-4 w-4 text-[#8A8F93]" />
                        Reglas
                    </div>
                    <div className="mt-2">
                        Un usuario solo puede tener <b>una</b> empresa. Si ya existe, el servidor rechazará la operación.
                    </div>
                </div>
            </div>
        </ModalShell>
    );
}
