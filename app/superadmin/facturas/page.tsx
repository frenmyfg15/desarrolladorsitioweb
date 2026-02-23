'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Check, ChevronLeft, ChevronRight, FileText, Loader2, Search } from 'lucide-react';

import { facturaApi } from '@/app/api/facturas/factura.api';
import type { FacturaAdmin } from '@/app/api/facturas/factura.api';
import { useSessionStore } from '@/app/store/session.store';

type EstadoFiltro = 'todas' | 'pagadas' | 'pendientes';

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(' ');
}

function formatDate(iso?: string | null) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString();
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
    variant?: 'neutral' | 'brand' | 'danger';
}) {
    const v =
        variant === 'brand'
            ? 'border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] hover:bg-[#DFF3ED] hover:border-[#BEE7DC]'
            : variant === 'danger'
                ? 'border-[#F3C6CE] bg-white text-[#7B1E2B] hover:bg-[#FFECEF]'
                : 'border-[#DDEBE6] bg-white text-[#2B2E31] hover:bg-[#F2F4F5] hover:border-[#CFE4DD]';

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
                'border-[#CDEFE6] bg-white text-[#1F3D3A] shadow-sm transition',
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

function Select({
    value,
    onChange,
    children,
}: {
    value: string;
    onChange: (v: string) => void;
    children: React.ReactNode;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cx(
                'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm',
                'outline-none transition',
                'border-[#DDEBE6] hover:border-[#BEE7DC]',
                'focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25'
            )}
        >
            {children}
        </select>
    );
}

function SkeletonRow() {
    return (
        <tr className="border-b border-[#EEF4F2] last:border-b-0">
            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="h-3.5 w-28 rounded bg-[#F2F4F5] animate-pulse" />
                    <div className="h-3 w-64 rounded bg-[#F2F4F5] animate-pulse" />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="h-3.5 w-44 rounded bg-[#F2F4F5] animate-pulse" />
                    <div className="h-3 w-36 rounded bg-[#F2F4F5] animate-pulse" />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="h-3.5 w-56 rounded bg-[#F2F4F5] animate-pulse" />
                    <div className="h-3 w-40 rounded bg-[#F2F4F5] animate-pulse" />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="h-3.5 w-24 rounded bg-[#F2F4F5] animate-pulse" />
            </td>
            <td className="px-6 py-4">
                <div className="h-3.5 w-24 rounded bg-[#F2F4F5] animate-pulse" />
            </td>
            <td className="px-6 py-4">
                <div className="h-3.5 w-24 rounded bg-[#F2F4F5] animate-pulse" />
            </td>
            <td className="px-6 py-4">
                <div className="h-7 w-16 rounded-full bg-[#F2F4F5] animate-pulse" />
            </td>
            <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                    <div className="h-10 w-16 rounded-xl bg-[#F2F4F5] animate-pulse" />
                    <div className="h-10 w-40 rounded-xl bg-[#F2F4F5] animate-pulse" />
                    <div className="h-10 w-16 rounded-xl bg-[#F2F4F5] animate-pulse" />
                </div>
            </td>
        </tr>
    );
}

