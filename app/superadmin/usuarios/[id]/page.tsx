'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Building2,
    Check,
    ChevronRight,
    Eye,
    Loader2,
    Mail,
    Phone,
    Shield,
    ShieldCheck,
    User2,
    X,
} from 'lucide-react';

import { usuarioApi } from '@/app/api/usuarios/usuario.api';
import type { UsuarioDetail } from '@/app/api/usuarios/usuario.api';
import { useSessionStore } from '@/app/store/session.store';

import CreateEmpresaForUsuarioModal from '@/app/components/superadmin/usuarios/CreateEmpresaForUsuarioModal';

function formatDateTime(iso?: string | null) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(' ');
}

function Badge({
    children,
    tone = 'neutral',
}: {
    children: React.ReactNode;
    tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
}) {
    const tones: Record<string, string> = {
        neutral: 'border-[#DDEBE6] bg-white text-[#2B2E31] ring-1 ring-inset ring-[#DDEBE6]',
        success: 'border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] ring-1 ring-inset ring-[#CDEFE6]',
        warning: 'border-[#EBD9B6] bg-[#FFF6DF] text-[#6A4A12] ring-1 ring-inset ring-[#EBD9B6]',
        danger: 'border-[#F3C6CE] bg-[#FFECEF] text-[#7B1E2B] ring-1 ring-inset ring-[#F3C6CE]',
        info: 'border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] ring-1 ring-inset ring-[#CDEFE6]',
        brand: 'border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] ring-1 ring-inset ring-[#CDEFE6]',
    };
    return (
        <span
            className={cx(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
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

function Stat({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">{label}</div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight text-[#2B2E31]">{value}</div>
                </div>
                {icon ? (
                    <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                        {icon}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function roleTone(rol: string) {
    if (rol === 'SUPER_ADMIN') return 'brand' as const;
    if (rol === 'ADMIN') return 'warning' as const;
    return 'neutral' as const;
}

function roleIcon(rol: string) {
    if (rol === 'SUPER_ADMIN') return <ShieldCheck className="h-3.5 w-3.5" />;
    if (rol === 'ADMIN') return <Shield className="h-3.5 w-3.5" />;
    return <User2 className="h-3.5 w-3.5" />;
}

function KeyRow({ k, v }: { k: string; v: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-[#EEF4F2] py-3 last:border-b-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">{k}</div>
            <div className="min-w-0 text-right text-sm font-semibold text-[#2B2E31]">{v}</div>
        </div>
    );
}

function InfoPill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <span
            className={cx(
                'inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm',
                'border-[#DDEBE6] bg-white text-[#2B2E31] shadow-sm',
                'hover:border-[#BEE7DC] hover:bg-[#E9F7F3]/45 transition'
            )}
        >
            <span className="text-[#8A8F93]">{icon}</span>
            <span className="min-w-0 truncate font-medium">{children}</span>
        </span>
    );
}

export default function SuperAdminUsuarioDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const usuarioId = params.id;

    const { user, isLoading: sessionLoading, hydrate } = useSessionStore();
    const canAccess = user?.rolGlobal === 'SUPER_ADMIN' || user?.rolGlobal === 'ADMIN';
    const isSuperAdmin = user?.rolGlobal === 'SUPER_ADMIN';

    const [usuario, setUsuario] = useState<UsuarioDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [userModalOpen, setUserModalOpen] = useState(false);

    // Separado: detalles vs crear
    const [empresaDetailsOpen, setEmpresaDetailsOpen] = useState(false);
    const [empresaCreateOpen, setEmpresaCreateOpen] = useState(false);

    useEffect(() => {
        if (sessionLoading) return;
        if (!user) hydrate();
    }, [user, sessionLoading, hydrate]);

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
            const data = await usuarioApi.getById(usuarioId);
            setUsuario(data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudo cargar el usuario.');
            setUsuario(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!canAccess) return;
        if (!usuarioId) return;
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canAccess, usuarioId]);

    const nombreCompleto = useMemo(() => {
        if (!usuario) return 'Usuario';
        return `${usuario.nombre} ${usuario.apellido}`.trim() || 'Usuario';
    }, [usuario]);

    const initials = useMemo(() => {
        const parts = nombreCompleto.split(' ').filter(Boolean).slice(0, 2);
        const s = parts.map((p) => p[0]?.toUpperCase()).join('');
        return s || 'U';
    }, [nombreCompleto]);

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
                    <div className="flex items-start gap-4">
                        <div className="relative">
                            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-3xl border border-[#CDEFE6] bg-white text-sm font-semibold text-[#1F3D3A] shadow-sm">
                                {usuario?.imagenUrl ? (
                                    <img src={usuario.imagenUrl} alt="Avatar" className="h-14 w-14 object-cover" />
                                ) : (
                                    initials
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                <User2 className="h-4.5 w-4.5" />
                            </div>
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-2xl font-semibold tracking-tight text-[#2B2E31]">{nombreCompleto}</h1>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge tone={roleTone(usuario?.rolGlobal ?? 'USUARIO')}>
                                    <span className="inline-flex items-center">{roleIcon(usuario?.rolGlobal ?? 'USUARIO')}</span>
                                    {usuario?.rolGlobal ?? '—'}
                                </Badge>
                                {!isSuperAdmin ? <Badge tone="warning">Solo lectura</Badge> : null}
                                {usuario?.googleId ? <Badge tone="info">Google</Badge> : <Badge tone="neutral">Password</Badge>}
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <InfoPill icon={<Mail className="h-4 w-4" />}>{usuario?.correo ?? '—'}</InfoPill>
                                <InfoPill icon={<Phone className="h-4 w-4" />}>{usuario?.telefono ?? '—'}</InfoPill>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <GhostButton onClick={() => router.push('/superadmin/usuarios')}>
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </GhostButton>

                        <GhostButton onClick={() => load()} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Actualizar
                        </GhostButton>

                        <IconButton
                            title="Ver detalles del usuario"
                            onClick={() => setUserModalOpen(true)}
                            disabled={!usuario}
                            variant="brand"
                        >
                            <Eye className="h-4 w-4" />
                        </IconButton>

                        {usuario?.empresa ? (
                            <IconButton title="Ver detalles de empresa" onClick={() => setEmpresaDetailsOpen(true)} variant="brand">
                                <Building2 className="h-4 w-4" />
                            </IconButton>
                        ) : isSuperAdmin && usuario ? (
                            <IconButton title="Crear empresa" onClick={() => setEmpresaCreateOpen(true)} variant="brand">
                                <Building2 className="h-4 w-4" />
                            </IconButton>
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
                <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5 text-sm text-[#8A8F93] shadow-sm">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando usuario…
                    </div>
                </div>
            ) : !usuario ? (
                <div className="rounded-3xl border border-[#DDEBE6] bg-white p-10 text-sm text-[#8A8F93] shadow-sm">
                    Usuario no encontrado.
                </div>
            ) : (
                <>
                    <div className="grid gap-3 md:grid-cols-3">
                        <Stat label="Proyectos (usuario)" value={usuario._count.proyectos} icon={<ChevronRight className="h-5 w-5" />} />
                        <Stat label="Presupuestos (usuario)" value={usuario._count.presupuestos} icon={<ChevronRight className="h-5 w-5" />} />
                        <Stat label="Empresa" value={usuario.empresa ? 'Sí' : 'No'} icon={<Building2 className="h-5 w-5" />} />
                    </div>

                    <div className="rounded-3xl border border-[#DDEBE6] bg-white shadow-sm overflow-hidden">
                        <div className="flex flex-col gap-3 border-b border-[#DDEBE6] bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
                            <div className="min-w-0">
                                <div className="text-base font-semibold text-[#2B2E31]">Empresa</div>
                                <div className="mt-1 text-sm text-[#8A8F93]">Relación del usuario con su empresa.</div>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                                {usuario.empresa ? (
                                    <>
                                        <GhostButton onClick={() => setEmpresaDetailsOpen(true)}>
                                            <Eye className="h-4 w-4" />
                                            Detalles
                                        </GhostButton>
                                        <PrimaryButton onClick={() => router.push(`/superadmin/empresas/${usuario.empresa!.id}`)}>
                                            <Building2 className="h-4 w-4" />
                                            Ver empresa
                                            <ChevronRight className="h-4 w-4" />
                                        </PrimaryButton>
                                    </>
                                ) : (
                                    <>
                                        <Badge tone="neutral">Sin empresa</Badge>
                                        {isSuperAdmin ? (
                                            <PrimaryButton onClick={() => setEmpresaCreateOpen(true)}>
                                                <Building2 className="h-4 w-4" />
                                                Crear empresa
                                            </PrimaryButton>
                                        ) : null}
                                    </>
                                )}
                            </div>
                        </div>

                        {!usuario.empresa ? (
                            <div className="px-5 py-6 text-sm text-[#8A8F93]">Este usuario no tiene empresa creada.</div>
                        ) : (
                            <div className="grid gap-3 p-5 md:grid-cols-2">
                                <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/35 p-5">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Datos</div>
                                    <div className="mt-3 space-y-2 text-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-[#8A8F93]">Nombre</span>
                                            <span className="truncate font-semibold text-[#2B2E31]">{usuario.empresa.nombre}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-[#8A8F93]">CIF</span>
                                            <span className="truncate font-semibold text-[#2B2E31]">{usuario.empresa.cif ?? '—'}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-[#8A8F93]">Correo</span>
                                            <span className="truncate font-semibold text-[#2B2E31]">{usuario.empresa.correo ?? '—'}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-[#8A8F93]">Teléfono</span>
                                            <span className="truncate font-semibold text-[#2B2E31]">{usuario.empresa.telefono ?? '—'}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-[#8A8F93]">Creado</span>
                                            <span className="truncate font-semibold text-[#2B2E31]">{formatDateTime(usuario.empresa.creadoEn)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Métricas</div>
                                    <div className="mt-3 space-y-2 text-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-[#8A8F93]">Proyectos</span>
                                            <span className="font-semibold text-[#2B2E31]">{usuario.empresa._count.proyectos}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-[#8A8F93]">Facturas</span>
                                            <span className="font-semibold text-[#2B2E31]">{usuario.empresa._count.facturas}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-[#8A8F93]">Presupuestos</span>
                                            <span className="font-semibold text-[#2B2E31]">{usuario.empresa._count.presupuestos}</span>
                                        </div>
                                    </div>

                                    {!isSuperAdmin ? (
                                        <div className="mt-4 rounded-3xl border border-[#EBD9B6] bg-[#FFF6DF] p-4 text-sm text-[#6A4A12] shadow-sm">
                                            Estás como <b>ADMIN</b>: solo lectura.
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            <ModalShell
                open={userModalOpen}
                onClose={() => setUserModalOpen(false)}
                title="Detalles del usuario"
                description="Campos completos del usuario."
                footer={<GhostButton onClick={() => setUserModalOpen(false)}>Cerrar</GhostButton>}
            >
                {usuario ? (
                    <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5">
                        <KeyRow k="ID" v={<span className="select-all">{usuario.id}</span>} />
                        <KeyRow k="Correo" v={usuario.correo} />
                        <KeyRow k="Teléfono" v={usuario.telefono ?? '—'} />
                        <KeyRow k="Rol" v={<Badge tone={roleTone(usuario.rolGlobal)}>{usuario.rolGlobal}</Badge>} />
                        <KeyRow k="Google" v={usuario.googleId ? <Badge tone="info">Sí</Badge> : <Badge tone="neutral">No</Badge>} />
                        <KeyRow k="Creado" v={formatDateTime(usuario.creadoEn)} />
                        <KeyRow k="Actualizado" v={formatDateTime(usuario.actualizadoEn)} />
                    </div>
                ) : null}
            </ModalShell>

            <ModalShell
                open={empresaDetailsOpen}
                onClose={() => setEmpresaDetailsOpen(false)}
                title="Detalles de empresa"
                description="Información de la empresa asociada."
                footer={
                    <>
                        <GhostButton onClick={() => setEmpresaDetailsOpen(false)}>Cerrar</GhostButton>
                        {usuario?.empresa ? (
                            <PrimaryButton
                                onClick={() => {
                                    setEmpresaDetailsOpen(false);
                                    router.push(`/superadmin/empresas/${usuario.empresa!.id}`);
                                }}
                            >
                                <Building2 className="h-4 w-4" />
                                Ver empresa
                                <ChevronRight className="h-4 w-4" />
                            </PrimaryButton>
                        ) : null}
                    </>
                }
            >
                {usuario?.empresa ? (
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5">
                            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Datos</div>
                            <div className="mt-3">
                                <KeyRow k="Nombre" v={usuario.empresa.nombre} />
                                <KeyRow k="CIF" v={usuario.empresa.cif ?? '—'} />
                                <KeyRow k="Correo" v={usuario.empresa.correo ?? '—'} />
                                <KeyRow k="Teléfono" v={usuario.empresa.telefono ?? '—'} />
                                <KeyRow k="Creado" v={formatDateTime(usuario.empresa.creadoEn)} />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5">
                            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Métricas</div>
                            <div className="mt-3">
                                <KeyRow k="Proyectos" v={usuario.empresa._count.proyectos} />
                                <KeyRow k="Facturas" v={usuario.empresa._count.facturas} />
                                <KeyRow k="Presupuestos" v={usuario.empresa._count.presupuestos} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-[#8A8F93]">Este usuario no tiene empresa creada.</div>
                )}
            </ModalShell>

            <CreateEmpresaForUsuarioModal
                open={empresaCreateOpen}
                onClose={() => setEmpresaCreateOpen(false)}
                usuarioId={usuarioId}
                usuarioCorreo={usuario?.correo}
                onCreated={async () => {
                    await load();
                }}
            />
        </div>
    );
}
