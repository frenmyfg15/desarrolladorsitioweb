'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Building2,
    Check,
    FileText,
    Loader2,
    Pencil,
    Search,
    User2,
    X,
} from 'lucide-react';

import { empresaApi } from '@/app/api/empresa/empresa.api';
import type { EmpresaDetail } from '@/app/api/empresa/empresa.api';
import { useSessionStore } from '@/app/store/session.store';
import { NewProyectoModal } from '@/app/components/superadmin/empresas/NewProyectoModal';

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
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                            {icon}
                        </span>
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

export default function EmpresaDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const empresaId = params.id;

    const { user, isLoading: sessionLoading, hydrate } = useSessionStore();
    const isSuperAdmin = user?.rolGlobal === 'SUPER_ADMIN';

    const [empresa, setEmpresa] = useState<EmpresaDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editOpen, setEditOpen] = useState(false);

    const [projQ, setProjQ] = useState('');

    // ✅ Nuevo: modal de crear proyecto
    const [createOpen, setCreateOpen] = useState(false);

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
            const data = await empresaApi.getById(empresaId);
            setEmpresa(data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudo cargar la empresa.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isSuperAdmin) return;
        if (!empresaId) return;
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuperAdmin, empresaId]);

    const responsableNombre = useMemo(() => {
        if (!empresa) return '—';
        return [empresa.usuario.nombre, empresa.usuario.apellido].filter(Boolean).join(' ') || empresa.usuario.correo;
    }, [empresa]);

    const filteredProyectos = useMemo(() => {
        if (!empresa) return [];
        const q = projQ.trim().toLowerCase();
        if (!q) return empresa.proyectos;
        return empresa.proyectos.filter((p) => {
            const hay = [p.id, p.nombre, p.tipo, p.aprobado ? 'si' : 'no'].join(' ').toLowerCase();
            return hay.includes(q);
        });
    }, [empresa, projQ]);

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
                                <h1 className="truncate text-2xl font-semibold tracking-tight text-[#2B2E31]">
                                    {empresa?.nombre ?? 'Empresa'}
                                </h1>
                                <p className="mt-1 text-sm text-[#8A8F93]">Detalle de empresa, responsable y proyectos.</p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {empresa ? (
                                <>
                                    <Badge tone="neutral">
                                        Proyectos: <span className="font-semibold text-[#2B2E31]">{empresa.proyectos.length}</span>
                                    </Badge>
                                    <Badge tone="brand">
                                        Responsable: <span className="font-semibold text-[#2B2E31]">{responsableNombre}</span>
                                    </Badge>
                                </>
                            ) : (
                                <Badge tone="neutral">Cargando…</Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <GhostButton onClick={() => router.push('/superadmin/empresas')}>
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </GhostButton>

                        <GhostButton onClick={() => load()} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Actualizar
                        </GhostButton>

                        <PrimaryButton onClick={() => setEditOpen(true)} disabled={!empresa || loading}>
                            <Pencil className="h-4 w-4" />
                            Editar
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
                        Cargando empresa…
                    </div>
                </div>
            ) : !empresa ? (
                <div className="rounded-3xl border border-[#DDEBE6] bg-white p-10 text-sm text-[#8A8F93] shadow-sm">
                    Empresa no encontrada.
                </div>
            ) : (
                <>
                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <Card
                                title="Datos de empresa"
                                subtitle="Identificación y contacto."
                                icon={<Building2 className="h-5 w-5" />}
                                right={<Badge tone="neutral">{empresa.id}</Badge>}
                            >
                                <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5">
                                    <KeyRow k="ID" v={<span className="select-all font-mono text-[12px]">{empresa.id}</span>} />
                                    <KeyRow k="Nombre" v={empresa.nombre} />
                                    <KeyRow k="CIF" v={empresa.cif ?? '—'} />
                                    <KeyRow k="Correo" v={empresa.correo ?? '—'} />
                                    <KeyRow k="Teléfono" v={empresa.telefono ?? '—'} />
                                </div>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card
                                title="Responsable"
                                subtitle="Usuario asociado a la empresa."
                                icon={<User2 className="h-5 w-5" />}
                                right={<Badge tone="brand">{empresa.usuario.rolGlobal}</Badge>}
                            >
                                <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/25 p-5">
                                    <KeyRow k="Nombre" v={responsableNombre} />
                                    <KeyRow k="Correo" v={empresa.usuario.correo} />
                                    <KeyRow k="Teléfono" v={empresa.usuario.telefono ?? '—'} />
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-[#DDEBE6] bg-white shadow-sm overflow-hidden">
                        <div className="flex flex-col gap-3 border-b border-[#DDEBE6] bg-[#E9F7F3]/25 px-5 py-4 md:flex-row md:items-center md:justify-between">
                            <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                        <FileText className="h-5 w-5" />
                                    </span>
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold tracking-tight text-[#2B2E31]">Proyectos</div>
                                        <div className="mt-1 text-sm text-[#8A8F93]">{empresa.proyectos.length} total</div>
                                    </div>
                                </div>
                            </div>

                            {/* ✅ Header right controls + botón */}
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
                                <div className="w-full md:w-[360px]">
                                    <Input
                                        value={projQ}
                                        onChange={setProjQ}
                                        placeholder="Buscar proyecto por nombre o ID…"
                                        leftIcon={<Search className="h-4 w-4" />}
                                    />
                                </div>

                                <Badge tone="neutral">
                                    Mostrando <span className="font-semibold text-[#2B2E31]">{filteredProyectos.length}</span>
                                </Badge>

                                <PrimaryButton onClick={() => setCreateOpen(true)} disabled={!empresa || loading}>
                                    <FileText className="h-4 w-4" />
                                    Nuevo proyecto
                                </PrimaryButton>
                            </div>
                        </div>

                        {empresa.proyectos.length === 0 ? (
                            <div className="p-10 text-sm text-[#8A8F93]">Esta empresa no tiene proyectos.</div>
                        ) : filteredProyectos.length === 0 ? (
                            <div className="p-10 text-sm text-[#8A8F93]">No hay proyectos que coincidan con tu búsqueda.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-[#E9F7F3]/55 text-left text-[11px] uppercase tracking-wide text-[#1F3D3A]">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Nombre</th>
                                            <th className="px-6 py-3 font-semibold">Tipo</th>
                                            <th className="px-6 py-3 font-semibold">Aprobado</th>
                                            <th className="px-6 py-3 text-right font-semibold">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#EEF4F2]">
                                        {filteredProyectos.map((p) => (
                                            <tr key={p.id} className="group transition-colors hover:bg-[#E9F7F3]/45">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-[#2B2E31]">{p.nombre}</div>
                                                    <div className="mt-0.5 text-xs text-[#8A8F93] font-mono">{p.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge tone="neutral">{p.tipo}</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge tone={p.aprobado ? 'success' : 'warning'}>{p.aprobado ? 'Sí' : 'No'}</Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <GhostButton onClick={() => router.push(`/superadmin/proyectos/${p.id}`)}>
                                                        Ver proyecto
                                                    </GhostButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            <ModalShell
                open={editOpen}
                onClose={() => setEditOpen(false)}
                title="Editar empresa"
                description={empresa ? `${empresa.nombre} · ${empresa.id}` : undefined}
                footer={
                    <>
                        <GhostButton onClick={() => setEditOpen(false)}>Cerrar</GhostButton>
                        <PrimaryButton
                            onClick={() => {
                                setEditOpen(false);
                                router.push(`/superadmin/empresas/${empresaId}/editar`);
                            }}
                            disabled={!empresa}
                        >
                            <Pencil className="h-4 w-4" />
                            Ir a edición
                        </PrimaryButton>
                    </>
                }
            >
                {empresa ? (
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5">
                            <div className="mb-3 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-[#1F3D3A]" />
                                <div className="text-sm font-bold text-[#2B2E31]">Empresa</div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <KeyRow k="Nombre" v={empresa.nombre} />
                                <KeyRow k="CIF" v={empresa.cif ?? '—'} />
                                <KeyRow k="Correo" v={empresa.correo ?? '—'} />
                                <KeyRow k="Teléfono" v={empresa.telefono ?? '—'} />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/25 p-5">
                            <div className="mb-3 flex items-center gap-2">
                                <User2 className="h-4 w-4 text-[#1F3D3A]" />
                                <div className="text-sm font-bold text-[#2B2E31]">Responsable</div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <KeyRow k="Nombre" v={responsableNombre} />
                                <KeyRow k="Correo" v={empresa.usuario.correo} />
                                <KeyRow k="Rol" v={<Badge tone="brand">{empresa.usuario.rolGlobal}</Badge>} />
                                <KeyRow k="Teléfono" v={empresa.usuario.telefono ?? '—'} />
                            </div>
                        </div>

                        <div className="md:col-span-2 rounded-3xl border border-[#DDEBE6] bg-white p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Acciones rápidas</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <GhostButton
                                    onClick={() => {
                                        setEditOpen(false);
                                        router.push(`/superadmin/usuarios/${empresa.usuario.id}`);
                                    }}
                                >
                                    Ver usuario
                                </GhostButton>

                                <GhostButton
                                    onClick={() => {
                                        setEditOpen(false);
                                        router.push(`/superadmin/proyectos?empresaId=${empresa.id}`);
                                    }}
                                >
                                    Ver proyectos
                                </GhostButton>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-[#8A8F93]">—</div>
                )}
            </ModalShell>

            {/* ✅ Modal crear proyecto */}
            <NewProyectoModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                empresaId={empresaId}
                empresaNombre={empresa?.nombre}
                onCreated={(proyectoId, selected) => {
                    // De momento usamos solo setup=1.
                    // Si luego quieres usar "selected", lo pasamos en query params.
                    const qp = new URLSearchParams();
                    qp.set('setup', '1');
                    qp.set('req', selected.req ? '1' : '0');
                    qp.set('pres', selected.pres ? '1' : '0');
                    qp.set('fases', selected.fases ? '1' : '0');
                    qp.set('facturas', selected.facturas ? '1' : '0');

                    router.push(`/superadmin/proyectos/${proyectoId}?${qp.toString()}`);
                }}
            />
        </div>
    );
}