export default function SuperAdminFacturasPage() {
    const router = useRouter();
    const { user, isLoading: sessionLoading, hydrate } = useSessionStore();

    const isSuperAdmin = user?.rolGlobal === 'SUPER_ADMIN';
    const canAccess = isSuperAdmin;

    const [items, setItems] = useState<FacturaAdmin[]>([]);
    const [meta, setMeta] = useState<{ total: number; page: number; pageSize: number; totalPages: number } | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [estado, setEstado] = useState<EstadoFiltro>('todas');
    const [q, setQ] = useState('');
    const [empresaId, setEmpresaId] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const [togglingId, setTogglingId] = useState<string | null>(null);

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

        if (!canAccess) {
            router.push('/');
            return;
        }
    }, [user, sessionLoading, canAccess, router]);

    async function load() {
        setLoading(true);
        setError(null);

        try {
            const params: any = { page, pageSize };
            if (empresaId.trim()) params.empresaId = empresaId.trim();
            if (q.trim()) params.q = q.trim();
            if (estado === 'pagadas' || estado === 'pendientes') params.estado = estado;

            const data = await facturaApi.listAdmin(params);
            setItems(data.facturas);
            setMeta(data.meta);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudieron cargar las facturas.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!canAccess) return;
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canAccess, page, pageSize, estado]);

    const showingCount = useMemo(() => items.length, [items]);

    async function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        setPage(1);
        await load();
    }

    async function togglePagada(f: FacturaAdmin) {
        if (!isSuperAdmin) return;
        setTogglingId(f.id);
        setError(null);

        try {
            const nextPagada = !f.pagadaEn;
            await facturaApi.marcarPagada(f.id, { pagada: nextPagada });

            setItems((prev) =>
                prev.map((x) => (x.id === f.id ? { ...x, pagadaEn: nextPagada ? new Date().toISOString() : null } : x))
            );
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudo actualizar el estado de pago.');
        } finally {
            setTogglingId(null);
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
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-2xl font-semibold tracking-tight text-[#2B2E31]">Facturas</h1>
                                <p className="mt-1 text-sm text-[#8A8F93]">
                                    Gestión de facturas (listado global, filtros y marcar pagadas).
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <Badge tone="neutral">
                                Mostrando <span className="font-semibold text-[#2B2E31]">{showingCount}</span>
                                {meta ? (
                                    <>
                                        <span className="text-[#8A8F93]"> de </span>
                                        <span className="font-semibold text-[#2B2E31]">{meta.total}</span>
                                    </>
                                ) : null}
                            </Badge>

                            {estado !== 'todas' ? <Badge tone="brand">Estado: {estado}</Badge> : null}
                            {empresaId.trim() ? <Badge tone="brand">Empresa: {empresaId.trim()}</Badge> : null}
                            {q.trim() ? <Badge tone="brand">Búsqueda: {q.trim()}</Badge> : null}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <GhostButton onClick={() => router.push('/superadmin/proyectos')}>
                            <Building2 className="h-4 w-4" />
                            Ir a proyectos
                        </GhostButton>

                        <GhostButton onClick={() => load()} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Actualizar
                        </GhostButton>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="rounded-3xl border border-[#DDEBE6] bg-white p-4 shadow-sm md:p-5">
                <div className="grid gap-3 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-3">
                        <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Estado</label>
                        <Select
                            value={estado}
                            onChange={(v) => {
                                setEstado(v as EstadoFiltro);
                                setPage(1);
                            }}
                        >
                            <option value="todas">Todas</option>
                            <option value="pendientes">Pendientes</option>
                            <option value="pagadas">Pagadas</option>
                        </Select>
                    </div>

                    <div className="md:col-span-4">
                        <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Empresa ID (opcional)</label>
                        <Input value={empresaId} onChange={setEmpresaId} placeholder="cuid..." />
                    </div>

                    <div className="md:col-span-5">
                        <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Buscar</label>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input value={q} onChange={setQ} placeholder="Número o ID de factura…" leftIcon={<Search className="h-4 w-4" />} />
                            </div>
                            <PrimaryButton disabled={loading} onClick={() => { }}>
                                <Search className="h-4 w-4" />
                                Buscar
                            </PrimaryButton>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-[#8A8F93]">
                        Página <span className="font-semibold text-[#2B2E31]">{meta?.page ?? page}</span>
                        {meta?.totalPages ? (
                            <>
                                <span className="text-[#8A8F93]"> / </span>
                                <span className="font-semibold text-[#2B2E31]">{meta.totalPages}</span>
                            </>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                        <GhostButton
                            onClick={() => {
                                setEstado('todas');
                                setQ('');
                                setEmpresaId('');
                                setPage(1);
                            }}
                            disabled={loading}
                        >
                            Limpiar
                        </GhostButton>
                        <PrimaryButton onClick={() => load()} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Aplicar
                        </PrimaryButton>
                    </div>
                </div>
            </form>

            {error ? (
                <div className="rounded-3xl border border-[#F3C6CE] bg-[#FFECEF] p-4 text-sm text-[#7B1E2B] shadow-sm">
                    {error}
                </div>
            ) : null}

            <div className="rounded-3xl border border-[#DDEBE6] bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[#E9F7F3]/55 text-left text-[11px] uppercase tracking-wide text-[#1F3D3A]">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Número</th>
                                <th className="px-6 py-3 font-semibold">Empresa</th>
                                <th className="px-6 py-3 font-semibold">Proyecto / Fase</th>
                                <th className="px-6 py-3 font-semibold">Importe</th>
                                <th className="px-6 py-3 font-semibold">Emitida</th>
                                <th className="px-6 py-3 font-semibold">Vence</th>
                                <th className="px-6 py-3 font-semibold">Pagada</th>
                                <th className="px-6 py-3 text-right font-semibold">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#EEF4F2]">
                            {loading ? (
                                <>
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                </>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-14">
                                        <div className="mx-auto max-w-md text-center">
                                            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                                <Search className="h-5 w-5" />
                                            </div>
                                            <div className="mt-4 text-sm font-semibold text-[#2B2E31]">No hay facturas</div>
                                            <div className="mt-1 text-sm text-[#8A8F93]">No hay facturas para los filtros actuales.</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items.map((f) => {
                                    const empresaNombre = f.empresa?.nombre ?? f.empresaId;
                                    const proyectoNombre = f.fase?.proyecto?.nombre ?? f.proyecto?.nombre ?? f.fase?.proyectoId ?? '—';
                                    const faseNombre = f.fase?.nombre ?? '—';
                                    const pagada = Boolean(f.pagadaEn);

                                    return (
                                        <tr key={f.id} className="group transition-colors hover:bg-[#E9F7F3]/45">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-[#2B2E31]">{f.numero ?? '—'}</div>
                                                <div className="mt-0.5 text-xs text-[#8A8F93] font-mono">{f.id}</div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-[#2B2E31]">{empresaNombre}</div>
                                                <div className="mt-0.5 text-xs text-[#8A8F93] font-mono">{f.empresaId}</div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-[#2B2E31]">{proyectoNombre}</div>
                                                <div className="mt-0.5 text-xs text-[#8A8F93]">{faseNombre}</div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-[#2B2E31]">
                                                    {f.importe} {f.moneda}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">{formatDate(f.emitidaEn)}</td>
                                            <td className="px-6 py-4">{formatDate(f.venceEn)}</td>

                                            <td className="px-6 py-4">
                                                <Badge tone={pagada ? 'success' : 'warning'}>{pagada ? 'Sí' : 'No'}</Badge>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <GhostButton onClick={() => router.push(`/superadmin/facturas/${f.id}`)}>
                                                        Ver
                                                    </GhostButton>

                                                    {isSuperAdmin ? (
                                                        <PrimaryButton
                                                            onClick={() => togglePagada(f)}
                                                            disabled={togglingId === f.id}
                                                        >
                                                            {togglingId === f.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Check className="h-4 w-4" />
                                                            )}
                                                            {pagada ? 'Marcar NO pagada' : 'Marcar pagada'}
                                                        </PrimaryButton>
                                                    ) : null}

                                                    {f.pdfUrl ? (
                                                        <a
                                                            className={cx(
                                                                'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold',
                                                                'border-[#CDEFE6] bg-white text-[#1F3D3A] shadow-sm transition',
                                                                'hover:bg-[#E9F7F3] hover:border-[#BEE7DC]',
                                                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                                                                'active:translate-y-[1px]'
                                                            )}
                                                            href={f.pdfUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            title="Abrir PDF"
                                                        >
                                                            PDF
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination bottom (requested) */}
                <div className="flex flex-col gap-3 border-t border-[#DDEBE6] bg-[#E9F7F3]/25 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="neutral">
                            Mostrando <span className="font-semibold text-[#2B2E31]">{showingCount}</span>
                            {meta ? (
                                <>
                                    <span className="text-[#8A8F93]"> / </span>
                                    <span className="font-semibold text-[#2B2E31]">{meta.total}</span>
                                </>
                            ) : null}
                        </Badge>

                        <span className="text-xs text-[#8A8F93]">
                            Página <span className="font-semibold text-[#2B2E31]">{meta?.page ?? page}</span>
                            {meta?.totalPages ? (
                                <>
                                    <span className="text-[#8A8F93]"> / </span>
                                    <span className="font-semibold text-[#2B2E31]">{meta.totalPages}</span>
                                </>
                            ) : null}
                        </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <IconButton
                            title="Página anterior"
                            disabled={loading || page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </IconButton>

                        <IconButton
                            title="Página siguiente"
                            disabled={loading || (meta ? page >= meta.totalPages : false)}
                            onClick={() => setPage((p) => p + 1)}
                            variant="brand"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </IconButton>
                    </div>
                </div>
            </div>

            {!isSuperAdmin ? (
                <div className="rounded-3xl border border-[#EBD9B6] bg-[#FFF6DF] p-4 text-sm text-[#6A4A12] shadow-sm">
                    Nota: estás como <b>ADMIN</b>. Puedes listar/ver, pero <b>no</b> marcar pagadas (acción reservada a SUPER_ADMIN).
                </div>
            ) : null}
        </div>
    );
}
