"use client";

import React, { useMemo, useState, useEffect } from "react";
import { CreateFacturaInput, Factura, facturaApi } from "@/app/api/facturas/factura.api";
import {
    Activity,
    BadgeCheck,
    Clock3,
    FileDown,
    Plus,
    Receipt,
    Save,
    X,
    Loader2,
} from "lucide-react";
import { Fase } from "@/app/api/fases/fase.api";

type RolGlobal = "SUPER_ADMIN" | "ADMIN" | "USUARIO";

/** ---------- Helpers ---------- */
function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(" ");
}

function formatDate(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
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

/** ---------- Mint theme (coherente con los modales anteriores) ---------- */
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
    wash: "#F2F4F5",
    dark: "#1F3D3A",
};

/** ---------- UI Primitives ---------- */
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
                tones[tone]
            )}
        >
            {children}
        </span>
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
                `hover:bg-[${UI.brandSoft}]`,
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
        <div className={cx("rounded-3xl border bg-white p-4 shadow-sm transition-all hover:shadow-md", `border-[${UI.line}]`)}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className={cx("text-xs font-medium uppercase tracking-wider", `text-[${UI.muted}]`)}>{title}</div>
                    <div className={cx("mt-2 text-2xl font-extrabold tracking-tight", `text-[${UI.ink}]`)}>{value}</div>
                    {subtitle ? <div className={cx("mt-1 text-xs", `text-[${UI.muted}]`)}>{subtitle}</div> : null}
                </div>
                <div className={cx("inline-flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm", `border-[${UI.line2}] bg-[${UI.brandSoft}] text-[${UI.ink2}]`)}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className={cx("flex items-center justify-center rounded-3xl border border-dashed p-10 text-sm", `border-[${UI.line}] bg-[${UI.wash}] text-[${UI.muted}]`)}>
            {text}
        </div>
    );
}

function ErrorBanner({ error }: { error: string }) {
    return (
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
    );
}

/** ---------- Modal ---------- */
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
                    className={cx("w-full max-w-2xl rounded-3xl border bg-white shadow-2xl", `border-[${UI.line}]`)}
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

