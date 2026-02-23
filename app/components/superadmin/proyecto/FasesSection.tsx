"use client";

import React, { useEffect, useMemo, useState } from "react";
import { faseApi } from "@/app/api/fases/fase.api";
import type { Fase, EstadoFase, CreateFaseInput, UpdateFaseInput } from "@/app/api/fases/fase.api";
import {
    Activity,
    BadgeCheck,
    Clock3,
    Link as LinkIcon,
    Plus,
    Save,
    Trash2,
    Pencil,
    Layers,
    Loader2,
    X,
} from "lucide-react";

type RolGlobal = "SUPER_ADMIN" | "ADMIN" | "USUARIO";
type Mode = "view" | "create" | "edit";

const ESTADOS: EstadoFase[] = ["EN_PROCESO", "LISTO_PENDIENTE_PAGO", "LISTO_PAGADO"];

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(" ");
}

function formatDate(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}

/** Brand palette (mint) */
const UI = {
    brand: "#6FCFBA",
    brandSoft: "#E9F7F3",
    ink: "#2B2E31",
    ink2: "#1F3D3A",
    muted: "#8A8F93",
    line: "#DDEBE6",
    line2: "#CDEFE6",
    warnLine: "#EBD9B6",
    warnBg: "#FFF6DF",
    dangerLine: "#F3C6CE",
    dangerBg: "#FFECEF",
    surface: "#FFFFFF",
    wash: "#F2F4F5",
    dark: "#1F3D3A",
};

function Pill({
    children,
    tone = "neutral",
}: {
    children: React.ReactNode;
    tone?: "neutral" | "brand" | "warning" | "good";
}) {
    const tones: Record<string, string> = {
        neutral: `border-[${UI.line}] bg-white text-[${UI.ink}]`,
        brand: `border-[${UI.line2}] bg-[${UI.brandSoft}] text-[${UI.ink2}]`,
        warning: `border-[${UI.warnLine}] bg-[${UI.warnBg}] text-[#6A4A12]`,
        good: `border-[${UI.line2}] bg-[${UI.brandSoft}] text-[${UI.ink2}]`,
    };

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
                tones[tone]
            )}
        >
            {children}
        </span>
    );
}

function Panel({
    title,
    subtitle,
    icon,
    right,
    children,
}: {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className={cx("rounded-3xl border bg-white p-5 shadow-sm", `border-[${UI.line}]`)}>
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        {icon ? (
                            <span
                                className={cx(
                                    "inline-flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm",
                                    `border-[${UI.line2}] bg-[${UI.brandSoft}] text-[${UI.ink2}]`
                                )}
                            >
                                {icon}
                            </span>
                        ) : null}
                        <div className="min-w-0">
                            <h3 className={cx("text-sm font-bold tracking-tight", `text-[${UI.ink}]`)}>{title}</h3>
                            {subtitle ? <p className={cx("mt-1 text-sm", `text-[${UI.muted}]`)}>{subtitle}</p> : null}
                        </div>
                    </div>
                </div>
                {right ? <div className="shrink-0">{right}</div> : null}
            </div>

            {children}
        </div>
    );
}

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="grid gap-2">
            <div className="flex items-end justify-between gap-3">
                <div className={cx("text-xs font-semibold", `text-[${UI.ink2}]`)}>{label}</div>
                {hint ? <div className={cx("text-[11px]", `text-[${UI.muted}]`)}>{hint}</div> : null}
            </div>
            {children}
        </label>
    );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cx(
                "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition",
                `border-[${UI.line}] text-[${UI.ink}] placeholder:text-[${UI.muted}]`,
                `hover:border-[${UI.line2}] focus:border-[${UI.brand}] focus:ring-2 focus:ring-[${UI.brand}]/25`,
                props.disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
            )}
        />
    );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={cx(
                "w-full min-h-[112px] rounded-xl border bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition",
                `border-[${UI.line}] text-[${UI.ink}] placeholder:text-[${UI.muted}]`,
                `hover:border-[${UI.line2}] focus:border-[${UI.brand}] focus:ring-2 focus:ring-[${UI.brand}]/25`,
                props.disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
            )}
        />
    );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={cx(
                "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition",
                `border-[${UI.line}] text-[${UI.ink}]`,
                `hover:border-[${UI.line2}] focus:border-[${UI.brand}] focus:ring-2 focus:ring-[${UI.brand}]/25`,
                props.disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
            )}
        />
    );
}

