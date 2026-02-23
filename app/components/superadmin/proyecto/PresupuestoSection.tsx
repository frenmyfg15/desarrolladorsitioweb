"use client";

import { useEffect, useMemo, useState } from "react";

import {
    CreatePresupuestoInput,
    Presupuesto,
    presupuestoApi,
    UpdatePresupuestoInput,
} from "@/app/api/presupuesto/presupuesto.api";
import {
    Activity,
    BadgeCheck,
    CheckCircle2,
    Clock3,
    Loader2,
    Pencil,
    Plus,
    Receipt,
    Save,
    Trash2,
    Wallet,
    X,
} from "lucide-react";

type RolGlobal = "SUPER_ADMIN" | "ADMIN" | "USUARIO";
type Mode = "view" | "create" | "edit";

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(" ");
}

function toNumber(decimalStr: string | null | undefined) {
    if (!decimalStr) return 0;
    const n = Number(decimalStr);
    return Number.isFinite(n) ? n : 0;
}

function formatMoney(amount: number, currency: string) {
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
    } catch {
        return `${amount.toFixed(2)} ${currency}`;
    }
}

function formatDate(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}

function Badge({
    children,
    tone = "neutral",
}: {
    children: React.ReactNode;
    tone?: "neutral" | "brand" | "warning" | "danger";
}) {
    const tones: Record<string, string> = {
        neutral: "border-[#DDEBE6] bg-white text-[#2B2E31]",
        brand: "border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A]",
        warning: "border-[#EBD9B6] bg-[#FFF6DF] text-[#6A4A12]",
        danger: "border-[#F3C6CE] bg-[#FFECEF] text-[#7B1E2B]",
    };

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
                tones[tone]
            )}
        >
            {children}
        </span>
    );
}

function Pill({
    children,
    tone = "neutral",
}: {
    children: React.ReactNode;
    tone?: "neutral" | "brand" | "warning";
}) {
    const tones: Record<string, string> = {
        neutral: "border-[#DDEBE6] bg-white text-[#2B2E31]",
        brand: "border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A]",
        warning: "border-[#EBD9B6] bg-[#FFF6DF] text-[#6A4A12]",
    };

    return (
        <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold", tones[tone])}>
            {children}
        </span>
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
                "bg-[#6FCFBA] text-[#1F3D3A]",
                "shadow-[0_10px_22px_rgba(111,207,186,0.28)] transition",
                "hover:brightness-[0.98] hover:shadow-[0_12px_26px_rgba(111,207,186,0.34)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
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
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold",
                "border-[#CDEFE6] bg-white text-[#1F3D3A] shadow-sm transition",
                "hover:bg-[#E9F7F3] hover:border-[#BEE7DC]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
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
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold",
                "border-[#F3C6CE] bg-white text-[#7B1E2B] shadow-sm transition",
                "hover:bg-[#FFECEF]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C6CE]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "active:translate-y-[1px]",
                disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
            )}
        >
            {children}
        </button>
    );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cx(
                "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm",
                "border-[#DDEBE6] placeholder:text-[#8A8F93] outline-none transition",
                "hover:border-[#BEE7DC] focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25",
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
                "w-full min-h-[112px] rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm",
                "border-[#DDEBE6] placeholder:text-[#8A8F93] outline-none transition",
                "hover:border-[#BEE7DC] focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25",
                props.disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
            )}
        />
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
                <div className="text-xs font-semibold text-[#1F3D3A]">{label}</div>
                {hint ? <div className="text-[11px] text-[#8A8F93]">{hint}</div> : null}
            </div>
            {children}
        </label>
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
        <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        {icon ? (
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                {icon}
                            </span>
                        ) : null}
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold tracking-tight text-[#2B2E31]">{title}</h3>
                            {subtitle ? <p className="mt-1 text-sm text-[#8A8F93]">{subtitle}</p> : null}
                        </div>
                    </div>
                </div>
                {right ? <div className="shrink-0">{right}</div> : null}
            </div>
            {children}
        </div>
    );
}