/** ---------- Component ---------- */
export function FacturasSection({
    fases,
    rolGlobal,
    onUpdated,
}: {
    fases: (Fase & { factura?: Factura | null })[];
    rolGlobal: RolGlobal;
    onUpdated: () => void;
}) {
    const isSuper = rolGlobal === "SUPER_ADMIN";

    const [creatingFor, setCreatingFor] = useState<Fase | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const facturas = useMemo(() => {
        return fases.map((f) => (f as any).factura).filter(Boolean) as Factura[];
    }, [fases]);

    const metrics = useMemo(() => {
        const total = facturas.length;
        const pagadas = facturas.filter((f) => Boolean(f.pagadaEn)).length;
        const pendientes = total - pagadas;
        return { total, pagadas, pendientes };
    }, [facturas]);

    const submitCreate = async (fase: Fase, form: CreateFacturaInput) => {
        try {
            setSaving(true);
            setError(null);

            // Validación mínima
            const importeNum = toNumber(form.importe as any);
            if (importeNum <= 0) {
                setError("El importe debe ser mayor que 0.");
                return;
            }

            await facturaApi.createForFase(fase.id, form);
            setCreatingFor(null);
            onUpdated();
        } catch (e: any) {
            setError(e?.message ?? "Error creando factura");
        } finally {
            setSaving(false);
        }
    };

    const togglePagada = async (factura: Factura) => {
        try {
            setSaving(true);
            setError(null);
            await facturaApi.marcarPagada(factura.id, { pagada: !factura.pagadaEn });
            onUpdated();
        } catch (e: any) {
            setError(e?.message ?? "Error actualizando estado de pago");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="grid gap-6">
            {error ? <ErrorBanner error={error} /> : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard title="Total" value={metrics.total} subtitle="Facturas asociadas" icon={<Receipt className="h-5 w-5" />} />
                <StatCard title="Pagadas" value={metrics.pagadas} subtitle="Cerradas" icon={<BadgeCheck className="h-5 w-5" />} />
                <StatCard title="Pendientes" value={metrics.pendientes} subtitle="Por cobrar" icon={<Clock3 className="h-5 w-5" />} />
            </div>

            <Panel
                title="Listado por fase"
                subtitle="Crea facturas o marca pagos (según permisos)."
                icon={<Receipt className="h-5 w-5" />}
                right={
                    <div className="flex flex-wrap gap-2">
                        <Pill tone="neutral">Fases: {fases.length}</Pill>
                        <Pill tone="brand">Facturas: {metrics.total}</Pill>
                    </div>
                }
            >
                {fases.length === 0 ? (
                    <EmptyState text="No hay fases." />
                ) : (
                    <div className={cx("overflow-hidden rounded-3xl border", `border-[${UI.line}]`)}>
                        <div className="overflow-x-auto">
                            <table className="min-w-[980px] w-full border-collapse">
                                <thead className={cx(`bg-[${UI.brandSoft}]`)}>
                                    <tr>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>Fase</th>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>Número</th>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>Importe</th>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>Emitida</th>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>Vence</th>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>Estado</th>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>PDF</th>
                                        <th className={cx("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", `text-[${UI.muted}]`)}>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white">
                                    {fases.map((fase) => {
                                        const factura = (fase as any).factura as Factura | null;

                                        return (
                                            <tr key={fase.id} className={cx("border-t transition", `border-[${UI.line}] hover:bg-[${UI.wash}]`)}>
                                                <td className="px-4 py-3">
                                                    <div className={cx("font-semibold", `text-[${UI.ink}]`)}>{fase.nombre}</div>
                                                    <div className={cx("text-xs", `text-[${UI.muted}]`)}>
                                                        {typeof (fase as any).estado === "string" ? (fase as any).estado : "—"}
                                                    </div>
                                                </td>

                                                {factura ? (
                                                    <>
                                                        <td className={cx("px-4 py-3 font-semibold", `text-[${UI.ink}]`)}>{factura.numero ?? "—"}</td>

                                                        <td className={cx("px-4 py-3", `text-[${UI.ink}]`)}>
                                                            {formatMoney(toNumber(factura.importe as any), factura.moneda)}
                                                        </td>

                                                        <td className={cx("px-4 py-3", `text-[${UI.ink}]`)}>{formatDate(factura.emitidaEn)}</td>

                                                        <td className={cx("px-4 py-3", `text-[${UI.ink}]`)}>{formatDate(factura.venceEn)}</td>

                                                        <td className="px-4 py-3">
                                                            <Pill tone={factura.pagadaEn ? "good" : "warning"}>
                                                                {factura.pagadaEn ? <BadgeCheck className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                                                                {factura.pagadaEn ? "PAGADA" : "PENDIENTE"}
                                                            </Pill>
                                                            {factura.pagadaEn ? (
                                                                <div className={cx("mt-1 text-xs", `text-[${UI.muted}]`)}>{formatDate(factura.pagadaEn)}</div>
                                                            ) : null}
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            {factura.pdfUrl ? (
                                                                <a
                                                                    href={factura.pdfUrl}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className={cx(
                                                                        "inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-semibold shadow-sm transition",
                                                                        `border-[${UI.line2}] text-[${UI.ink2}] hover:bg-[${UI.brandSoft}]`,
                                                                        `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${UI.brand}]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white`
                                                                    )}
                                                                    title="Abrir PDF"
                                                                >
                                                                    <FileDown className="h-4 w-4" />
                                                                    Ver PDF
                                                                </a>
                                                            ) : (
                                                                <span className={cx("text-sm", `text-[${UI.muted}]`)}>—</span>
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            {isSuper ? (
                                                                <SecondaryButton
                                                                    onClick={() => togglePagada(factura)}
                                                                    disabled={saving}
                                                                    title={factura.pagadaEn ? "Marcar como no pagada" : "Marcar como pagada"}
                                                                >
                                                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : factura.pagadaEn ? <Clock3 className="h-4 w-4" /> : <BadgeCheck className="h-4 w-4" />}
                                                                    {factura.pagadaEn ? "No pagada" : "Pagada"}
                                                                </SecondaryButton>
                                                            ) : (
                                                                <span className={cx("text-sm", `text-[${UI.muted}]`)}>—</span>
                                                            )}
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className={cx("px-4 py-3", `text-[${UI.muted}]`)} colSpan={5}>
                                                            Sin factura
                                                        </td>

                                                        <td className={cx("px-4 py-3", `text-[${UI.muted}]`)}>—</td>

                                                        <td className="px-4 py-3">
                                                            {isSuper ? (
                                                                <PrimaryButton onClick={() => setCreatingFor(fase)} disabled={saving}>
                                                                    <Plus className="h-4 w-4" />
                                                                    Crear factura
                                                                </PrimaryButton>
                                                            ) : (
                                                                <span className={cx("text-sm", `text-[${UI.muted}]`)}>—</span>
                                                            )}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Panel>

            {/* Crear factura (MODAL) */}
            <CrearFacturaModal
                open={!!creatingFor}
                fase={creatingFor}
                saving={saving}
                onCancel={() => setCreatingFor(null)}
                onSubmit={(fase, form) => submitCreate(fase, form)}
            />
        </section>
    );
}

/** ---------- Modal de creación ---------- */
function CrearFacturaModal({
    open,
    fase,
    saving,
    onCancel,
    onSubmit,
}: {
    open: boolean;
    fase: Fase | null;
    saving: boolean;
    onCancel: () => void;
    onSubmit: (fase: Fase, form: CreateFacturaInput) => void;
}) {
    const [form, setForm] = useState<CreateFacturaInput>({
        importe: "",
        moneda: "EUR",
        numero: "",
        venceEn: "",
        pdfUrl: "",
    });

    // Cuando cambias de fase o abres el modal, resetea (pero conserva moneda por comodidad)
    useEffect(() => {
        if (!open || !fase) return;
        setForm((prev) => ({
            importe: "",
            moneda: prev.moneda ?? "EUR",
            numero: "",
            venceEn: "",
            pdfUrl: "",
        }));
    }, [open, fase?.id]);

    const preview = useMemo(() => {
        const amount = toNumber(form.importe as any);
        const moneda = (form.moneda || "EUR") as string;
        return amount > 0 ? formatMoney(amount, moneda) : "—";
    }, [form.importe, form.moneda]);

    return (
        <ModalShell
            open={open}
            onClose={() => {
                if (saving) return;
                onCancel();
            }}
            title={fase ? `Crear factura · ${fase.nombre}` : "Crear factura"}
            description="Rellena los datos básicos para generar la factura."
            footer={
                <>
                    <SecondaryButton onClick={onCancel} disabled={saving}>
                        <X className="h-4 w-4" />
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={() => {
                            if (!fase) return;
                            onSubmit(fase, form);
                        }}
                        disabled={saving || !fase}
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? "Creando…" : "Crear factura"}
                    </PrimaryButton>
                </>
            }
        >
            {!fase ? null : (
                <div className="grid gap-4">
                    <div className={cx("rounded-3xl border p-4", `border-[${UI.line}] bg-[${UI.brandSoft}]/35`)}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className={cx("inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-white shadow-sm", `border-[${UI.line2}] text-[${UI.ink2}]`)}>
                                    <Receipt className="h-5 w-5" />
                                </span>
                                <div>
                                    <div className={cx("text-sm font-semibold", `text-[${UI.ink}]`)}>Vista previa</div>
                                    <div className={cx("mt-1 text-xs", `text-[${UI.muted}]`)}>
                                        Importe: <span className={cx("font-semibold", `text-[${UI.ink}]`)}>{preview}</span>
                                    </div>
                                </div>
                            </div>
                            <Pill tone="brand">Fase ID: {fase.id}</Pill>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="grid gap-2">
                            <div className={cx("text-xs font-semibold", `text-[${UI.ink2}]`)}>Importe</div>
                            <Input
                                placeholder="Ej: 450.00"
                                value={form.importe as any}
                                onChange={(e) => setForm({ ...form, importe: e.target.value as any })}
                                inputMode="decimal"
                                disabled={saving}
                            />
                            <div className={cx("text-[11px]", `text-[${UI.muted}]`)}>Debe ser mayor que 0.</div>
                        </label>

                        <label className="grid gap-2">
                            <div className={cx("text-xs font-semibold", `text-[${UI.ink2}]`)}>Moneda</div>
                            <Input
                                placeholder="EUR"
                                value={(form.moneda ?? "EUR") as any}
                                onChange={(e) => setForm({ ...form, moneda: e.target.value as any })}
                                disabled={saving}
                            />
                        </label>

                        <label className="grid gap-2">
                            <div className={cx("text-xs font-semibold", `text-[${UI.ink2}]`)}>Número</div>
                            <Input
                                placeholder="Ej: 2026-001"
                                value={(form.numero ?? "") as any}
                                onChange={(e) => setForm({ ...form, numero: e.target.value as any })}
                                disabled={saving}
                            />
                        </label>

                        <label className="grid gap-2">
                            <div className={cx("text-xs font-semibold", `text-[${UI.ink2}]`)}>Vence</div>
                            <Input
                                type="date"
                                value={(form.venceEn ?? "") as any}
                                onChange={(e) => setForm({ ...form, venceEn: e.target.value as any })}
                                disabled={saving}
                            />
                        </label>
                    </div>

                    <label className="grid gap-2">
                        <div className={cx("text-xs font-semibold", `text-[${UI.ink2}]`)}>PDF URL</div>
                        <Input
                            placeholder="https://..."
                            value={(form.pdfUrl ?? "") as any}
                            onChange={(e) => setForm({ ...form, pdfUrl: e.target.value as any })}
                            disabled={saving}
                        />
                        <div className={cx("text-[11px]", `text-[${UI.muted}]`)}>
                            Puedes añadir el enlace al PDF (si lo generas en otro flujo).
                        </div>
                    </label>
                </div>
            )}
        </ModalShell>
    );
}
