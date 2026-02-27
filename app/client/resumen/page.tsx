"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/app/store/auth.store";
import { getClientDashboard } from "@/app/api/dashboard.client.api";
import {
    Loader2,
    MessageCircle,
    ChevronRight,
    Calendar,
    CreditCard,
    AlertTriangle,
    ArrowRight,
    FileText,
    Receipt,
    Sparkles,
} from "lucide-react";

const WHATSAPP_NUMBER = "34604894472";

function euros(cents: number, currency = "EUR") {
    return (cents / 100).toLocaleString("es-ES", { style: "currency", currency });
}

function fmtDate(iso: string | null) {
    if (!iso) return "-";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("es-ES");
}

function fmtDateTime(iso: string | null) {
    if (!iso) return "-";
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
        ? "-"
        : d.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
}

/**
 * DTO esperado (nuevo):
 * {
 *   ok: true,
 *   dashboard: {
 *     now, horizon,
 *     projects: { total, byStatus: {...} },
 *     invoices: {
 *       draft: { count, totalCents },
 *       payable: { count, totalCents, noDueDateCount },
 *       overdue: { count, totalCents, top: InvoiceTop[] },
 *       dueSoon: { count, totalCents, top: InvoiceTop[] },
 *       open: { count, totalCents, noDueDateCount }
 *     },
 *     budgets: { byStatus: {...}, pendingDecisionCount }
 *   }
 * }
 */
type DashboardResponse = {
    ok: true;
    dashboard: {
        now: string;
        horizon: { dueSoonDays: number; dueSoonUntil: string };
        projects: { total: number; byStatus: Record<string, number> };
        invoices: {
            draft: { count: number; totalCents: number };
            payable: { count: number; totalCents: number; noDueDateCount: number };
            overdue: { count: number; totalCents: number; top: InvoiceTop[] };
            dueSoon: { count: number; totalCents: number; top: InvoiceTop[] };
            open: { count: number; totalCents: number; noDueDateCount: number };
        };
        budgets: { byStatus: Record<string, number>; pendingDecisionCount: number };
    };
};

type InvoiceTop = {
    id: string;
    status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELED";
    number: string | null;
    currency: string;
    amountCents: number;
    issuedAt: string | null;
    dueAt: string | null;
    project: { id: string; name: string; status: string };
    flags?: { payable?: boolean; isLate?: boolean; missingDueDate?: boolean };
};

