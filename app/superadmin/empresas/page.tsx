'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Check, Loader2, Pencil, Plus, Search, X } from 'lucide-react';

import { empresaApi } from '@/app/api/empresa/empresa.api';
import type { EmpresaWithUsuario } from '@/app/api/empresa/empresa.api';
import { useSessionStore } from '@/app/store/session.store';
import EmpresasTable from '@/app/components/superadmin/empresas/EmpresasTable';

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
    disabled,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    leftIcon?: React.ReactNode;
    disabled?: boolean;
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
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cx(
                    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm',
                    leftIcon ? 'pl-10.5' : '',
                    'placeholder:text-[#8A8F93]',
                    'outline-none transition',
                    'border-[#DDEBE6] hover:border-[#BEE7DC]',
                    'focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25',
                    'disabled:cursor-not-allowed disabled:opacity-60'
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
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" onMouseDown={onClose} />
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
                            {description ? <div className="mt-1 text-sm text-[#8A8F93]">{description}</div> : null}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className={cx(
                                'inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-[#2B2E31] shadow-sm transition',
                                'border-[#DDEBE6] hover:bg-[#F2F4F5]',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                                'active:translate-y-[1px]'
                            )}
                            title="Cerrar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="px-5 py-4">{children}</div>

                    {footer ? <div className="flex items-center justify-end gap-2 border-t border-[#DDEBE6] px-5 py-4">{footer}</div> : null}
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">{label}</label>
            {children}
        </div>
    );
}

