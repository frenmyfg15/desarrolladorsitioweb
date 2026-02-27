"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/app/store/auth.store";
import { getClientDashboard, type ClientDashboardDTO } from "@/app/api/dashboard.client.api";
import {
    TrendingUp,
    Clock,
    AlertTriangle,
    FileText,
    CreditCard,
    ChevronRight,
    Loader2,
    Calendar,
    CheckCircle2,
    Bell
} from "lucide-react";

function money(cents: number, currency = "EUR") {
    return (cents / 100).toLocaleString('es-ES', {
        style: 'currency',
        currency: currency
    });
}

export default function ClientDashboardPage() {
    const user = useAuthStore((s) => s.user);

    const [data, setData] = useState<ClientDashboardDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        setError(null);

        getClientDashboard(user.id)
            .then(setData)
            .catch((err: any) => {
                const msg = err?.response?.data?.message || err?.message || "No se pudo cargar el resumen";
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return <div className="p-8 text-[#6B7280]">No autenticado</div>;

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin text-[#36DBBA]" size={40} />
            <p className="text-[#9CA3AF] font-medium">Preparando tu resumen...</p>
        </div>
    );

    if (error) return (
        <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3">
            <AlertTriangle size={20} />
            <span>{error}</span>
        </div>
    );

    if (!data) return <div className="p-8 text-[#6B7280]">Sin datos disponibles</div>;

    const { projects, payments, budgets } = data;

    return (
        <div className="space-y-10 pb-12">
            <header>
                <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Resumen General</h2>
                <p className="text-[#6B7280] mt-1">Esto es lo que está pasando con tus proyectos hoy.</p>
            </header>

            {/* ALERTAS CRÍTICAS */}
            {(payments.overdueCount > 0 || payments.dueSoonCount > 0) && (
                <div className={`p-6 rounded-xl border flex flex-col gap-4 shadow-sm ${payments.overdueCount > 0
                    ? "bg-red-50 border-red-100"
                    : "bg-[#36DBBA05] border-[#36DBBA20]"
                    }`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${payments.overdueCount > 0 ? "bg-red-100 text-red-600" : "bg-[#36DBBA20] text-[#36DBBA]"}`}>
                            <Bell size={20} />
                        </div>
                        <div className="flex-1">
                            {payments.overdueCount > 0 && (
                                <div className="text-red-700 font-bold text-lg">
                                    Tienes {payments.overdueCount} factura(s) vencida(s)
                                    <span className="block text-sm font-medium opacity-80 mt-1">Monto total: {money(payments.overdueTotalCents)}</span>
                                </div>
                            )}
                            {payments.dueSoonCount > 0 && (
                                <div className={`text-[#111827] font-semibold ${payments.overdueCount > 0 ? "mt-4 pt-4 border-t border-red-200/50" : ""}`}>
                                    <span className="flex items-center gap-2">
                                        <Clock size={16} className="text-[#36DBBA]" />
                                        {payments.dueSoonCount} factura(s) por vencer pronto ({money(payments.dueSoonTotalCents)})
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* KPIs GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Kpi
                    label="Proyectos activos"
                    value={projects.active}
                    icon={<TrendingUp size={18} />}
                    color="#36DBBA"
                />
                <Kpi
                    label="Pendientes de pago"
                    value={payments.unpaidCount}
                    icon={<CreditCard size={18} />}
                    color="#6B7280"
                />
                <Kpi
                    label="Presupuestos"
                    value={budgets.pendingDecisionCount}
                    icon={<FileText size={18} />}
                    color="#36DBBA"
                />
                <Kpi
                    label="Por programar"
                    value={payments.noDueDateCount}
                    icon={<Calendar size={18} />}
                    color="#9CA3AF"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* COLUMNA IZQUIERDA: VENCIDAS */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                            <AlertTriangle size={20} className="text-red-500" />
                            Facturas vencidas
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {payments.overdueTop.length === 0 ? (
                            <div className="bg-white border border-[#E5E7EB] border-dashed rounded-xl p-8 text-center">
                                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 size={24} />
                                </div>
                                <p className="text-[#6B7280] font-medium">¡Estás al día!</p>
                                <p className="text-[#9CA3AF] text-xs mt-1">No hay facturas vencidas.</p>
                            </div>
                        ) : (
                            payments.overdueTop.map((inv) => <InvoiceRow key={inv.id} inv={inv} isOverdue />)
                        )}
                    </div>
                </section>

                {/* COLUMNA DERECHA: PRÓXIMAS */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                            <Clock size={20} className="text-[#36DBBA]" />
                            Próximos pagos
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {payments.dueSoonTop.length === 0 ? (
                            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-8 text-center">
                                <p className="text-[#9CA3AF] text-sm italic">No hay pagos próximos programados.</p>
                            </div>
                        ) : (
                            payments.dueSoonTop.map((inv) => <InvoiceRow key={inv.id} inv={inv} />)
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function Kpi({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
    return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm hover:border-[#36DBBA] transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-[#F3F4F6] text-[#6B7280] group-hover:bg-[#36DBBA15] group-hover:text-[#36DBBA] transition-colors">
                    {icon}
                </div>
            </div>
            <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest">{label}</div>
            <div className="text-3xl font-bold text-[#111827] mt-1">{value}</div>
        </div>
    );
}

function InvoiceRow({ inv, isOverdue }: { inv: any; isOverdue?: boolean }) {
    return (
        <Link
            href={`/client/proyectos/${inv.project.id}`}
            className="block bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#36DBBA] hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="text-lg font-bold text-[#111827]">
                        {money(inv.amountCents, inv.currency)}
                    </div>
                    <p className="text-sm text-[#6B7280] font-medium line-clamp-1">
                        Proyecto: <span className="text-[#111827]">{inv.project.name}</span>
                    </p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter border ${isOverdue ? "bg-red-50 text-red-500 border-red-100" : "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]"
                    }`}>
                    {inv.status}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#F3F4F6] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {inv.dueAt && (
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? "text-red-500" : "text-[#9CA3AF]"}`}>
                            <Calendar size={14} />
                            Vence: {new Date(inv.dueAt).toLocaleDateString()}
                        </div>
                    )}
                </div>
                <ChevronRight size={18} className="text-[#E5E7EB] group-hover:text-[#36DBBA] group-hover:translate-x-1 transition-all" />
            </div>
        </Link>
    );
}