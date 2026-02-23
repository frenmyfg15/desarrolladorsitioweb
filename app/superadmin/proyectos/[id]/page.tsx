"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Proyecto, proyectoApi } from "@/app/api/proyectos/proyecto.api";
import { RequisitosSection } from "@/app/components/superadmin/proyecto/RequisitosSection";
import { PresupuestoSection } from "@/app/components/superadmin/proyecto/PresupuestoSection";
import { FasesSection } from "@/app/components/superadmin/proyecto/FasesSection";
import {
    Activity,
    ArrowLeft,
    BadgeCheck,
    Building2,
    Clock3,
    FileText,
    Receipt,
    RefreshCcw,
    Trash2,
    Wallet,
    Loader2,
} from "lucide-react";
import { FacturasSection } from "@/app/components/superadmin/proyecto/FacturasSection";

type ProyectoDetalle = Proyecto & {
    requisitos?: any | null;
    presupuesto?: any | null;
    fases?: any[];
};

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(" ");
}

const T = {
    primary: "#6FCFBA",
    dark: "#1F3D3A",
    mint: "#E9F7F3",
    white: "#FFFFFF",
    gray50: "#F2F4F5",
    gray500: "#8A8F93",
    gray900: "#2B2E31",
    border: "#DDEBE6",
    border2: "#CDEFE6",
    dangerBorder: "#F3C6CE",
    dangerBg: "#FFECEF",
    dangerText: "#7B1E2B",
    warnBorder: "#EBD9B6",
    warnBg: "#FFF6DF",
    warnText: "#6A4A12",
};

function formatDate(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
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

function Badge({
    children,
    tone = "neutral",
}: {
    children: React.ReactNode;
    tone?: "neutral" | "brand" | "success" | "warning" | "danger";
}) {
    const tones: Record<string, string> = {
        neutral: "border-[#DDEBE6] bg-white text-[#2B2E31] ring-1 ring-inset ring-[#DDEBE6]",
        brand: "border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] ring-1 ring-inset ring-[#CDEFE6]",
        success: "border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] ring-1 ring-inset ring-[#CDEFE6]",
        warning: "border-[#EBD9B6] bg-[#FFF6DF] text-[#6A4A12] ring-1 ring-inset ring-[#EBD9B6]",
        danger: "border-[#F3C6CE] bg-[#FFECEF] text-[#7B1E2B] ring-1 ring-inset ring-[#F3C6CE]",
    };

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
                tones[tone]
            )}
        >
            {children}
        </span>
    );
}

function IconBadge({ icon }: { icon: React.ReactNode }) {
    return (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
            {icon}
        </span>
    );
}

function Button({
    children,
    variant = "secondary",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
}) {
    const variants: Record<string, string> = {
        primary: cx(
            "bg-[#6FCFBA] text-[#1F3D3A]",
            "shadow-[0_10px_22px_rgba(111,207,186,0.28)]",
            "hover:brightness-[0.98] hover:shadow-[0_12px_26px_rgba(111,207,186,0.34)]",
            "focus-visible:ring-[#6FCFBA]/70"
        ),
        secondary: cx(
            "bg-white text-[#1F3D3A] border border-[#CDEFE6]",
            "shadow-sm",
            "hover:bg-[#E9F7F3] hover:border-[#BEE7DC]",
            "focus-visible:ring-[#6FCFBA]/70"
        ),
        danger: cx(
            "bg-[#FFECEF] text-[#7B1E2B] border border-[#F3C6CE]",
            "shadow-sm",
            "hover:bg-[#FFE2E7]",
            "focus-visible:ring-[#F3C6CE]/70"
        ),
    };

    return (
        <button
            {...props}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
                "transition",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "active:translate-y-[1px]",
                variants[variant],
                props.disabled ? "opacity-60 cursor-not-allowed" : "",
                props.className ?? ""
            )}
        >
            {children}
        </button>
    );
}