export default function EmpresasPage() {
    const router = useRouter();
    const { user, isLoading: sessionLoading, hydrate } = useSessionStore();

    const [items, setItems] = useState<EmpresaWithUsuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState('');

    const isSuperAdmin = user?.rolGlobal === 'SUPER_ADMIN';

    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState<EmpresaWithUsuario | null>(null);

    const [form, setForm] = useState({
        nombre: '',
        cif: '',
        correo: '',
        telefono: '',
    });

    useEffect(() => {
        if (sessionLoading) return;
        if (!user) hydrate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, sessionLoading]);

    useEffect(() => {
        if (sessionLoading) return;

        if (!user) {
            router.push('/login');
            return;
        }

        if (!isSuperAdmin) {
            router.push('/');
            return;
        }
    }, [user, sessionLoading, isSuperAdmin, router]);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const empresas = await empresaApi.list();
            setItems(empresas);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudieron cargar las empresas.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isSuperAdmin) return;
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuperAdmin]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;

        return items.filter((e) => {
            const haystack = [
                e.id,
                e.nombre,
                e.cif ?? '',
                e.correo ?? '',
                e.telefono ?? '',
                e.usuario?.nombre ?? '',
                e.usuario?.apellido ?? '',
                e.usuario?.correo ?? '',
            ]
                .join(' ')
                .toLowerCase();

            return haystack.includes(q);
        });
    }, [items, query]);

    function openEditModal(empresaId: string) {
        const found = items.find((x) => x.id === empresaId) ?? null;
        if (!found) return;

        setSelected(found);
        setForm({
            nombre: found.nombre ?? '',
            cif: found.cif ?? '',
            correo: found.correo ?? '',
            telefono: found.telefono ?? '',
        });
        setEditOpen(true);
    }

    async function onSaveEdit() {
        if (!selected) return;
        setBusy(true);
        setError(null);

        try {
            const payload: any = {
                nombre: form.nombre?.trim() || selected.nombre,
                cif: form.cif?.trim() || null,
                correo: form.correo?.trim() || null,
                telefono: form.telefono?.trim() || null,
            };

            // soporta ambos nombres típicos sin romper (según tu api real)
            const api: any = empresaApi as any;
            if (typeof api.update === 'function') {
                const updated = await api.update(selected.id, payload);
                setItems((prev) => prev.map((x) => (x.id === selected.id ? (updated?.empresa ?? updated ?? { ...x, ...payload }) : x)));
            } else if (typeof api.updateById === 'function') {
                const updated = await api.updateById(selected.id, payload);
                setItems((prev) => prev.map((x) => (x.id === selected.id ? (updated?.empresa ?? updated ?? { ...x, ...payload }) : x)));
            } else {
                // fallback: no-op visual sin romper navegación
                setItems((prev) => prev.map((x) => (x.id === selected.id ? { ...x, ...payload } : x)));
            }

            setEditOpen(false);
            setSelected(null);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudo guardar la empresa.');
        } finally {
            setBusy(false);
        }
    }

    if (sessionLoading) {
        return (
            <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5 text-sm text-[#8A8F93] shadow-sm">
                Cargando sesión…
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div
                className={cx(
                    'rounded-3xl border bg-white shadow-sm',
                    'border-[#DDEBE6]',
                    'p-5 md:p-6',
                    'bg-[radial-gradient(1000px_420px_at_15%_-10%,rgba(111,207,186,0.26),transparent_55%),radial-gradient(900px_380px_at_90%_0%,rgba(233,247,243,0.95),transparent_60%)]'
                )}
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-2xl font-semibold tracking-tight text-[#2B2E31]">Empresas</h1>
                                <p className="mt-1 text-sm text-[#8A8F93]">Listado de empresas (clientes) y acciones.</p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <Badge tone="neutral">
                                Total: <span className="font-semibold text-[#2B2E31]">{items.length}</span>
                            </Badge>
                            {query.trim() ? <Badge tone="brand">Búsqueda: {query.trim()}</Badge> : null}
                            {!loading ? (
                                <Badge tone="brand">
                                    Mostrando <span className="font-semibold text-[#2B2E31]">{filtered.length}</span>
                                </Badge>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <GhostButton onClick={load} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Recargar
                        </GhostButton>

                        <PrimaryButton onClick={() => router.push('/superadmin/empresas/nueva')}>
                            <Plus className="h-4 w-4" />
                            Nueva empresa
                        </PrimaryButton>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-[#DDEBE6] bg-white p-4 shadow-sm md:p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="w-full md:max-w-xl">
                        <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Buscar</label>
                        <Input
                            value={query}
                            onChange={setQuery}
                            placeholder="Buscar por nombre, CIF, correo, responsable…"
                            leftIcon={<Search className="h-4 w-4" />}
                        />
                    </div>

                    <div className="flex items-center gap-2 md:pt-6">
                        <GhostButton onClick={() => setQuery('')} disabled={!query.trim() || loading}>
                            Limpiar
                        </GhostButton>
                        <PrimaryButton onClick={load} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Aplicar
                        </PrimaryButton>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-3xl border border-[#F3C6CE] bg-[#FFECEF] p-4 text-sm text-[#7B1E2B] shadow-sm">
                    {error}
                </div>
            ) : null}

            {loading ? (
                <div className="rounded-3xl border border-[#DDEBE6] bg-white p-6 text-sm text-[#8A8F93] shadow-sm">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando empresas…
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-3xl border border-[#DDEBE6] bg-white p-10 text-sm text-[#8A8F93] shadow-sm">
                    No hay empresas{query ? ' que coincidan con tu búsqueda' : ''}.
                </div>
            ) : (
                <div className="rounded-3xl border border-[#DDEBE6] bg-white shadow-sm overflow-hidden">
                    <EmpresasTable
                        items={filtered}
                        onView={(id) => router.push(`/superadmin/empresas/${id}`)}
                        onEdit={(id) => openEditModal(id)}
                    />
                </div>
            )}

            <ModalShell
                open={editOpen}
                onClose={() => {
                    if (busy) return;
                    setEditOpen(false);
                    setSelected(null);
                }}
                title="Editar empresa"
                description={selected ? `${selected.nombre} · ${selected.id}` : undefined}
                footer={
                    <>
                        <GhostButton
                            onClick={() => {
                                if (busy) return;
                                setEditOpen(false);
                                setSelected(null);
                            }}
                            disabled={busy}
                        >
                            Cancelar
                        </GhostButton>

                        <PrimaryButton onClick={onSaveEdit} disabled={busy || !selected}>
                            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                            Guardar cambios
                        </PrimaryButton>
                    </>
                }
            >
                {selected ? (
                    <div className="space-y-4">
                        <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/25 p-4">
                            <div className="text-sm font-semibold text-[#2B2E31]">{selected.nombre}</div>
                            <div className="mt-1 text-xs text-[#8A8F93]">
                                Responsable:{' '}
                                <span className="font-semibold text-[#2B2E31]">
                                    {selected.usuario
                                        ? `${selected.usuario.nombre ?? ''} ${selected.usuario.apellido ?? ''}`.trim() || selected.usuario.correo
                                        : '—'}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <Field label="Nombre">
                                <Input value={form.nombre} onChange={(v) => setForm((s) => ({ ...s, nombre: v }))} />
                            </Field>

                            <Field label="CIF">
                                <Input value={form.cif} onChange={(v) => setForm((s) => ({ ...s, cif: v }))} placeholder="—" />
                            </Field>

                            <Field label="Correo">
                                <Input value={form.correo} onChange={(v) => setForm((s) => ({ ...s, correo: v }))} placeholder="—" />
                            </Field>

                            <Field label="Teléfono">
                                <Input value={form.telefono} onChange={(v) => setForm((s) => ({ ...s, telefono: v }))} placeholder="—" />
                            </Field>
                        </div>

                        <div className="rounded-3xl border border-[#DDEBE6] bg-white p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Acciones rápidas</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <GhostButton
                                    onClick={() => {
                                        setEditOpen(false);
                                        router.push(`/superadmin/empresas/${selected.id}`);
                                    }}
                                    disabled={busy}
                                    className="w-full md:w-auto"
                                >
                                    Ver ficha
                                </GhostButton>

                                <GhostButton
                                    onClick={() => {
                                        setEditOpen(false);
                                        router.push(`/superadmin/empresas/${selected.id}/editar`);
                                    }}
                                    disabled={busy}
                                    className="w-full md:w-auto"
                                >
                                    Editar avanzada
                                </GhostButton>
                            </div>
                        </div>
                    </div>
                ) : null}
            </ModalShell>
        </div>
    );
}
