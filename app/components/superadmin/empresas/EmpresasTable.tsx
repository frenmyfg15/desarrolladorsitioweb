'use client';

import React from 'react';
import type { EmpresaWithUsuario } from '@/app/api/empresa/empresa.api';
import { Building2, Eye, Pencil, Trash2, User2 } from 'lucide-react';

type Props = {
    items: EmpresaWithUsuario[];
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete?: (id: string) => void;
    deletingId?: string | null;
};

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(' ');
}

function IconButton({
    onClick,
    title,
    disabled,
    tone = 'neutral',
    children,
}: {
    onClick?: () => void;
    title?: string;
    disabled?: boolean;
    tone?: 'neutral' | 'danger';
    children: React.ReactNode;
}) {
    const tones: Record<string, string> = {
        neutral: 'border-[#DDEBE6] bg-white text-[#1F3D3A] hover:bg-[#E9F7F3] hover:border-[#BEE7DC]',
        danger: 'border-[#F3C6CE] bg-white text-[#7B1E2B] hover:bg-[#FFECEF]',
    };

    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={cx(
                'inline-flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                'active:translate-y-[1px]',
                'disabled:cursor-not-allowed disabled:opacity-60',
                tones[tone]
            )}
        >
            {children}
        </button>
    );
}

function Badge({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <span className="inline-flex items-center rounded-full border border-[#CDEFE6] bg-[#E9F7F3] px-2.5 py-1 text-xs font-semibold text-[#1F3D3A]">
            {children}
        </span>
    );
}

export default function EmpresasTable({ items, onView, onEdit, onDelete, deletingId }: Props) {
    return (
        <div className="overflow-hidden rounded-3xl border border-[#DDEBE6] bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-[#E9F7F3]/55 text-left text-[11px] uppercase tracking-wide text-[#1F3D3A]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Empresa</th>
                            <th className="px-6 py-4 font-semibold">CIF</th>
                            <th className="px-6 py-4 font-semibold">Correo</th>
                            <th className="px-6 py-4 font-semibold">Teléfono</th>
                            <th className="px-6 py-4 font-semibold">Responsable</th>
                            <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[#EEF4F2]">
                        {items.map((e) => {
                            const responsableNombre =
                                [e.usuario?.nombre, e.usuario?.apellido].filter(Boolean).join(' ') || '—';

                            return (
                                <tr key={e.id} className="group transition-colors hover:bg-[#E9F7F3]/45">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                                <Building2 className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="font-semibold text-[#2B2E31]">{e.nombre}</div>
                                                <div className="mt-0.5 truncate font-mono text-[12px] text-[#8A8F93]">{e.id}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-[#2B2E31]">{e.cif ?? '—'}</span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="min-w-0">
                                            <div className="truncate font-semibold text-[#2B2E31]">{e.correo ?? '—'}</div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[#2B2E31]">{e.telefono ?? '—'}</div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#DDEBE6] bg-white text-[#2B2E31] shadow-sm">
                                                <User2 className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="font-semibold text-[#2B2E31]">{responsableNombre}</div>
                                                <div className="mt-0.5 truncate text-xs text-[#8A8F93]">{e.usuario?.correo ?? '—'}</div>
                                                {e.usuario?.rolGlobal ? (
                                                    <div className="mt-2">
                                                        <Badge>{e.usuario.rolGlobal}</Badge>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <IconButton title="Ver" onClick={() => onView(e.id)}>
                                                <Eye className="h-4 w-4" />
                                            </IconButton>

                                            <IconButton title="Editar" onClick={() => onEdit(e.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </IconButton>

                                            {onDelete ? (
                                                <IconButton
                                                    title="Eliminar"
                                                    tone="danger"
                                                    disabled={deletingId === e.id}
                                                    onClick={() => onDelete(e.id)}
                                                >
                                                    <Trash2 className={cx('h-4 w-4', deletingId === e.id ? 'animate-pulse' : '')} />
                                                </IconButton>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[#EEF4F2] bg-white px-6 py-4 text-xs text-[#8A8F93]">
                <div className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#6FCFBA]" />
                    Tabla interactiva: hover y foco mejorados
                </div>
                <div className="font-semibold text-[#2B2E31]">{items.length} empresas</div>
            </div>
        </div>
    );
}