function Panel({
    title,
    subtitle,
    icon,
    children,
    right,
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
                        {icon ? <IconBadge icon={icon} /> : null}
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

function EmptyState({
    title,
    subtitle,
    icon,
    action,
}: {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    action?: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-dashed border-[#CDEFE6] bg-[#E9F7F3]/45 p-10 text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-white text-[#1F3D3A] shadow-sm">
                {icon}
            </div>
            <div className="text-sm font-semibold text-[#2B2E31]">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-[#8A8F93]">{subtitle}</div> : null}
            {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
        </div>
    );
}

function MetricCard({
    label,
    value,
    helper,
    icon,
}: {
    label: string;
    value: React.ReactNode;
    helper?: React.ReactNode;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">{label}</div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight text-[#2B2E31]">{value}</div>
                    {helper ? <div className="mt-1 text-xs text-[#8A8F93]">{helper}</div> : null}
                </div>
                <IconBadge icon={icon} />
            </div>
        </div>
    );
}

export default function ProyectoDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const [proyecto, setProyecto] = useState<ProyectoDetalle | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await proyectoApi.getById(String(id));
            setProyecto((res as any).proyecto ?? null);
        } catch (e: any) {
            setError(e?.message ?? "Error cargando proyecto");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fases = proyecto?.fases ?? [];

    const facturas = useMemo(() => {
        const list = fases
            .map((f) => f?.factura)
            .filter(Boolean)
            .map((fac) => fac as any);

        return list.sort((a, b) => new Date(b.emitidaEn).getTime() - new Date(a.emitidaEn).getTime());
    }, [fases]);

    const facturasMetrics = useMemo(() => {
        if (facturas.length === 0) return { count: 0, pagadas: 0, pendientes: 0 };
        const pagadas = facturas.filter((f) => Boolean(f.pagadaEn)).length;
        return { count: facturas.length, pagadas, pendientes: facturas.length - pagadas };
    }, [facturas]);

    const presupuestoMetrics = useMemo(() => {
        const p = proyecto?.presupuesto;
        if (!p) return null;

        const moneda = p.moneda ?? "EUR";
        const total = toNumber(p.total);
        const pagado = toNumber(p.pagado);
        const pendiente = Math.max(0, total - pagado);

        return { moneda, total, pagado, pendiente };
    }, [proyecto?.presupuesto]);

    const fasesMetrics = useMemo(() => {
        const total = fases.length;
        const enProceso = fases.filter((f) => f?.estado === "EN_PROCESO").length;
        const listoPendPago = fases.filter((f) => f?.estado === "LISTO_PENDIENTE_PAGO").length;
        const listoPagado = fases.filter((f) => f?.estado === "LISTO_PAGADO").length;

        return { total, enProceso, listoPendPago, listoPagado };
    }, [fases]);

    const onDeleteProyecto = async () => {
        const ok = window.confirm("¿Eliminar este proyecto? (Solo si no tiene facturas.)");
        if (!ok) return;

        try {
            setBusy(true);
            await proyectoApi.delete(String(id));
            router.push("/superadmin/proyectos");
        } catch (e: any) {
            setError(e?.message ?? "Error eliminando proyecto");
        } finally {
            setBusy(false);
        }
    };

    const onApproveProyecto = async () => {
        try {
            setBusy(true);
            await proyectoApi.approve(String(id));
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Error aprobando proyecto");
        } finally {
            setBusy(false);
        }
    };

    if (loading) {
        return (
            <section className="rounded-3xl border border-[#DDEBE6] bg-white p-10 text-center shadow-sm">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
                <p className="mt-4 text-sm text-[#8A8F93]">Cargando detalle…</p>
            </section>
        );
    }

    if (error) {
        return (
            <div className="grid gap-4">
                <div className="rounded-3xl border border-[#F3C6CE] bg-[#FFECEF] p-4 text-sm text-[#7B1E2B] shadow-sm">
                    <div className="flex items-start gap-3">
                        <Activity className="h-5 w-5" />
                        <div>
                            <div className="font-bold">Error</div>
                            <div className="mt-1">{error}</div>
                        </div>
                    </div>
                </div>

                <Button onClick={() => router.push("/superadmin/proyectos")} variant="secondary">
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Button>
            </div>
        );
    }

    if (!proyecto) {
        return (
            <div className="grid gap-4">
                <Panel
                    title="Proyecto no encontrado"
                    subtitle="No existe o no tienes acceso."
                    icon={<FileText className="h-4 w-4" />}
                >
                    <EmptyState
                        title="No hay datos"
                        subtitle="Vuelve al listado y selecciona otro proyecto."
                        icon={<FileText className="h-6 w-6" />}
                        action={
                            <Button onClick={() => router.push("/superadmin/proyectos")} variant="secondary">
                                <ArrowLeft className="h-4 w-4" />
                                Volver
                            </Button>
                        }
                    />
                </Panel>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div
                className={cx(
                    "rounded-3xl border bg-white shadow-sm",
                    "border-[#DDEBE6]",
                    "p-5 md:p-6",
                    "bg-[radial-gradient(1000px_420px_at_15%_-10%,rgba(111,207,186,0.26),transparent_55%),radial-gradient(900px_380px_at_90%_0%,rgba(233,247,243,0.95),transparent_60%)]"
                )}
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button onClick={() => router.push("/superadmin/proyectos")} variant="secondary">
                                <ArrowLeft className="h-4 w-4" />
                                Volver
                            </Button>

                            <Badge tone="brand">
                                <FileText className="h-3.5 w-3.5" />
                                {proyecto.tipo}
                            </Badge>

                            <Badge tone={proyecto.aprobado ? "success" : "warning"}>
                                {proyecto.aprobado ? <BadgeCheck className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                                {proyecto.aprobado ? "APROBADO" : "PENDIENTE"}
                            </Badge>

                            <Badge tone="neutral">
                                <Building2 className="h-3.5 w-3.5" />
                                Empresa: <span className="font-semibold text-[#2B2E31]">{proyecto.empresaId}</span>
                            </Badge>
                        </div>

                        <div className="min-w-0">
                            <h1 className="m-0 text-2xl font-semibold tracking-tight text-[#2B2E31]">{proyecto.nombre}</h1>
                            <div className="mt-2 text-sm text-[#8A8F93]">
                                ID: <span className="font-mono text-[12px] text-[#2B2E31]">{proyecto.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                        <Button
                            onClick={onApproveProyecto}
                            disabled={busy || proyecto.aprobado}
                            variant="primary"
                            title={proyecto.aprobado ? "Ya está aprobado" : "Aprobar proyecto"}
                        >
                            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                            Aprobar
                        </Button>

                        <Button onClick={() => load()} disabled={busy} variant="secondary">
                            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                            Refrescar
                        </Button>

                        <Button onClick={onDeleteProyecto} disabled={busy} variant="danger">
                            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            Eliminar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Top stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    label="Fases"
                    value={fasesMetrics.total}
                    helper={
                        <>
                            {fasesMetrics.enProceso} en proceso · {fasesMetrics.listoPendPago} pendientes · {fasesMetrics.listoPagado} pagadas
                        </>
                    }
                    icon={<Activity className="h-5 w-5" />}
                />

                <MetricCard
                    label="Facturas"
                    value={facturasMetrics.count}
                    helper={
                        <>
                            {facturasMetrics.pagadas} pagadas · {facturasMetrics.pendientes} pendientes
                        </>
                    }
                    icon={<Receipt className="h-5 w-5" />}
                />

                <MetricCard
                    label="Presupuesto"
                    value={
                        presupuestoMetrics ? formatMoney(presupuestoMetrics.total, presupuestoMetrics.moneda) : "—"
                    }
                    helper={
                        presupuestoMetrics
                            ? `Pagado: ${formatMoney(presupuestoMetrics.pagado, presupuestoMetrics.moneda)} · Pendiente: ${formatMoney(
                                presupuestoMetrics.pendiente,
                                presupuestoMetrics.moneda
                            )}`
                            : "Sin presupuesto"
                    }
                    icon={<Wallet className="h-5 w-5" />}
                />

                <MetricCard
                    label="Actualización"
                    value={formatDate(proyecto.actualizadoEn)}
                    helper="Último cambio registrado"
                    icon={<RefreshCcw className="h-5 w-5" />}
                />
            </div>

            {/* Información */}
            <Panel title="Información" subtitle="Datos generales del proyecto." icon={<FileText className="h-4 w-4" />}>
                <div className="grid gap-3 text-sm">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/35 p-5">
                            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Identificadores</div>
                            <div className="mt-3 grid gap-1.5">
                                <div>
                                    <span className="text-[#8A8F93]">ID:</span>{" "}
                                    <span className="font-semibold text-[#2B2E31]">{proyecto.id}</span>
                                </div>
                                <div>
                                    <span className="text-[#8A8F93]">Empresa:</span>{" "}
                                    <span className="font-semibold text-[#2B2E31]">{proyecto.empresaId}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/35 p-5">
                            <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Trazabilidad</div>
                            <div className="mt-3 grid gap-1.5">
                                <div>
                                    <span className="text-[#8A8F93]">Creado:</span>{" "}
                                    <span className="font-semibold text-[#2B2E31]">{formatDate(proyecto.creadoEn)}</span>
                                </div>
                                <div>
                                    <span className="text-[#8A8F93]">Actualizado:</span>{" "}
                                    <span className="font-semibold text-[#2B2E31]">{formatDate(proyecto.actualizadoEn)}</span>
                                </div>
                                <div>
                                    <span className="text-[#8A8F93]">Aprobado en:</span>{" "}
                                    <span className="font-semibold text-[#2B2E31]">{formatDate(proyecto.aprobadoEn)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5">
                        <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Descripción</div>
                        <div className="mt-3 whitespace-pre-wrap text-sm text-[#2B2E31]">
                            {proyecto.descripcion?.trim() ? proyecto.descripcion : "—"}
                        </div>
                    </div>
                </div>
            </Panel>

            {/* Secciones */}
            <div className="grid gap-6">
                <Panel title="Presupuesto" subtitle="Importes, pagos y aceptación." icon={<Wallet className="h-4 w-4" />}>
                    <PresupuestoSection
                        proyectoId={proyecto.id}
                        presupuesto={proyecto.presupuesto}
                        rolGlobal={"SUPER_ADMIN"}
                        onUpdated={load}
                    />
                </Panel>

                <Panel title="Requisitos" subtitle="Checklist previo al desarrollo." icon={<FileText className="h-4 w-4" />}>
                    <RequisitosSection
                        proyectoId={proyecto.id}
                        requisitos={proyecto.requisitos}
                        hasPresupuesto={!!proyecto.presupuesto}
                        onUpdated={load}
                    />
                </Panel>

                <Panel title="Fases" subtitle="Ejecución y entregas." icon={<Activity className="h-4 w-4" />}>
                    <FasesSection
                        proyectoId={proyecto.id}
                        fases={proyecto.fases ?? []}
                        rolGlobal={"SUPER_ADMIN"}
                        onUpdated={load}
                    />
                </Panel>

                <Panel
                    title="Facturas"
                    subtitle="Resumen de facturación asociada a fases."
                    icon={<Receipt className="h-4 w-4" />}
                    right={
                        <div className="flex flex-wrap gap-2">
                            <Badge tone="neutral">
                                Total: <span className="font-semibold text-[#2B2E31]">{facturasMetrics.count}</span>
                            </Badge>
                            <Badge tone="success">
                                Pagadas: <span className="font-semibold text-[#2B2E31]">{facturasMetrics.pagadas}</span>
                            </Badge>
                            <Badge tone="warning">
                                Pendientes: <span className="font-semibold text-[#2B2E31]">{facturasMetrics.pendientes}</span>
                            </Badge>
                        </div>
                    }
                >
                    <FacturasSection fases={proyecto.fases ?? []} rolGlobal={"SUPER_ADMIN"} onUpdated={load} />
                </Panel>
            </div>

            {/* Footer */}
            <div className="rounded-3xl border border-[#CDEFE6] bg-[#1F3D3A] p-6 text-white shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-[#6FCFBA]">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-semibold uppercase tracking-widest text-white/60">Proyecto</div>
                            <div className="truncate text-lg font-semibold">{proyecto.nombre}</div>
                            <div className="mt-1 text-xs text-white/60">
                                {proyecto.aprobado ? `Aprobado: ${formatDate(proyecto.aprobadoEn)}` : "Pendiente de aprobación"}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold">
                            {proyecto.tipo}
                        </div>
                        <div
                            className={cx(
                                "rounded-full px-4 py-1.5 text-xs font-bold",
                                proyecto.aprobado ? "bg-[#6FCFBA]/20 text-[#6FCFBA]" : "bg-[#FFF6DF]/20 text-[#FFF6DF]"
                            )}
                        >
                            {proyecto.aprobado ? "ACTIVO" : "PENDIENTE"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
