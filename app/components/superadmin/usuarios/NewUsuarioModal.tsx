'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, Eye, EyeOff, Loader2, UserPlus, X } from 'lucide-react';

import { usuarioApi } from '@/app/api/usuarios/usuario.api';
import type { RolGlobal, UsuarioListItem } from '@/app/api/usuarios/usuario.api';

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
    const vclass =
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
                vclass,
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

function TextInput({
    value,
    onChange,
    placeholder,
    disabled,
    type = 'text',
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
    type?: string;
}) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            type={type}
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

function SelectInput({
    value,
    onChange,
    disabled,
    children,
}: {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={cx(
                'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm',
                'outline-none transition',
                'border-[#DDEBE6] hover:border-[#BEE7DC]',
                'focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25',
                'disabled:cursor-not-allowed disabled:opacity-60'
            )}
        >
            {children}
        </select>
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
                className="absolute inset-0 bg-black/25 backdrop-blur-[8px]"
                onMouseDown={() => {
                    if (!preventClose) onClose();
                }}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    className={cx(
                        'w-full max-w-xl rounded-3xl border bg-white',
                        'border-[#DDEBE6]',
                        'shadow-[0_24px_80px_rgba(0,0,0,0.18)]'
                    )}
                    onMouseDown={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                >
                    <div className="flex items-start justify-between gap-4 border-b px-6 py-5 border-[#DDEBE6]">
                        <div className="min-w-0">
                            <div className="text-base font-semibold tracking-tight text-[#2B2E31]">{title}</div>
                            {description ? <div className="mt-1 text-sm text-[#8A8F93]">{description}</div> : null}
                        </div>
                        <IconButton
                            onClick={() => {
                                if (!preventClose) onClose();
                            }}
                            title="Cerrar"
                            variant="neutral"
                            disabled={preventClose}
                        >
                            <X className="h-4 w-4" />
                        </IconButton>
                    </div>

                    <div className="px-6 py-5">{children}</div>

                    {footer ? (
                        <div className="flex items-center justify-end gap-2 border-t bg-[#E9F7F3]/35 px-6 py-4 border-[#DDEBE6]">
                            {footer}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

type CreateForm = {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    rolGlobal: RolGlobal;

    // ✅ NUEVO
    password: string;
};

export default function NewUsuarioModal({
    open,
    onClose,
    onCreated,
}: {
    open: boolean;
    onClose: () => void;
    onCreated: (usuario: UsuarioListItem) => void;
}) {
    const [form, setForm] = useState<CreateForm>({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        rolGlobal: 'USUARIO',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        setForm({
            nombre: '',
            apellido: '',
            correo: '',
            telefono: '',
            rolGlobal: 'USUARIO',
            password: '',
        });
        setShowPassword(false);
        setError(null);
        setSaving(false);
    }, [open]);

    const passwordOk = useMemo(() => {
        return form.password.trim().length >= 8;
    }, [form.password]);

    const canSave = useMemo(() => {
        if (!form.nombre.trim()) return false;
        if (!form.apellido.trim()) return false;
        if (!form.correo.trim()) return false;
        if (!passwordOk) return false;
        return true;
    }, [form, passwordOk]);

    async function handleCreate() {
        setError(null);

        if (!canSave) {
            setError('Completa nombre, apellido, correo y una contraseña (mínimo 8 caracteres).');
            return;
        }

        setSaving(true);
        try {
            const created = await usuarioApi.create({
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim(),
                correo: form.correo.trim().toLowerCase(),
                ...(form.telefono.trim() ? { telefono: form.telefono.trim() } : {}),
                rolGlobal: form.rolGlobal,

                // ✅ NUEVO
                password: form.password,
            });

            onClose();
            onCreated(created);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudo crear el usuario.');
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
            preventClose={saving}
            title="Nuevo usuario"
            description="Crear usuario (cliente o staff). La empresa se crea luego desde su ficha."
            footer={
                <>
                    <GhostButton onClick={onClose} disabled={saving}>
                        Cancelar
                    </GhostButton>
                    <PrimaryButton onClick={handleCreate} disabled={saving || !canSave}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                        Crear usuario
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
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Nombre</label>
                    <TextInput
                        value={form.nombre}
                        onChange={(v) => setForm((p) => ({ ...p, nombre: v }))}
                        placeholder="Juan"
                        disabled={saving}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Apellido</label>
                    <TextInput
                        value={form.apellido}
                        onChange={(v) => setForm((p) => ({ ...p, apellido: v }))}
                        placeholder="Pérez"
                        disabled={saving}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Correo</label>
                    <TextInput
                        value={form.correo}
                        onChange={(v) => setForm((p) => ({ ...p, correo: v }))}
                        placeholder="correo@empresa.com"
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

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Rol</label>
                    <SelectInput
                        value={form.rolGlobal}
                        onChange={(v) => setForm((p) => ({ ...p, rolGlobal: v as RolGlobal }))}
                        disabled={saving}
                    >
                        <option value="USUARIO">USUARIO (cliente)</option>
                        <option value="ADMIN">ADMIN (staff)</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    </SelectInput>

                    <div className="mt-2 text-xs text-[#8A8F93]">
                        Recomendación: crea clientes como <span className="font-semibold text-[#2B2E31]">USUARIO</span>.
                    </div>
                </div>

                {/* ✅ NUEVO: Contraseña */}
                <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Contraseña</label>

                    <div className="relative">
                        <input
                            value={form.password}
                            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                            placeholder="Mínimo 8 caracteres"
                            disabled={saving}
                            type={showPassword ? 'text' : 'password'}
                            className={cx(
                                'w-full rounded-xl border bg-white px-3.5 py-2.5 pr-12 text-sm text-[#2B2E31] shadow-sm',
                                'placeholder:text-[#8A8F93]',
                                'outline-none transition',
                                'border-[#DDEBE6] hover:border-[#BEE7DC]',
                                'focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25',
                                'disabled:cursor-not-allowed disabled:opacity-60'
                            )}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            disabled={saving}
                            className={cx(
                                'absolute right-2 top-1/2 -translate-y-1/2',
                                'inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-white shadow-sm transition',
                                'border-[#DDEBE6] hover:bg-[#F2F4F5] hover:border-[#CFE4DD]',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                                'disabled:cursor-not-allowed disabled:opacity-60'
                            )}
                            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs">
                        {passwordOk ? (
                            <>
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E9F7F3] text-[#1F3D3A] border border-[#CDEFE6]">
                                    <Check className="h-3.5 w-3.5" />
                                </span>
                                <span className="text-[#1F3D3A] font-medium">Contraseña válida</span>
                            </>
                        ) : (
                            <span className="text-[#8A8F93]">Debe tener al menos 8 caracteres.</span>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2 rounded-2xl border border-[#DDEBE6] bg-white p-3 text-sm text-[#8A8F93]">
                    Nota: esta contraseña se guarda como <b>hash</b> en el servidor.
                </div>
            </div>
        </ModalShell>
    );
}
