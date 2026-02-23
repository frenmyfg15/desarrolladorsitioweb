'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Building2,
    Check,
    FileText,
    Loader2,
    Link as LinkIcon,
    Receipt,
} from 'lucide-react';

import { facturaApi } from '@/app/api/facturas/factura.api';
import type { FacturaAdmin } from '@/app/api/facturas/factura.api';
import { useSessionStore } from '@/app/store/session.store';

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(' ');
}

function formatDateTime(iso?: string | null) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
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

function IconBadge({ icon }: { icon: React.ReactNode }) {
    return (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
            {icon}
        </span>
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

function KeyRow({ k, v }: { k: string; v: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-[#EEF4F2] py-3 last:border-b-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">{k}</div>
            <div className="min-w-0 text-right text-sm font-semibold text-[#2B2E31]">{v}</div>
        </div>
    );
}

function Card({
    title,
    subtitle,
    icon,
    right,
    children,
}: {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        <IconBadge icon={icon} />
                        <div className="min-w-0">
                            <div className="text-sm font-bold tracking-tight text-[#2B2E31]">{title}</div>
                            {subtitle ? <div className="mt-1 text-sm text-[#8A8F93]">{subtitle}</div> : null}
                        </div>
                    </div>
                </div>
                {right ? <div className="shrink-0">{right}</div> : null}
            </div>

            {children}
        </div>
    );
}

export default function SuperAdminFacturaDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const facturaId = params.id;

    const { user, isLoading: sessionLoading, hydrate } = useSessionStore();
    const isSuperAdmin = user?.rolGlobal === 'SUPER_ADMIN';
    const canAccess = user?.rolGlobal === 'SUPER_ADMIN' || user?.rolGlobal === 'ADMIN';

    const [factura, setFactura] = useState<FacturaAdmin | null>(null);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            const data = await facturaApi.getByIdAdmin(facturaId);
            setFactura(data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudo cargar la factura.');
            setFactura(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!canAccess) return;
        if (!facturaId) return;
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canAccess, facturaId]);

    const pagada = Boolean(factura?.pagadaEn);

    const empresaLabel = useMemo(() => {
        if (!factura) return '—';
        return factura.empresa?.nombre ?? factura.empresaId;
    }, [factura]);

    const proyectoLabel = useMemo(() => {
        if (!factura) return '—';
        return factura.fase?.proyecto?.nombre ?? factura.proyecto?.nombre ?? factura.fase?.proyectoId ?? '—';
    }, [factura]);

    const faseLabel = useMemo(() => {
        if (!factura) return '—';
        return factura.fase?.nombre ?? factura.faseId;
    }, [factura]);

    async function togglePagada() {
        if (!factura) return;
        if (!isSuperAdmin) return;

        setToggling(true);
        setError(null);

        try {
            const next = !Boolean(factura.pagadaEn);
            await facturaApi.marcarPagada(factura.id, { pagada: next });

            setFactura((prev) => (prev ? { ...prev, pagadaEn: next ? new Date().toISOString() : null } : prev));
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudo actualizar el estado de pago.');
        } finally {
            setToggling(false);
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
                                <Receipt className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-2xl font-semibold tracking-tight text-[#2B2E31]">Factura</h1>
                                <p className="mt-1 text-sm text-[#8A8F93]">Detalle de factura, relaciones y acciones.</p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <Badge tone={pagada ? 'success' : 'warning'}>{pagada ? 'PAGADA' : 'PENDIENTE'}</Badge>
                            {factura?.numero ? <Badge tone="brand">Nº {factura.numero}</Badge> : null}
                            {factura?.moneda ? (
                                <Badge tone="neutral">
                                    {factura.importe} {factura.moneda}
                                </Badge>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <GhostButton onClick={() => router.push('/superadmin/facturas')}>
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </GhostButton>

                        {factura?.fase?.proyectoId ? (
                            <GhostButton onClick={() => router.push(`/superadmin/proyectos/${factura.fase!.proyectoId}`)}>
                                <FileText className="h-4 w-4" />
                                Ver proyecto
                            </GhostButton>
                        ) : null}

                        {factura?.pdfUrl ? (
                            <a
                                className={cx(
                                    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
                                    'bg-white text-[#1F3D3A] border border-[#CDEFE6] shadow-sm transition',
                                    'hover:bg-[#E9F7F3] hover:border-[#BEE7DC]',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                                    'active:translate-y-[1px]'
                                )}
                                href={factura.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Abrir PDF"
                            >
                                <LinkIcon className="h-4 w-4" />
                                PDF
                            </a>
                        ) : null}
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
                        Cargando factura…
                    </div>
                </div>
            ) : !factura ? (
                <div className="rounded-3xl border border-[#DDEBE6] bg-white p-10 text-sm text-[#8A8F93] shadow-sm">
                    Factura no encontrada.
                </div>
            ) : (
                <>
                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <Card
                                title="Datos de factura"
                                subtitle="Información principal, fechas y documento."
                                icon={<Receipt className="h-5 w-5" />}
                                right={<Badge tone={pagada ? 'success' : 'warning'}>{pagada ? 'PAGADA' : 'PENDIENTE'}</Badge>}
                            >
                                <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5">
                                    <KeyRow k="ID" v={<span className="select-all font-mono text-[12px]">{factura.id}</span>} />
                                    <KeyRow k="Número" v={factura.numero ?? '—'} />
                                    <KeyRow k="Importe" v={`${factura.importe} ${factura.moneda}`} />
                                    <KeyRow k="Emitida" v={formatDateTime(factura.emitidaEn)} />
                                    <KeyRow k="Vence" v={formatDate(factura.venceEn)} />
                                    <KeyRow
                                        k="Pagada"
                                        v={
                                            <span className="inline-flex items-center justify-end gap-2">
                                                <Badge tone={pagada ? 'success' : 'warning'}>{pagada ? 'Sí' : 'No'}</Badge>
                                                {pagada ? <span className="text-xs font-semibold text-[#8A8F93]">{formatDateTime(factura.pagadaEn)}</span> : null}
                                            </span>
                                        }
                                    />
                                    <KeyRow
                                        k="PDF"
                                        v={
                                            factura.pdfUrl ? (
                                                <a
                                                    className={cx(
                                                        'inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold',
                                                        'border-[#CDEFE6] bg-white text-[#1F3D3A] shadow-sm transition',
                                                        'hover:bg-[#E9F7F3] hover:border-[#BEE7DC]',
                                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                                                        'active:translate-y-[1px]'
                                                    )}
                                                    href={factura.pdfUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <LinkIcon className="h-4 w-4" />
                                                    Abrir PDF
                                                </a>
                                            ) : (
                                                '—'
                                            )
                                        }
                                    />
                                </div>
                            </Card>
                        </div>

                        <div className="lg:col-span-1 space-y-4">
                            <Card
                                title="Relaciones"
                                subtitle="Contexto: empresa, proyecto y fase."
                                icon={<Building2 className="h-5 w-5" />}
                                right={
                                    <GhostButton onClick={() => router.push(`/superadmin/empresas/${factura.empresaId}`)}>
                                        <Building2 className="h-4 w-4" />
                                        Ver empresa
                                    </GhostButton>
                                }
                            >
                                <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/25 p-5">
                                    <KeyRow k="Empresa" v={empresaLabel} />
                                    <KeyRow k="Proyecto" v={proyectoLabel} />
                                    <KeyRow k="Fase" v={faseLabel} />
                                </div>
                            </Card>

                            <Card
                                title="Acciones"
                                subtitle="Marcar pago está reservado a SUPER_ADMIN."
                                icon={<Check className="h-5 w-5" />}
                                right={
                                    isSuperAdmin ? (
                                        <PrimaryButton disabled={toggling} onClick={togglePagada}>
                                            {toggling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                            {pagada ? 'Marcar NO pagada' : 'Marcar pagada'}
                                        </PrimaryButton>
                                    ) : (
                                        <Badge tone="warning">Solo lectura</Badge>
                                    )
                                }
                            >
                                {!isSuperAdmin ? (
                                    <div className="rounded-3xl border border-[#EBD9B6] bg-[#FFF6DF] p-4 text-sm text-[#6A4A12] shadow-sm">
                                        Estás como <b>ADMIN</b>: puedes ver la factura, pero no cambiar su estado de pago.
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-[#DDEBE6] bg-white p-4 text-sm text-[#8A8F93]">
                                        Usa el botón para alternar el estado de pago. El cambio se refleja inmediatamente.
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
