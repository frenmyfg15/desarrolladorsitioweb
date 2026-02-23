'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2,
    Check,
    ChevronLeft,
    ChevronRight,
    Eye,
    Loader2,
    Pencil,
    Search,
    Shield,
    ShieldCheck,
    User2,
    X,
    UserPlus,
} from 'lucide-react';

import { usuarioApi } from '@/app/api/usuarios/usuario.api';
import type { RolGlobal, UsuarioListItem } from '@/app/api/usuarios/usuario.api';
import { useSessionStore } from '@/app/store/session.store';
import NewUsuarioModal from '@/app/components/superadmin/usuarios/NewUsuarioModal';

type RolFiltro = 'todos' | RolGlobal;
type EmpresaFiltro = 'todos' | 'con' | 'sin';

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(' ');
}

const T = {
    primary: '#6FCFBA',
    dark: '#1F3D3A',
    mint: '#E9F7F3',
    white: '#FFFFFF',
    gray50: '#F2F4F5',
    gray500: '#8A8F93',
    gray900: '#2B2E31',
    border: '#DDEBE6',
    border2: '#CDEFE6',
};

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

function InlineLinkButton({
    onClick,
    disabled,
    children,
    title,
}: {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={cx(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold',
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

function TextInput({
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
                    'focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25',
                    'disabled:opacity-60'
                )}
            />
        </div>
    );
}

function SelectInput({
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
                        <IconButton onClick={onClose} title="Cerrar" variant="neutral">
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

function roleTone(rol: RolGlobal) {
    if (rol === 'SUPER_ADMIN') return 'brand' as const;
    if (rol === 'ADMIN') return 'warning' as const;
    return 'neutral' as const;
}

function roleIcon(rol: RolGlobal) {
    if (rol === 'SUPER_ADMIN') return <ShieldCheck className="h-3.5 w-3.5" />;
    if (rol === 'ADMIN') return <Shield className="h-3.5 w-3.5" />;
    return <User2 className="h-3.5 w-3.5" />;
}

function SkeletonRow() {
    return (
        <tr className="border-b border-[#EEF4F2] last:border-b-0">
            <td className="px-6 py-4">
                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-[#F2F4F5] animate-pulse" />
                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3.5 w-44 rounded bg-[#F2F4F5] animate-pulse" />
                        <div className="h-3 w-64 rounded bg-[#F2F4F5] animate-pulse" />
                        <div className="h-3 w-28 rounded bg-[#F2F4F5] animate-pulse" />
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="h-7 w-28 rounded-full bg-[#F2F4F5] animate-pulse" />
            </td>
            <td className="px-6 py-4">
                <div className="h-10 w-56 rounded-xl bg-[#F2F4F5] animate-pulse" />
            </td>
            <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                    <div className="h-10 w-10 rounded-xl bg-[#F2F4F5] animate-pulse" />
                    <div className="h-10 w-10 rounded-xl bg-[#F2F4F5] animate-pulse" />
                </div>
            </td>
        </tr>
    );
}

export default function UsuariosPage() {
    const router = useRouter();
    const { user, isLoading: sessionLoading, hydrate } = useSessionStore();

    const isSuperAdmin = user?.rolGlobal === 'SUPER_ADMIN';
    const canAccess = user?.rolGlobal === 'SUPER_ADMIN' || user?.rolGlobal === 'ADMIN';

    const [items, setItems] = useState<UsuarioListItem[]>([]);
    const [meta, setMeta] = useState<{
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [q, setQ] = useState('');
    const [rol, setRol] = useState<RolFiltro>('todos');
    const [empresa, setEmpresa] = useState<EmpresaFiltro>('todos');

    const [page, setPage] = useState(1);
    const pageSize = 20;

    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState<UsuarioListItem | null>(null);
    const [editRol, setEditRol] = useState<RolGlobal>('USUARIO');

    // ✅ Nuevo: modal crear usuario
    const [createOpen, setCreateOpen] = useState(false);

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
            const params: any = { page, pageSize };

            if (q.trim()) params.q = q.trim();
            if (rol !== 'todos') params.rolGlobal = rol;
            if (empresa === 'con') params.tieneEmpresa = true;
            if (empresa === 'sin') params.tieneEmpresa = false;

            const data = await usuarioApi.list(params);
            setItems(data.usuarios);
            setMeta(data.meta);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!canAccess) return;
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canAccess, page, pageSize, rol, empresa]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setPage(1);
        await load();
    }

    function openDetails(u: UsuarioListItem) {
        setSelected(u);
        setDetailsOpen(true);
    }

    function openEdit(u: UsuarioListItem) {
        setSelected(u);
        setEditRol(u.rolGlobal);
        setEditOpen(true);
    }

    async function changeRol(usuarioId: string, nextRol: RolGlobal) {
        if (!isSuperAdmin) return;

        setUpdatingId(usuarioId);
        setError(null);
        try {
            const updated = await usuarioApi.updateRol(usuarioId, { rolGlobal: nextRol });
            setItems((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            setSelected((prev) => (prev?.id === updated.id ? updated : prev));
            setEditOpen(false);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'No se pudo cambiar el rol.');
        } finally {
            setUpdatingId(null);
        }
    }

    const showingCount = useMemo(() => items.length, [items]);

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
                        <div className="inline-flex items-center gap-3">
                            <div className="h-11 w-11 rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] shadow-sm grid place-items-center">
                                <User2 className="h-5 w-5 text-[#1F3D3A]" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-2xl font-semibold tracking-tight text-[#2B2E31]">Usuarios</h1>
                                <p className="mt-1 text-sm text-[#8A8F93]">Gestión de usuarios internos y clientes.</p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <Badge tone="neutral">
                                Mostrando <span className="font-semibold text-[#2B2E31]">{showingCount}</span>
                                {meta ? (
                                    <>
                                        <span className="text-[#8A8F93]">/</span>
                                        <span className="font-semibold text-[#2B2E31]">{meta.total}</span>
                                    </>
                                ) : null}
                            </Badge>
                            {user?.rolGlobal ? (
                                <Badge tone={roleTone(user.rolGlobal)}>
                                    <span className="inline-flex items-center">{roleIcon(user.rolGlobal)}</span>
                                    {user.rolGlobal}
                                </Badge>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <GhostButton onClick={() => load()} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Actualizar
                        </GhostButton>

                        {isSuperAdmin ? (
                            <PrimaryButton
                                onClick={() => {
                                    setError(null);
                                    setCreateOpen(true);
                                }}
                                disabled={loading}
                            >
                                <UserPlus className="h-4 w-4" />
                                Nuevo usuario
                            </PrimaryButton>
                        ) : null}
                    </div>
                </div>
            </div>

            <form onSubmit={onSubmit} className="rounded-3xl border border-[#DDEBE6] bg-white p-4 shadow-sm md:p-5">
                <div className="grid gap-3 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-6">
                        <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Buscar</label>
                        <TextInput
                            value={q}
                            onChange={setQ}
                            placeholder="Correo, nombre, apellido o ID…"
                            leftIcon={<Search className="h-4 w-4" />}
                        />
                    </div>

                    <div className="md:col-span-3">
                        <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Rol</label>
                        <SelectInput
                            value={rol}
                            onChange={(v) => {
                                setRol(v as RolFiltro);
                                setPage(1);
                            }}
                        >
                            <option value="todos">Todos</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="USUARIO">USUARIO</option>
                        </SelectInput>
                    </div>

                    <div className="md:col-span-3">
                        <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Empresa</label>
                        <SelectInput
                            value={empresa}
                            onChange={(v) => {
                                setEmpresa(v as EmpresaFiltro);
                                setPage(1);
                            }}
                        >
                            <option value="todos">Todas</option>
                            <option value="con">Con empresa</option>
                            <option value="sin">Sin empresa</option>
                        </SelectInput>
                    </div>

                    <div className="md:col-span-12 flex justify-end pt-1">
                        <PrimaryButton>
                            <Search className="h-4 w-4" />
                            Buscar
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
                <div className="flex items-center justify-between gap-3 border-b border-[#DDEBE6] bg-white px-4 py-3 md:px-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#6FCFBA]" />
                        <div className="text-sm font-semibold text-[#2B2E31]">Listado</div>
                        <div className="text-xs text-[#8A8F93]">Usuarios</div>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <Badge tone="neutral">Page size: {pageSize}</Badge>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[#E9F7F3]/55 text-left text-[11px] uppercase tracking-wide text-[#1F3D3A]">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Usuario</th>
                                <th className="px-6 py-3 font-semibold">Rol</th>
                                <th className="px-6 py-3 font-semibold">Empresa</th>
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
                                    <SkeletonRow />
                                </>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-14">
                                        <div className="mx-auto max-w-md text-center">
                                            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A]">
                                                <Search className="h-5 w-5" />
                                            </div>
                                            <div className="mt-4 text-sm font-semibold text-[#2B2E31]">No hay usuarios</div>
                                            <div className="mt-1 text-sm text-[#8A8F93]">No hay usuarios para los filtros actuales.</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items.map((u) => {
                                    const nombre = `${u.nombre} ${u.apellido}`.trim() || 'Sin nombre';
                                    const initials = nombre
                                        .split(' ')
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((s) => s[0]?.toUpperCase())
                                        .join('');

                                    return (
                                        <tr key={u.id} className={cx('group transition-colors', 'hover:bg-[#E9F7F3]/45')}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={cx(
                                                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border',
                                                            'border-[#CDEFE6] bg-white',
                                                            'text-xs font-semibold text-[#1F3D3A] shadow-sm',
                                                            'ring-1 ring-inset ring-transparent',
                                                            'group-hover:ring-[#6FCFBA]/25'
                                                        )}
                                                    >
                                                        {initials || 'U'}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="truncate font-semibold text-[#2B2E31]">{nombre}</div>
                                                        <div className="mt-0.5 truncate text-xs text-[#8A8F93]">{u.correo}</div>
                                                        <div className="mt-1 truncate text-[11px] text-[#8A8F93]">{u.id}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <Badge tone={roleTone(u.rolGlobal)}>
                                                    <span className="inline-flex items-center">{roleIcon(u.rolGlobal)}</span>
                                                    {u.rolGlobal}
                                                </Badge>
                                            </td>

                                            <td className="px-6 py-4">
                                                {u.empresa ? (
                                                    <InlineLinkButton
                                                        title="Abrir empresa"
                                                        onClick={() => router.push(`/superadmin/empresas/${u.empresa!.id}`)}
                                                    >
                                                        <Building2 className="h-4 w-4 text-[#8A8F93]" />
                                                        <span className="max-w-[260px] truncate">{u.empresa.nombre}</span>
                                                        <ChevronRight className="ml-1 h-4 w-4 text-[#8A8F93]" />
                                                    </InlineLinkButton>
                                                ) : (
                                                    <span className="text-[#8A8F93]">—</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <IconButton title="Ver detalles" onClick={() => openDetails(u)} variant="neutral">
                                                        <Eye className="h-4 w-4" />
                                                    </IconButton>

                                                    {isSuperAdmin ? (
                                                        <IconButton
                                                            title="Editar rol"
                                                            onClick={() => openEdit(u)}
                                                            disabled={updatingId === u.id}
                                                            variant="brand"
                                                        >
                                                            {updatingId === u.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Pencil className="h-4 w-4" />
                                                            )}
                                                        </IconButton>
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

                <div className="flex flex-col gap-3 border-t border-[#DDEBE6] bg-[#E9F7F3]/25 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="neutral">
                            Página <span className="font-semibold text-[#2B2E31]">{meta?.page ?? page}</span>
                            {meta?.totalPages ? (
                                <>
                                    <span className="text-[#8A8F93]"> / </span>
                                    <span className="font-semibold text-[#2B2E31]">{meta.totalPages}</span>
                                </>
                            ) : null}
                        </Badge>

                        {meta ? (
                            <Badge tone="neutral">
                                {(meta.page - 1) * meta.pageSize + 1}–{Math.min(meta.page * meta.pageSize, meta.total)} de{' '}
                                <span className="font-semibold text-[#2B2E31]">{meta.total}</span>
                            </Badge>
                        ) : null}
                    </div>

                    <div className="flex items-center justify-between gap-2 md:justify-end">
                        <IconButton
                            title="Página anterior"
                            disabled={loading || page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            variant="neutral"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </IconButton>

                        <PrimaryButton onClick={() => setPage((p) => Math.max(1, p))} disabled>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            {loading ? 'Cargando…' : 'Listo'}
                        </PrimaryButton>

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
                    Estás como <b>ADMIN</b>: puedes listar/ver usuarios, pero no cambiar roles.
                </div>
            ) : null}

            <ModalShell
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                title="Detalles de usuario"
                description="Información básica y acceso rápido."
                footer={
                    <>
                        <GhostButton onClick={() => setDetailsOpen(false)}>Cerrar</GhostButton>
                        {selected ? (
                            <PrimaryButton
                                onClick={() => {
                                    setDetailsOpen(false);
                                    router.push(`/superadmin/usuarios/${selected.id}`);
                                }}
                            >
                                <Eye className="h-4 w-4" />
                                Ver página
                            </PrimaryButton>
                        ) : null}
                    </>
                }
            >
                {selected ? (
                    <div className="space-y-4">
                        <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/35 p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-[#2B2E31]">
                                        {`${selected.nombre} ${selected.apellido}`.trim() || 'Sin nombre'}
                                    </div>
                                    <div className="mt-1 text-sm text-[#8A8F93]">{selected.correo}</div>
                                </div>
                                <Badge tone={roleTone(selected.rolGlobal)}>{selected.rolGlobal}</Badge>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                {selected.empresa ? <Badge tone="success">Con empresa</Badge> : <Badge tone="neutral">Sin empresa</Badge>}
                                <Badge tone="neutral">
                                    ID <span className="font-mono text-[11px] text-[#2B2E31]">{selected.id}</span>
                                </Badge>
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5">
                                <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Empresa</div>
                                <div className="mt-3">
                                    {selected.empresa ? (
                                        <InlineLinkButton
                                            onClick={() => {
                                                setDetailsOpen(false);
                                                router.push(`/superadmin/empresas/${selected.empresa!.id}`);
                                            }}
                                        >
                                            <span className="inline-flex items-center gap-2 min-w-0">
                                                <Building2 className="h-4 w-4 text-[#8A8F93]" />
                                                <span className="truncate">{selected.empresa.nombre}</span>
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-[#8A8F93]" />
                                        </InlineLinkButton>
                                    ) : (
                                        <div className="text-sm text-[#8A8F93]">No tiene empresa asociada.</div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5">
                                <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Acciones</div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {isSuperAdmin ? (
                                        <GhostButton
                                            onClick={() => {
                                                setDetailsOpen(false);
                                                openEdit(selected);
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Editar rol
                                        </GhostButton>
                                    ) : null}

                                    <GhostButton
                                        onClick={() => {
                                            setDetailsOpen(false);
                                            router.push(`/superadmin/usuarios/${selected.id}`);
                                        }}
                                    >
                                        <Eye className="h-4 w-4" />
                                        Abrir ficha
                                    </GhostButton>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </ModalShell>

            <ModalShell
                open={editOpen}
                onClose={() => setEditOpen(false)}
                title="Editar rol"
                description={selected ? `${selected.correo}` : undefined}
                footer={
                    <>
                        <GhostButton onClick={() => setEditOpen(false)} disabled={!!updatingId}>
                            Cancelar
                        </GhostButton>
                        <PrimaryButton
                            onClick={() => {
                                if (!selected) return;
                                changeRol(selected.id, editRol);
                            }}
                            disabled={!selected || !!updatingId || !isSuperAdmin}
                        >
                            {updatingId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Guardar
                        </PrimaryButton>
                    </>
                }
            >
                {selected ? (
                    <div className="space-y-4">
                        <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/35 p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-[#2B2E31]">
                                        {`${selected.nombre} ${selected.apellido}`.trim() || 'Sin nombre'}
                                    </div>
                                    <div className="mt-1 text-sm text-[#8A8F93]">{selected.correo}</div>
                                </div>
                                <Badge tone={roleTone(selected.rolGlobal)}>Actual: {selected.rolGlobal}</Badge>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Nuevo rol</label>
                            <select
                                className={cx(
                                    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm',
                                    'outline-none transition',
                                    'border-[#DDEBE6] hover:border-[#BEE7DC]',
                                    'focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25',
                                    'disabled:cursor-not-allowed disabled:opacity-60'
                                )}
                                value={editRol}
                                disabled={!!updatingId}
                                onChange={(e) => setEditRol(e.target.value as RolGlobal)}
                            >
                                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="USUARIO">USUARIO</option>
                            </select>
                            <div className="mt-2 text-xs text-[#8A8F93]">
                                El cambio de rol solo está disponible para{' '}
                                <span className="font-semibold text-[#2B2E31]">SUPER_ADMIN</span>.
                            </div>
                        </div>
                    </div>
                ) : null}
            </ModalShell>

            {/* ✅ Modal Crear Usuario (separado) */}
            <NewUsuarioModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={async (created) => {
                    // refrescar listado manteniendo filtros; te llevo a la ficha para crear empresa si quieres
                    setPage(1);
                    await load();
                    router.push(`/superadmin/usuarios/${created.id}`);
                }}
            />
        </div>
    );
}