function PrimaryButton({
    children,
    disabled,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
                `bg-[${UI.brand}] text-[${UI.ink2}]`,
                "shadow-[0_10px_22px_rgba(111,207,186,0.28)] transition",
                "hover:brightness-[0.98] hover:shadow-[0_12px_26px_rgba(111,207,186,0.34)]",
                `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${UI.brand}]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white`,
                "active:translate-y-[1px]",
                disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
            )}
        >
            {children}
        </button>
    );
}

function SecondaryButton({
    children,
    disabled,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition",
                `border-[${UI.line2}] bg-white text-[${UI.ink2}]`,
                `hover:bg-[${UI.brandSoft}] hover:border-[${UI.line2}]`,
                `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${UI.brand}]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white`,
                "active:translate-y-[1px]",
                disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
            )}
        >
            {children}
        </button>
    );
}

function DangerButton({
    children,
    disabled,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition",
                `border-[${UI.dangerLine}] bg-white text-[#7B1E2B]`,
                `hover:bg-[${UI.dangerBg}]`,
                `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${UI.dangerLine}]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white`,
                "active:translate-y-[1px]",
                disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
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
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" onMouseDown={onClose} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    className={cx("w-full max-w-3xl rounded-3xl border bg-white shadow-2xl", `border-[${UI.line}]`)}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className={cx("flex items-start justify-between gap-3 border-b px-5 py-4", `border-[${UI.line}]`)}>
                        <div className="min-w-0">
                            <div className={cx("text-base font-semibold", `text-[${UI.ink}]`)}>{title}</div>
                            {description ? <div className={cx("mt-1 text-sm", `text-[${UI.muted}]`)}>{description}</div> : null}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className={cx(
                                "inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white shadow-sm transition",
                                `border-[${UI.line}] text-[${UI.ink}] hover:bg-[${UI.wash}]`,
                                `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${UI.brand}]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white`,
                                "active:translate-y-[1px]"
                            )}
                            title="Cerrar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="px-5 py-4">{children}</div>

                    {footer ? (
                        <div className={cx("flex items-center justify-end gap-2 border-t px-5 py-4", `border-[${UI.line}]`)}>
                            {footer}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function StateBadge({ estado }: { estado: EstadoFase }) {
    if (estado === "LISTO_PAGADO") {
        return (
            <Pill tone="good">
                <BadgeCheck className="h-3.5 w-3.5" />
                PAGADO
            </Pill>
        );
    }
    if (estado === "LISTO_PENDIENTE_PAGO") {
        return (
            <Pill tone="warning">
                <Clock3 className="h-3.5 w-3.5" />
                PENDIENTE
            </Pill>
        );
    }
    return (
        <Pill tone="brand">
            <Activity className="h-3.5 w-3.5" />
            EN PROCESO
        </Pill>
    );
}

export function FasesSection({
    proyectoId,
    fases,
    rolGlobal,
    onUpdated,
}: {
    proyectoId: string;
    fases: Fase[];
    rolGlobal: RolGlobal;
    onUpdated: () => void;
}) {
    const isSuper = rolGlobal === "SUPER_ADMIN";

    const [mode, setMode] = useState<Mode>("view");
    const [selected, setSelected] = useState<Fase | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sorted = useMemo(
        () => [...fases].sort((a, b) => (a.orden ?? 9999) - (b.orden ?? 9999)),
        [fases]
    );

    const totals = useMemo(() => {
        const enProceso = sorted.filter((f) => f.estado === "EN_PROCESO").length;
        const pendiente = sorted.filter((f) => f.estado === "LISTO_PENDIENTE_PAGO").length;
        const pagado = sorted.filter((f) => f.estado === "LISTO_PAGADO").length;
        return { total: sorted.length, enProceso, pendiente, pagado };
    }, [sorted]);

    const [createForm, setCreateForm] = useState<CreateFaseInput>({
        nombre: "",
        descripcion: "",
        orden: undefined,
    });

    const [editForm, setEditForm] = useState<UpdateFaseInput>({});

    useEffect(() => {
        if (!selected) return;
        setEditForm({
            nombre: selected.nombre,
            descripcion: selected.descripcion ?? "",
            estado: selected.estado,
            urlEntrega: selected.urlEntrega ?? "",
            entregadoEn: selected.entregadoEn,
            orden: selected.orden ?? undefined,
        });
    }, [selected?.id]);

    const closeModal = () => {
        setMode("view");
        setSelected(null);
        setError(null);
    };

    const openCreate = () => {
        setError(null);
        setMode("create");
    };

    const openEdit = (fase: Fase) => {
        setError(null);
        setSelected(fase);
        setMode("edit");
    };

    const submitCreate = async () => {
        if (!createForm.nombre.trim()) {
            setError("El nombre es obligatorio");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            await faseApi.create(proyectoId, createForm);
            setCreateForm({ nombre: "", descripcion: "", orden: undefined });
            closeModal();
            onUpdated();
        } catch (e: any) {
            setError(e?.message ?? "Error creando fase");
        } finally {
            setSaving(false);
        }
    };

    const submitEdit = async () => {
        if (!selected) return;

        try {
            setSaving(true);
            setError(null);
            await faseApi.update(selected.id, editForm);
            closeModal();
            onUpdated();
        } catch (e: any) {
            setError(e?.message ?? "Error actualizando fase");
        } finally {
            setSaving(false);
        }
    };

    const remove = async (fase: Fase) => {
        if (!isSuper) return;
        const ok = window.confirm(`¿Eliminar la fase "${fase.nombre}"?`);
        if (!ok) return;

        try {
            setSaving(true);
            setError(null);
            await faseApi.delete(fase.id);
            onUpdated();
        } catch (e: any) {
            setError(e?.message ?? "Error eliminando fase");
        } finally {
            setSaving(false);
        }
    };

    const lastDelivered = useMemo(() => {
        const delivered = sorted.filter((x) => !!x.entregadoEn);
        if (delivered.length === 0) return null;
        return delivered
            .slice()
            .sort((a, b) => new Date(b.entregadoEn as any).getTime() - new Date(a.entregadoEn as any).getTime())[0];
    }, [sorted]);

    return (
        <section className="grid gap-6">
            {/* Header / Stats */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className={cx("text-xl font-semibold tracking-tight", `text-[${UI.ink}]`)}>Fases</h2>
                    <p className={cx("mt-1 text-sm", `text-[${UI.muted}]`)}>
                        Orden, estado y entrega de cada fase del proyecto.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Pill tone="neutral">{totals.total} total</Pill>
                    <Pill tone="brand">{totals.enProceso} en proceso</Pill>
                    <Pill tone="warning">{totals.pendiente} pendientes</Pill>
                    <Pill tone="good">{totals.pagado} pagadas</Pill>

                    {isSuper ? (
                        <PrimaryButton onClick={openCreate} disabled={saving}>
                            <Plus className="h-4 w-4" />
                            Crear fase
                        </PrimaryButton>
                    ) : null}
                </div>
            </div>

            {/* Error */}
            {error ? (
                <div className={cx("rounded-3xl border p-4 text-sm", `border-[${UI.dangerLine}] bg-[${UI.dangerBg}] text-[#7B1E2B]`)}>
                    <div className="flex items-start gap-3">
                        <span className={cx("mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-white shadow-sm", `border-[${UI.dangerLine}]`)}>
                            <Activity className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                            <div className="font-semibold">Error</div>
                            <div className="mt-1">{error}</div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* LIST */}
            <Panel title="Listado" subtitle="Ordenado por el campo “orden”." icon={<Layers className="h-5 w-5" />}>
                {sorted.length === 0 ? (
                    <div className={cx("rounded-3xl border border-dashed p-10 text-center", `border-[${UI.line}] bg-[${UI.wash}]`)}>
                        <div className={cx("mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm", `border-[${UI.line2}] bg-[${UI.brandSoft}] text-[${UI.ink2}]`)}>
                            <Layers className="h-6 w-6" />
                        </div>
                        <div className={cx("text-sm font-semibold", `text-[${UI.ink}]`)}>No hay fases</div>
                        <div className={cx("mt-1 text-sm", `text-[${UI.muted}]`)}>
                            {isSuper ? "Crea la primera fase para empezar." : "Aún no se han definido fases."}
                        </div>
                    </div>
                ) : (
                    <div className={cx("overflow-hidden rounded-3xl border", `border-[${UI.line}]`)}>
                        <div className="overflow-x-auto">
                            <table className="min-w-[860px] w-full border-collapse">
                                <thead className={cx(`bg-[${UI.brandSoft}]`)}>
                                    <tr>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>
                                            Orden
                                        </th>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>
                                            Fase
                                        </th>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>
                                            Estado
                                        </th>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>
                                            Entrega
                                        </th>
                                        {isSuper ? (
                                            <th className={cx("px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>
                                                Acciones
                                            </th>
                                        ) : null}
                                    </tr>
                                </thead>

                                <tbody className="bg-white">
                                    {sorted.map((f) => (
                                        <tr key={f.id} className={cx("border-t transition", `border-[${UI.line}] hover:bg-[${UI.wash}]`)}>
                                            <td className="px-4 py-3 align-top">
                                                <Pill tone="neutral">{f.orden ?? "—"}</Pill>
                                            </td>

                                            <td className="px-4 py-3 align-top">
                                                <div className={cx("font-semibold", `text-[${UI.ink}]`)}>{f.nombre}</div>
                                                <div className={cx("mt-1 text-xs", `text-[${UI.muted}]`)}>
                                                    {f.descripcion?.trim() ? f.descripcion : "—"}
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 align-top">
                                                <StateBadge estado={f.estado} />
                                            </td>

                                            <td className="px-4 py-3 align-top">
                                                {f.urlEntrega ? (
                                                    <a
                                                        href={f.urlEntrega}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={cx(
                                                            "inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-semibold shadow-sm transition",
                                                            `border-[${UI.line2}] text-[${UI.ink2}] hover:bg-[${UI.brandSoft}]`,
                                                            `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${UI.brand}]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white`
                                                        )}
                                                    >
                                                        <LinkIcon className="h-4 w-4" />
                                                        Ver entrega
                                                    </a>
                                                ) : (
                                                    <span className={cx("text-sm", `text-[${UI.muted}]`)}>—</span>
                                                )}

                                                <div className={cx("mt-2 text-xs", `text-[${UI.muted}]`)}>
                                                    {f.entregadoEn ? `Entregado: ${formatDate(f.entregadoEn)}` : "—"}
                                                </div>
                                            </td>

                                            {isSuper ? (
                                                <td className="px-4 py-3 align-top">
                                                    <div className="flex justify-end gap-2">
                                                        <SecondaryButton onClick={() => openEdit(f)} disabled={saving}>
                                                            <Pencil className="h-4 w-4" />
                                                            Editar
                                                        </SecondaryButton>

                                                        <DangerButton onClick={() => remove(f)} disabled={saving}>
                                                            <Trash2 className="h-4 w-4" />
                                                            Eliminar
                                                        </DangerButton>
                                                    </div>
                                                </td>
                                            ) : null}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Panel>

            {/* CREATE MODAL */}
            <ModalShell
                open={mode === "create"}
                onClose={() => {
                    if (saving) return;
                    closeModal();
                }}
                title="Nueva fase"
                description="Define nombre, descripción y orden."
                footer={
                    <>
                        <SecondaryButton onClick={closeModal} disabled={saving}>
                            <X className="h-4 w-4" />
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton onClick={submitCreate} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving ? "Creando…" : "Crear"}
                        </PrimaryButton>
                    </>
                }
            >
                <div className="grid gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <Field label="Nombre" hint="Obligatorio">
                                <Input
                                    placeholder="Ej. Diseño UI"
                                    value={createForm.nombre}
                                    onChange={(e) => setCreateForm({ ...createForm, nombre: e.target.value })}
                                />
                            </Field>
                        </div>

                        <Field label="Orden" hint="Menor = aparece antes">
                            <Input
                                type="number"
                                placeholder="Ej. 10"
                                value={createForm.orden ?? ""}
                                onChange={(e) =>
                                    setCreateForm({
                                        ...createForm,
                                        orden: e.target.value ? Number(e.target.value) : undefined,
                                    })
                                }
                            />
                        </Field>
                    </div>

                    <Field label="Descripción" hint="Opcional">
                        <Textarea
                            placeholder="Qué incluye esta fase, criterios de entrega, etc."
                            value={createForm.descripcion ?? ""}
                            onChange={(e) => setCreateForm({ ...createForm, descripcion: e.target.value })}
                        />
                    </Field>

                    <div className={cx("rounded-3xl border p-4", `border-[${UI.line}] bg-[${UI.brandSoft}]/30`)}>
                        <div className="flex items-start gap-3">
                            <span className={cx("mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-white shadow-sm", `border-[${UI.line2}] text-[${UI.ink2}]`)}>
                                <Layers className="h-5 w-5" />
                            </span>
                            <div className="min-w-0">
                                <div className={cx("text-sm font-semibold", `text-[${UI.ink}]`)}>Consejo</div>
                                <div className={cx("mt-1 text-xs", `text-[${UI.muted}]`)}>
                                    Usa “orden” con saltos (10, 20, 30…) para reordenar sin renumerar todo.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalShell>

            {/* EDIT MODAL */}
            <ModalShell
                open={mode === "edit" && !!selected}
                onClose={() => {
                    if (saving) return;
                    closeModal();
                }}
                title="Editar fase"
                description={selected ? `Editando: ${selected.nombre}` : "Actualizar datos de la fase."}
                footer={
                    <>
                        <SecondaryButton onClick={closeModal} disabled={saving}>
                            <X className="h-4 w-4" />
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton onClick={submitEdit} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving ? "Guardando…" : "Guardar"}
                        </PrimaryButton>
                    </>
                }
            >
                <div className="grid gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <Field label="Nombre">
                                <Input
                                    value={editForm.nombre ?? ""}
                                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                                />
                            </Field>
                        </div>

                        <Field label="Orden" hint="Menor = aparece antes">
                            <Input
                                type="number"
                                placeholder="Ej. 10"
                                value={(editForm.orden as any) ?? ""}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        orden: e.target.value ? Number(e.target.value) : null,
                                    })
                                }
                            />
                        </Field>
                    </div>

                    <Field label="Descripción">
                        <Textarea
                            value={(editForm.descripcion as any) ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                        />
                    </Field>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Field label="Estado">
                            <Select
                                value={(editForm.estado as any) ?? selected?.estado}
                                onChange={(e) => setEditForm({ ...editForm, estado: e.target.value as EstadoFase })}
                            >
                                {ESTADOS.map((e) => (
                                    <option key={e} value={e}>
                                        {e}
                                    </option>
                                ))}
                            </Select>
                        </Field>

                        <div className="md:col-span-2">
                            <Field label="URL de entrega" hint="Opcional">
                                <Input
                                    placeholder="https://..."
                                    value={(editForm.urlEntrega as any) ?? ""}
                                    onChange={(e) => setEditForm({ ...editForm, urlEntrega: e.target.value })}
                                />
                            </Field>
                        </div>
                    </div>

                    <Field label="Entregado en" hint="Opcional">
                        <Input
                            type="datetime-local"
                            value={editForm.entregadoEn ? new Date(editForm.entregadoEn as any).toISOString().slice(0, 16) : ""}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    entregadoEn: e.target.value ? new Date(e.target.value).toISOString() : null,
                                })
                            }
                        />
                    </Field>

                    <div className={cx("rounded-3xl border p-4", `border-[${UI.line}] bg-[${UI.wash}]`)}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className={cx("inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-white shadow-sm", `border-[${UI.line2}] text-[${UI.ink2}]`)}>
                                    <BadgeCheck className="h-5 w-5" />
                                </span>
                                <div>
                                    <div className={cx("text-sm font-semibold", `text-[${UI.ink}]`)}>Tip de estado</div>
                                    <div className={cx("mt-1 text-xs", `text-[${UI.muted}]`)}>
                                        “LISTO_PENDIENTE_PAGO” para entregar y “LISTO_PAGADO” cuando esté cobrado.
                                    </div>
                                </div>
                            </div>

                            {selected ? (
                                <Pill tone="neutral">
                                    Actualizado: <span className="font-semibold">{formatDate(selected.actualizadoEn ?? null)}</span>
                                </Pill>
                            ) : null}
                        </div>
                    </div>
                </div>
            </ModalShell>

            {/* Footer “dark card” (sin bordes negros, manteniendo brand) */}
            <div className={cx("rounded-3xl border p-5 text-white shadow-lg", `border-[${UI.line}] bg-[${UI.dark}]`)}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/10 text-[#6FCFBA]">
                            <Layers className="h-6 w-6" />
                        </div>

                        <div>
                            <div className="text-xs font-medium text-white/60 uppercase tracking-widest">Última fase entregada</div>
                            <div className="text-lg font-bold">{lastDelivered?.nombre ?? "Sin entregas registradas"}</div>
                            <div className="mt-1 text-xs text-white/60">{lastDelivered?.entregadoEn ? formatDate(lastDelivered.entregadoEn) : "—"}</div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium border border-white/10">
                            Proyecto
                        </div>
                        <div className="rounded-full px-4 py-1.5 text-xs font-bold bg-[#6FCFBA]/20 text-[#6FCFBA] border border-white/10">
                            FASES
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
