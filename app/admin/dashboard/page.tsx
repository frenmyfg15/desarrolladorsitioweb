"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    FolderKanban,
    Layers,
    Package,
    Receipt,
    FileText,
    AlertTriangle,
    ArrowUpRight,
    RefreshCw,
} from "lucide-react";
import { getAdminDashboard, type DashboardDTO } from "@/app/api/dashboard.api";

function money(cents: number, currency: string) {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(cents / 100);
}
function fmt(date: string | null | undefined) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function Badge({ value }: { value: string }) {
    const styles: Record<string, string> = {
        ACTIVE: "bg-emerald-50 text-emerald-700",
        COMPLETED: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        ON_HOLD: "bg-amber-50 text-amber-700",
        CANCELED: "bg-red-50 text-red-600",
        DRAFT: "bg-gray-100 text-gray-600",

        TODO: "bg-gray-100 text-gray-600",
        IN_PROGRESS: "bg-blue-50 text-blue-700",
        BLOCKED: "bg-orange-50 text-orange-700",
        DONE: "bg-[#36DBBA]/10 text-[#2BC4A6]",

        SENT: "bg-blue-50 text-blue-700",
        PAID: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        OVERDUE: "bg-red-50 text-red-600",

        ACCEPTED: "bg-emerald-50 text-emerald-700",
        REJECTED: "bg-red-50 text-red-600",
        EXPIRED: "bg-amber-50 text-amber-700",
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[value] ?? "bg-gray-100 text-gray-600"}`}>
            {value}
        </span>
    );
}

function Card({ title, value, icon: Icon, hint }: { title: string; value: string; icon: any; hint?: string }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400">{title}</p>
                <p className="text-xl font-semibold text-gray-900 tracking-tight mt-1">{value}</p>
                {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#36DBBA]/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-[#2BC4A6]" />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();

    const [data, setData] = useState<DashboardDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        setErr(null);
        try {
            const d = await getAdminDashboard();
            setData(d);
        } catch (e: any) {
            setErr(e?.response?.data?.message || e?.message || "No se pudo cargar el dashboard");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const currency = data?.billing.currency ?? "EUR";

    const invoiceStatusBars = useMemo(() => {
        if (!data) return [];
        const total = data.charts.invoicesByStatus.reduce((a, b) => a + b.count, 0) || 1;
        return data.charts.invoicesByStatus
            .slice()
            .sort((a, b) => b.count - a.count)
            .map((x) => ({ ...x, pct: Math.round((x.count / total) * 100) }));
    }, [data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="w-6 h-6 rounded-full border-2 border-[#36DBBA] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col gap-3">
                <div className="text-sm text-red-600">{err ?? "Sin datos"}</div>
                <button
                    onClick={load}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm"
                >
                    <RefreshCw size={16} /> Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-sm text-gray-400">Resumen general de actividad, facturación y alertas.</p>
                </div>
                <button
                    onClick={load}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm hover:bg-gray-50"
                >
                    <RefreshCw size={16} /> Refrescar
                </button>
            </div>

            {err && (
                <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
                    {err}
                </div>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Card title="Usuarios" value={`${data.kpis.usersTotal}`} icon={Users} hint={`Activos: ${data.kpis.usersActive}`} />
                <Card title="Proyectos" value={`${data.kpis.projectsTotal}`} icon={FolderKanban} />
                <Card title="Fases" value={`${data.kpis.phasesTotal}`} icon={Layers} />
                <Card title="Entregas" value={`${data.kpis.deliveriesTotal}`} icon={Package} />
                <Card title="Presupuestos" value={`${data.kpis.budgetsTotal}`} icon={Receipt} />
                <Card title="Facturas" value={`${data.kpis.invoicesTotal}`} icon={FileText} />
                <Card title="Total facturado" value={money(data.billing.totalCents, currency)} icon={FileText} />
                <Card title="Cobrado" value={money(data.billing.paidCents, currency)} icon={Receipt} />
            </div>

            {/* Billing split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">Facturación</p>
                        <span className="text-xs text-gray-400">Moneda: {currency}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-gray-100 p-3">
                            <p className="text-xs text-gray-400">Pendiente</p>
                            <p className="text-base font-semibold text-gray-900 mt-1">{money(data.billing.unpaidCents, currency)}</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 p-3">
                            <p className="text-xs text-gray-400">Vencido</p>
                            <p className="text-base font-semibold text-gray-900 mt-1">{money(data.billing.overdueCents, currency)}</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 p-3">
                            <p className="text-xs text-gray-400">Cobrado</p>
                            <p className="text-base font-semibold text-gray-900 mt-1">{money(data.billing.paidCents, currency)}</p>
                        </div>
                    </div>

                    <div className="mt-1">
                        <p className="text-xs font-medium text-gray-400 mb-2">Facturas por estado</p>
                        <div className="flex flex-col gap-2">
                            {invoiceStatusBars.map((x) => (
                                <div key={x.status} className="flex items-center gap-3">
                                    <div className="w-20">
                                        <Badge value={x.status} />
                                    </div>
                                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div className="h-full bg-[#36DBBA]" style={{ width: `${x.pct}%` }} />
                                    </div>
                                    <div className="w-12 text-right text-xs text-gray-500">{x.count}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">Alertas</p>
                        <AlertTriangle size={16} className="text-amber-500" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={() => router.push("/admin/facturas")}
                            className="rounded-xl border border-gray-100 p-3 text-left hover:bg-gray-50"
                        >
                            <p className="text-xs text-gray-400">Facturas vencidas</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">{data.lists.overdueInvoices.length}</p>
                            <p className="text-xs text-gray-400 mt-1">Ver lista</p>
                        </button>

                        <button
                            onClick={() => router.push("/admin/proyectos")}
                            className="rounded-xl border border-gray-100 p-3 text-left hover:bg-gray-50"
                        >
                            <p className="text-xs text-gray-400">Próximas entregas</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">{data.lists.upcomingPhases.length}</p>
                            <p className="text-xs text-gray-400 mt-1">Ver proyectos</p>
                        </button>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-3">
                        <p className="text-xs font-medium text-gray-400">Top clientes</p>
                        <div className="flex flex-col gap-2 mt-2">
                            {data.lists.topClients.length === 0 ? (
                                <p className="text-sm text-gray-400">Sin datos todavía</p>
                            ) : (
                                data.lists.topClients.map((c) => (
                                    <button
                                        key={c.client.id}
                                        onClick={() => router.push(`/admin/usuarios/${c.client.id}`)}
                                        className="flex items-center justify-between gap-3 text-left hover:bg-gray-50 rounded-lg px-2 py-2"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {c.client.name || c.client.email}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">{c.client.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">{money(c.totalCents, currency)}</p>
                                            <p className="text-xs text-gray-400">{c.count} facturas</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Recent projects */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">Proyectos recientes</p>
                        <button
                            onClick={() => router.push("/admin/proyectos")}
                            className="text-xs font-semibold text-[#2BC4A6] hover:underline inline-flex items-center gap-1"
                        >
                            Ver todos <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="mt-3 flex flex-col gap-2">
                        {data.lists.recentProjects.length === 0 ? (
                            <p className="text-sm text-gray-400">Sin proyectos todavía</p>
                        ) : (
                            data.lists.recentProjects.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => router.push(`/admin/proyectos/${p.id}`)}
                                    className="rounded-xl border border-gray-100 px-3 py-3 text-left hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                                        <Badge value={p.status} />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Cliente: {p.client.name ? `${p.client.name} (${p.client.email})` : p.client.email}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Entrega: <span className="text-gray-600 font-medium">{fmt(p.dueDate)}</span>
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent invoices */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">Últimas facturas</p>
                        <button
                            onClick={() => router.push("/admin/facturas")}
                            className="text-xs font-semibold text-[#2BC4A6] hover:underline inline-flex items-center gap-1"
                        >
                            Ver todas <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="mt-3 flex flex-col gap-2">
                        {data.lists.recentInvoices.length === 0 ? (
                            <p className="text-sm text-gray-400">Sin facturas todavía</p>
                        ) : (
                            data.lists.recentInvoices.map((inv) => (
                                <button
                                    key={inv.id}
                                    onClick={() => router.push(`/admin/proyectos/${inv.project.id}`)}
                                    className="rounded-xl border border-gray-100 px-3 py-3 text-left hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {inv.number || "Sin número"}
                                        </p>
                                        <Badge value={inv.status} />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {money(inv.amountCents, inv.currency)} • Proyecto:{" "}
                                        <span className="text-gray-600 font-medium">{inv.project.name}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Vence: <span className="text-gray-600 font-medium">{fmt(inv.dueAt)}</span>
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Upcoming phases */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">Próximas entregas (7 días)</p>
                    <button
                        onClick={() => router.push("/admin/fases")}
                        className="text-xs font-semibold text-[#2BC4A6] hover:underline inline-flex items-center gap-1"
                    >
                        Ver fases <ArrowUpRight size={14} />
                    </button>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {data.lists.upcomingPhases.length === 0 ? (
                        <p className="text-sm text-gray-400">Sin entregas próximas</p>
                    ) : (
                        data.lists.upcomingPhases.map((ph) => (
                            <button
                                key={ph.id}
                                onClick={() => router.push(`/admin/proyectos/${ph.project.id}`)}
                                className="rounded-xl border border-gray-100 px-3 py-3 text-left hover:bg-gray-50"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {ph.order}. {ph.title}
                                    </p>
                                    <Badge value={ph.status} />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Proyecto: <span className="text-gray-600 font-medium">{ph.project.name}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Vence: <span className="text-gray-600 font-medium">{fmt(ph.dueDate)}</span>
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}