function StatCard({
    title,
    value,
    subtitle,
    icon,
}: {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-[#DDEBE6] bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">{title}</div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight text-[#2B2E31]">{value}</div>
                    {subtitle ? <div className="mt-1 text-xs text-[#8A8F93]">{subtitle}</div> : null}
                </div>

                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                    {icon}
                </div>
            </div>
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
                    className="w-full max-w-3xl rounded-3xl border border-[#DDEBE6] bg-white shadow-2xl"
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
                                "inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-[#2B2E31] shadow-sm transition",
                                "border-[#DDEBE6] hover:bg-[#F2F4F5]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                                "active:translate-y-[1px]"
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

export function PresupuestoSection({
    proyectoId,
    presupuesto,
    rolGlobal,
    onUpdated,
}: {
    proyectoId: string;
    presupuesto: Presupuesto | null | undefined;
    rolGlobal: RolGlobal;
    onUpdated: () => void;
}) {
    const [mode, setMode] = useState<Mode>("view");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSuper = rolGlobal === "SUPER_ADMIN";
    const canAceptar = rolGlobal === "USUARIO" || rolGlobal === "SUPER_ADMIN";

    const [createForm, setCreateForm] = useState<CreatePresupuestoInput>({
        total: "",
        moneda: "EUR",
        notas: "",
    });

    const [editForm, setEditForm] = useState<UpdatePresupuestoInput>({
        pagado: "",
        moneda: "EUR",
        notas: "",
    });

    useEffect(() => {
        if (!presupuesto) {
            setCreateForm({ total: "", moneda: "EUR", notas: "" });
            setEditForm({ pagado: "", moneda: "EUR", notas: "" });
            setMode("view");
            return;
        }

        setEditForm({
            pagado: presupuesto.pagado ?? "0",
            moneda: presupuesto.moneda ?? "EUR",
            notas: presupuesto.notas ?? "",
        });
        setMode("view");
    }, [presupuesto?.id]);

    const metrics = useMemo(() => {
        if (!presupuesto) return null;
        const moneda = presupuesto.moneda || "EUR";
        const total = toNumber(presupuesto.total);
        const pagado = toNumber(presupuesto.pagado);
        const pendiente = Math.max(0, total - pagado);
        return { moneda, total, pagado, pendiente };
    }, [presupuesto]);

    const canDelete = useMemo(() => {
        if (!presupuesto) return false;
        if (!isSuper) return false;
        const pagado = toNumber(presupuesto.pagado);
        return presupuesto.aceptado === false && pagado === 0;
    }, [presupuesto, isSuper]);

    const submitCreate = async () => {
        try {
            setSaving(true);
            setError(null);

            const totalNum = toNumber(createForm.total);
            if (totalNum <= 0) {
                setError("El total debe ser mayor que 0.");
                return;
            }

            await presupuestoApi.create(proyectoId, {
                total: String(createForm.total).trim(),
                moneda: (createForm.moneda || "EUR").trim(),
                notas: (createForm.notas || "").trim() || undefined,
            });

            setMode("view");
            onUpdated();
        } catch (e: any) {
            setError(e?.message ?? "Error creando presupuesto");
        } finally {
            setSaving(false);
        }
    };

    const submitEdit = async () => {
        if (!presupuesto) return;

        try {
            setSaving(true);
            setError(null);

            if (editForm.pagado !== undefined) {
                const pagadoNum = toNumber(editForm.pagado);
                if (pagadoNum < 0) {
                    setError("Pagado no puede ser negativo.");
                    return;
                }
            }

            await presupuestoApi.update(proyectoId, {
                pagado: editForm.pagado?.toString().trim() || undefined,
                moneda: editForm.moneda?.trim() || undefined,
                notas: (editForm.notas ?? "").trim() || undefined,
            });

            setMode("view");
            onUpdated();
        } catch (e: any) {
            setError(e?.message ?? "Error actualizando presupuesto");
        } finally {
            setSaving(false);
        }
    };

    const aceptar = async () => {
        try {
            setSaving(true);
            setError(null);
            await presupuestoApi.aceptar(proyectoId);
            onUpdated();
        } catch (e: any) {
            setError(e?.message ?? "Error aceptando presupuesto");
        } finally {
            setSaving(false);
        }
    };

    const remove = async () => {
        if (!presupuesto) return;
        if (!canDelete) return;

        const ok = window.confirm("¿Eliminar este presupuesto? (Solo si no está aceptado y pagado=0)");
        if (!ok) return;

        try {
            setSaving(true);
            setError(null);
            await presupuestoApi.delete(proyectoId);
            onUpdated();
        } catch (e: any) {
            setError(e?.message ?? "Error eliminando presupuesto");
        } finally {
            setSaving(false);
        }
    };

    const openCreate = () => {
        setError(null);
        setMode("create");
    };

    const openEdit = () => {
        setError(null);
        setMode("edit");
    };

    return (
        <section className="grid gap-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight text-[#2B2E31]">Presupuesto</h2>
                    <p className="mt-1 text-sm text-[#8A8F93]">Control de total, pagos y aceptación del cliente.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {presupuesto ? (
                        <>
                            <Badge tone={presupuesto.aceptado ? "brand" : "warning"}>
                                {presupuesto.aceptado ? <BadgeCheck className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                                {presupuesto.aceptado ? "ACEPTADO" : "SIN ACEPTAR"}
                            </Badge>
                            <Pill tone="neutral">
                                <Wallet className="h-3.5 w-3.5" />
                                {presupuesto.moneda || "EUR"}
                            </Pill>
                        </>
                    ) : (
                        <Pill tone="neutral">
                            <Receipt className="h-3.5 w-3.5" />
                            Sin presupuesto
                        </Pill>
                    )}

                    {mode === "view" && !presupuesto ? (
                        <PrimaryButton
                            onClick={openCreate}
                            disabled={!isSuper || saving}
                            title={!isSuper ? "Solo SUPER_ADMIN puede crear presupuestos" : ""}
                        >
                            <Plus className="h-4 w-4" />
                            Crear
                        </PrimaryButton>
                    ) : null}

                    {mode === "view" && presupuesto ? (
                        <>
                            <SecondaryButton
                                onClick={openEdit}
                                disabled={!isSuper || saving}
                                title={!isSuper ? "Solo SUPER_ADMIN puede editar presupuestos" : ""}
                            >
                                <Pencil className="h-4 w-4" />
                                Editar
                            </SecondaryButton>

                            <PrimaryButton
                                onClick={aceptar}
                                disabled={!canAceptar || saving || presupuesto.aceptado}
                                title={!canAceptar ? "No tienes permisos para aceptar" : presupuesto.aceptado ? "Ya está aceptado" : ""}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Aceptar
                            </PrimaryButton>

                            <DangerButton
                                onClick={remove}
                                disabled={!canDelete || saving}
                                title={
                                    !isSuper
                                        ? "Solo SUPER_ADMIN puede eliminar"
                                        : !presupuesto
                                            ? ""
                                            : presupuesto.aceptado
                                                ? "No se puede eliminar si está aceptado"
                                                : toNumber(presupuesto.pagado) !== 0
                                                    ? "No se puede eliminar si pagado > 0"
                                                    : ""
                                }
                            >
                                <Trash2 className="h-4 w-4" />
                                Eliminar
                            </DangerButton>
                        </>
                    ) : null}
                </div>
            </div>

            {error ? (
                <div className="rounded-3xl border border-[#F3C6CE] bg-[#FFECEF] p-4 text-sm text-[#7B1E2B]">
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#F3C6CE] bg-white text-[#7B1E2B] shadow-sm">
                            <Activity className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                            <div className="font-semibold">Error</div>
                            <div className="mt-1">{error}</div>
                        </div>
                    </div>
                </div>
            ) : null}

            {presupuesto && metrics ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Total"
                        value={formatMoney(metrics.total, metrics.moneda)}
                        subtitle="Importe acordado"
                        icon={<Receipt className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Pagado"
                        value={formatMoney(metrics.pagado, metrics.moneda)}
                        subtitle="Importe recibido"
                        icon={<BadgeCheck className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Pendiente"
                        value={formatMoney(metrics.pendiente, metrics.moneda)}
                        subtitle="Por cobrar"
                        icon={<Clock3 className="h-5 w-5" />}
                    />
                </div>
            ) : null}

            {mode === "view" ? (
                <Panel
                    title="Detalle"
                    subtitle={presupuesto ? "Información del presupuesto y trazabilidad." : "Aún no hay presupuesto."}
                    icon={<Receipt className="h-5 w-5" />}
                    right={
                        presupuesto ? (
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge tone="neutral">
                                    Creado: <span className="font-semibold text-[#2B2E31]">{formatDate(presupuesto.creadoEn)}</span>
                                </Badge>
                                <Badge tone="neutral">
                                    Actualizado:{" "}
                                    <span className="font-semibold text-[#2B2E31]">{formatDate(presupuesto.actualizadoEn)}</span>
                                </Badge>
                            </div>
                        ) : null
                    }
                >
                    {!presupuesto ? (
                        <div className="rounded-3xl border border-dashed border-[#DDEBE6] bg-[#F2F4F5] p-10 text-center">
                            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                <Receipt className="h-6 w-6" />
                            </div>
                            <div className="text-sm font-semibold text-[#2B2E31]">No hay presupuesto creado</div>
                            <div className="mt-1 text-sm text-[#8A8F93]">{isSuper ? "Crea uno para comenzar." : "Espera a que un admin lo cree."}</div>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/25 p-5">
                                <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Notas</div>
                                <div className="mt-2 text-sm text-[#2B2E31] whitespace-pre-wrap">
                                    {presupuesto.notas?.trim() ? presupuesto.notas : "—"}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-[#DDEBE6] bg-white p-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                            {presupuesto.aceptado ? <BadgeCheck className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}
                                        </span>
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Aceptación</div>
                                            <div className="text-sm font-semibold text-[#2B2E31]">{presupuesto.aceptado ? "Aceptado" : "Pendiente"}</div>
                                            <div className="mt-1 text-xs text-[#8A8F93]">
                                                {formatDate(presupuesto.aceptadoEn)} · {presupuesto.aceptadoPor ?? "—"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Badge tone={presupuesto.aceptado ? "brand" : "warning"}>
                                            {presupuesto.aceptado ? "ACEPTADO" : "SIN ACEPTAR"}
                                        </Badge>
                                        {metrics ? (
                                            <Badge tone={metrics.pendiente === 0 ? "brand" : "warning"}>
                                                {metrics.pendiente === 0 ? "AL DÍA" : "PENDIENTE"}
                                            </Badge>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Panel>
            ) : null}

            <ModalShell
                open={mode === "create"}
                onClose={() => {
                    if (saving) return;
                    setMode("view");
                }}
                title="Crear presupuesto"
                description="Define total, moneda y notas."
                footer={
                    <>
                        <SecondaryButton onClick={() => setMode("view")} disabled={saving}>
                            <X className="h-4 w-4" />
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton onClick={submitCreate} disabled={!isSuper || saving} title={!isSuper ? "Solo SUPER_ADMIN puede crear" : ""}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving ? "Guardando…" : "Crear"}
                        </PrimaryButton>
                    </>
                }
            >
                <div className="grid gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <Field label="Total" hint="Mayor que 0">
                                <Input
                                    value={createForm.total}
                                    onChange={(e) => setCreateForm({ ...createForm, total: e.target.value })}
                                    placeholder="Ej: 1200.00"
                                    inputMode="decimal"
                                />
                            </Field>
                        </div>

                        <Field label="Moneda" hint="ISO 4217 (EUR, USD, ...)">
                            <Input
                                value={createForm.moneda ?? "EUR"}
                                onChange={(e) => setCreateForm({ ...createForm, moneda: e.target.value })}
                                placeholder="EUR"
                            />
                        </Field>
                    </div>

                    <Field label="Notas" hint="Opcional">
                        <Textarea
                            value={createForm.notas ?? ""}
                            onChange={(e) => setCreateForm({ ...createForm, notas: e.target.value })}
                            placeholder="Condiciones, alcance, plazos, etc."
                        />
                    </Field>

                    <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/25 p-4">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                <Wallet className="h-5 w-5" />
                            </span>
                            <div>
                                <div className="text-sm font-semibold text-[#2B2E31]">Listo para enviar al cliente</div>
                                <div className="mt-1 text-xs text-[#8A8F93]">Podrá aceptarlo cuando corresponda.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalShell>

            <ModalShell
                open={mode === "edit" && !!presupuesto}
                onClose={() => {
                    if (saving) return;
                    setMode("view");
                }}
                title="Editar presupuesto"
                description="Actualiza pagos, moneda o notas."
                footer={
                    <>
                        <SecondaryButton onClick={() => setMode("view")} disabled={saving}>
                            <X className="h-4 w-4" />
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton onClick={submitEdit} disabled={!isSuper || saving} title={!isSuper ? "Solo SUPER_ADMIN puede editar" : ""}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving ? "Guardando…" : "Guardar"}
                        </PrimaryButton>
                    </>
                }
            >
                <div className="grid gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <Field label="Pagado" hint="No negativo">
                                <Input
                                    value={editForm.pagado ?? ""}
                                    onChange={(e) => setEditForm({ ...editForm, pagado: e.target.value })}
                                    placeholder="Ej: 0.00"
                                    inputMode="decimal"
                                />
                            </Field>
                        </div>

                        <Field label="Moneda" hint="ISO 4217">
                            <Input
                                value={editForm.moneda ?? "EUR"}
                                onChange={(e) => setEditForm({ ...editForm, moneda: e.target.value })}
                                placeholder="EUR"
                            />
                        </Field>
                    </div>

                    <Field label="Notas" hint="Opcional">
                        <Textarea
                            value={editForm.notas ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, notas: e.target.value })}
                            placeholder="Condiciones, alcance, plazos, etc."
                        />
                    </Field>

                    <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/25 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                    <BadgeCheck className="h-5 w-5" />
                                </span>
                                <div>
                                    <div className="text-sm font-semibold text-[#2B2E31]">Control de pagos</div>
                                    <div className="mt-1 text-xs text-[#8A8F93]">Actualiza “pagado” para reflejar ingresos.</div>
                                </div>
                            </div>

                            {metrics ? (
                                <div className="flex flex-wrap gap-2">
                                    <Badge tone="neutral">Total: {formatMoney(metrics.total, metrics.moneda)}</Badge>
                                    <Badge tone="brand">Pagado: {formatMoney(toNumber(editForm.pagado ?? "0"), metrics.moneda)}</Badge>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </ModalShell>

            <div className="rounded-3xl border border-[#DDEBE6] bg-[#1F3D3A] p-5 text-white shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/10 text-[#6FCFBA]">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs font-medium text-white/60 uppercase tracking-widest">Estado</div>
                            <div className="text-lg font-bold">
                                {presupuesto
                                    ? presupuesto.aceptado
                                        ? "Presupuesto aceptado"
                                        : "Pendiente de aceptación"
                                    : "Sin presupuesto"}
                            </div>
                            <div className="mt-1 text-xs text-white/60">
                                {presupuesto?.actualizadoEn ? `Actualizado: ${formatDate(presupuesto.actualizadoEn)}` : "—"}
                            </div>
                        </div>
                    </div>

                    {metrics ? (
                        <div className="flex gap-3">
                            <div className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium border border-white/10">
                                {metrics.moneda}
                            </div>
                            <div
                                className={cx(
                                    "rounded-full px-4 py-1.5 text-xs font-bold border border-white/10",
                                    metrics.pendiente === 0 ? "bg-[#6FCFBA]/20 text-[#6FCFBA]" : "bg-amber-500/20 text-amber-200"
                                )}
                            >
                                {metrics.pendiente === 0 ? "AL DÍA" : "PENDIENTE"}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