function waPayLink(inv: InvoiceTop) {
    const msg = encodeURIComponent(
        `¡Hola! Quiero gestionar el pago de mi factura.\n\n` +
        `📁 Proyecto: ${inv.project.name}\n` +
        `📄 Factura ID: ${inv.id}\n` +
        `🔢 Número: ${inv.number || "-"}\n` +
        `💰 Importe: ${euros(inv.amountCents, inv.currency)}\n` +
        `📅 Vencimiento: ${fmtDate(inv.dueAt)}`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

export default function ClientResumenPage() {
    const user = useAuthStore((s) => s.user);

    const [dash, setDash] = useState<DashboardResponse["dashboard"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        let alive = true;
        setLoading(true);
        setError(null);

        getClientDashboard(user.id)
            .then((res: any) => {
                // Soporta ambas respuestas: {dashboard} o el objeto directamente
                const d = res?.dashboard ?? res;
                if (alive) setDash(d);
            })
            .catch((err: any) => {
                const msg = err?.response?.data?.message || err?.message || "Error al cargar el panel";
                if (alive) setError(msg);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });

        return () => {
            alive = false;
        };
    }, [user]);

    const computed = useMemo(() => {
        if (!dash) return null;

        const inv = dash.invoices;
        const hasPayable = inv.payable.count > 0;

        const primaryCurrency =
            inv.overdue.top[0]?.currency || inv.dueSoon.top[0]?.currency || "EUR";

        const totals = {
            payable: euros(inv.payable.totalCents, primaryCurrency),
            overdue: euros(inv.overdue.totalCents, primaryCurrency),
            dueSoon: euros(inv.dueSoon.totalCents, primaryCurrency),
            open: euros(inv.open.totalCents, primaryCurrency),
            draft: euros(inv.draft.totalCents, primaryCurrency),
        };

        const nextActions: Array<{ icon: React.ReactNode; title: string; desc: string; href?: string }> = [];

        if (inv.overdue.count > 0) {
            nextActions.push({
                icon: <AlertTriangle size={16} className="text-red-600" />,
                title: "Tienes facturas vencidas",
                desc: "Prioriza estas para evitar interrupciones o recargos.",
                href: "/client/facturas",
            });
        }
        if (inv.payable.noDueDateCount > 0) {
            nextActions.push({
                icon: <Calendar size={16} className="text-amber-600" />,
                title: "Facturas sin fecha de vencimiento",
                desc: "Revisar condiciones y fijar vencimiento si aplica.",
                href: "/client/facturas",
            });
        }
        if (dash.budgets.pendingDecisionCount > 0) {
            nextActions.push({
                icon: <FileText size={16} className="text-[#36DBBA]" />,
                title: "Presupuestos pendientes",
                desc: "Hay propuestas esperando tu aprobación o feedback.",
                href: "/client/presupuestos",
            });
        }
        if (nextActions.length === 0) {
            nextActions.push({
                icon: <Sparkles size={16} className="text-[#36DBBA]" />,
                title: "Todo al día",
                desc: "No hay acciones urgentes por ahora.",
            });
        }

        return { hasPayable, totals, nextActions, primaryCurrency };
    }, [dash]);

    if (!user) {
        return <div className="p-8 text-[#6B7280] font-medium">No autenticado</div>;
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto py-24 px-6">
                <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-[#36DBBA]" size={32} />
                    <span className="text-sm font-medium text-[#9CA3AF]">Cargando tu dashboard...</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-24 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !dash || !computed) {
        return (
            <div className="p-6 m-6 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3">
                <AlertTriangle size={20} />
                <span className="font-medium">{error || "Sin datos"}</span>
            </div>
        );
    }

    const { projects, invoices, budgets } = dash;
    const { hasPayable, totals, nextActions } = computed;

    const active = projects.byStatus["ACTIVE"] ?? 0;
    const onHold = projects.byStatus["ON_HOLD"] ?? 0;
    const completed = projects.byStatus["COMPLETED"] ?? 0;

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 px-6">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F3F4F6] pb-8">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Dashboard</h2>
                    <p className="text-[#6B7280] font-medium">
                        Proyectos, facturas y presupuestos en un vistazo.
                    </p>
                </div>
                <div className="px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    {fmtDateTime(dash.now)}
                </div>
            </header>

            {/* Estado de pagos (hero card) */}
            <section
                className={[
                    "p-6 rounded-2xl border shadow-sm transition-all",
                    hasPayable ? "bg-amber-50/50 border-amber-100" : "bg-white border-[#E5E7EB]",
                ].join(" ")}
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div
                                className={[
                                    "p-2 rounded-lg",
                                    hasPayable ? "bg-amber-100 text-amber-700" : "bg-[#36DBBA15] text-[#36DBBA]",
                                ].join(" ")}
                            >
                                <CreditCard size={20} />
                            </div>
                            <span className="text-sm font-bold text-[#111827] uppercase tracking-tight">
                                Estado de pagos
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="text-xl font-bold text-[#111827]">
                                Pendiente de pago:{" "}
                                <span className={hasPayable ? "text-amber-700" : ""}>{totals.payable}</span>
                            </div>

                            <div className="text-sm font-medium text-[#6B7280] flex flex-wrap gap-x-4 gap-y-1">
                                <span>
                                    Próximos ({dash.horizon.dueSoonDays} días): <b>{totals.dueSoon}</b>
                                </span>
                                {invoices.overdue.count > 0 && (
                                    <span className="text-red-600 font-bold flex items-center gap-1">
                                        <AlertTriangle size={14} /> Vencido: {totals.overdue}
                                    </span>
                                )}
                                {invoices.payable.noDueDateCount > 0 && (
                                    <span className="text-amber-700 font-bold flex items-center gap-1">
                                        <Calendar size={14} /> Sin vencimiento: {invoices.payable.noDueDateCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Link
                            href="/client/facturas"
                            className="text-center px-4 py-2.5 text-xs font-bold text-[#111827] bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors shadow-sm"
                        >
                            Ver facturas <ChevronRight size={14} className="inline ml-1 -mt-0.5" />
                        </Link>

                        {hasPayable && (
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-center px-4 py-2.5 text-xs font-bold text-white bg-[#25D366] rounded-xl hover:bg-[#128C7E] transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={16} /> WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* KPIs */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Kpi label="Proyectos activos" value={active} icon={<ArrowRight size={14} />} color="text-[#36DBBA]" />
                <Kpi label="En espera" value={onHold} color="text-amber-500" />
                <Kpi label="Completados" value={completed} color="text-[#111827]" />
                <Kpi label="Presupuestos" value={budgets.pendingDecisionCount} color="text-[#36DBBA]" />
            </section>

            {/* Next actions */}
            <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Receipt size={18} className="text-[#36DBBA]" />
                        <h3 className="text-sm font-extrabold text-[#111827] uppercase tracking-tight">
                            Acciones recomendadas
                        </h3>
                    </div>
                    <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                        Salud: {invoices.overdue.count > 0 ? "Atención" : hasPayable ? "Pendiente" : "OK"}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    {nextActions.slice(0, 3).map((a, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-[#E5E7EB] p-4 hover:bg-[#F9FAFB] transition-colors"
                        >
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5">{a.icon}</div>
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-[#111827]">{a.title}</div>
                                    <div className="text-xs font-medium text-[#6B7280]">{a.desc}</div>
                                    {a.href && (
                                        <Link
                                            href={a.href}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-[#111827] mt-2"
                                        >
                                            Ir ahora <ChevronRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Lists */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <ListBlock
                    title="Pendientes de pago"
                    accent="amber"
                    emptyText="No tienes facturas pendientes ahora mismo."
                    items={mergeUnique(invoices.overdue.top, invoices.dueSoon.top)}
                />

                <ListBlock
                    title="Vencidas"
                    accent="red"
                    emptyText="No tienes facturas vencidas."
                    items={invoices.overdue.top}
                />
            </section>

            <div className="h-10" />
        </div>
    );
}

function mergeUnique(a: InvoiceTop[], b: InvoiceTop[]) {
    const m = new Map<string, InvoiceTop>();
    [...a, ...b].forEach((x) => m.set(x.id, x));
    return Array.from(m.values());
}

function Kpi({
    label,
    value,
    icon,
    color = "text-[#111827]",
}: {
    label: string;
    value: number;
    icon?: React.ReactNode;
    color?: string;
}) {
    return (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:border-[#36DBBA]/30 transition-colors group">
            <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">{label}</div>
            <div className={`text-3xl font-bold flex items-center gap-2 ${color}`}>
                {value}
                {icon && <span className="opacity-40 group-hover:translate-x-1 transition-transform">{icon}</span>}
            </div>
        </div>
    );
}

function Empty({ text }: { text: string }) {
    return (
        <div className="text-sm font-medium text-[#9CA3AF] border border-dashed border-[#E5E7EB] rounded-2xl p-8 text-center bg-[#F9FAFB]/50">
            {text}
        </div>
    );
}

function ListBlock({
    title,
    accent,
    emptyText,
    items,
}: {
    title: string;
    accent: "amber" | "red" | "teal";
    emptyText: string;
    items: InvoiceTop[];
}) {
    const accentClass =
        accent === "amber"
            ? "bg-amber-400"
            : accent === "red"
                ? "bg-red-500"
                : "bg-[#36DBBA]";

    return (
        <div className="space-y-5">
            <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <div className={`w-1.5 h-6 ${accentClass} rounded-full`} />
                {title}
            </h3>

            <div className="space-y-3">
                {items.length === 0 ? (
                    <Empty text={emptyText} />
                ) : (
                    items.slice(0, 5).map((inv) => <InvoiceItem key={inv.id} inv={inv} />)
                )}
            </div>
        </div>
    );
}

function InvoiceItem({ inv }: { inv: InvoiceTop }) {
    const isOverdue = inv.status === "OVERDUE" || (!!inv.dueAt && new Date(inv.dueAt) < new Date());
    const isPayable = inv.status === "SENT" || inv.status === "OVERDUE";

    const statusLabel =
        inv.status === "SENT"
            ? "Pendiente"
            : inv.status === "OVERDUE"
                ? "Vencida"
                : inv.status === "DRAFT"
                    ? "Borrador"
                    : inv.status;

    const badgeClass = isOverdue
        ? "bg-red-50 text-red-600 border-red-100"
        : isPayable
            ? "bg-amber-50 text-amber-700 border-amber-100"
            : "bg-[#36DBBA10] text-[#36DBBA] border-[#36DBBA20]";

    return (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="text-xl font-bold text-[#111827] tracking-tight">
                        {euros(inv.amountCents, inv.currency)}
                    </div>
                    <div className="text-sm font-semibold text-[#6B7280] line-clamp-1">{inv.project.name}</div>
                </div>

                <div className={`text-[10px] font-bold px-2 py-1 rounded-lg border uppercase tracking-tighter ${badgeClass}`}>
                    {statusLabel}
                </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold text-[#9CA3AF]">
                <Calendar size={14} />
                Vence:{" "}
                <span className={isOverdue ? "text-red-600" : "text-[#111827]"}>
                    {inv.dueAt ? fmtDate(inv.dueAt) : "Sin fecha"}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                    href={`/client/proyectos/${inv.project.id}`}
                    className="flex items-center justify-center gap-1.5 text-[11px] font-bold px-3 py-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                >
                    Detalles <ChevronRight size={14} />
                </Link>

                {isPayable && (
                    <a
                        href={waPayLink(inv)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 text-[11px] font-bold px-3 py-2.5 rounded-xl bg-[#25D366] text-white hover:bg-[#128C7E] transition-all shadow-sm"
                    >
                        <MessageCircle size={14} /> WhatsApp
                    </a>
                )}
            </div>
        </div>
    );
}