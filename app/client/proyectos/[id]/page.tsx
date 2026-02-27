"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/auth.store";
import { getProjectDetailById } from "@/app/api/projects.client.api";
import type { ClientProjectDetailDTO } from "@/app/api/projects.client.api";
import { decideBudget } from "@/app/api/budgets.client.api";
import {
    FileText,
    Receipt,
    Layers,
    ExternalLink,
    Calendar,
    CheckCircle2,
    XCircle,
    Loader2,
    ChevronRight,
    Info
} from "lucide-react";

export default function ClientProjectDetailPage() {
    const user = useAuthStore((s) => s.user);
    const params = useParams<{ id: string }>();
    const projectId = params?.id;

    const [project, setProject] = useState<ClientProjectDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [decidingBudgetId, setDecidingBudgetId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        if (!projectId) {
            setError("ID de proyecto inválido");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        getProjectDetailById(user.id, projectId)
            .then(setProject)
            .catch((err: any) => {
                const msg = err?.response?.data?.message || err?.message || "No se pudo cargar el proyecto";
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [user, projectId]);

    async function onDecideBudget(budgetId: string, decision: "ACCEPT" | "REJECT") {
        if (!user || !project) return;
        setError(null);
        setDecidingBudgetId(budgetId);

        try {
            const updated = await decideBudget(user.id, budgetId, { decision });
            setProject((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    budgets: prev.budgets.map((b) =>
                        b.id === updated.id ? { ...b, status: updated.status } : b
                    ),
                };
            });
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Error al actualizar");
        } finally {
            setDecidingBudgetId(null);
        }
    }

    if (!user) return <div className="p-8 text-[#6B7280]">No autenticado</div>;

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin text-[#36DBBA]" size={40} />
            <p className="text-[#9CA3AF] font-medium">Cargando detalles del proyecto...</p>
        </div>
    );

    if (error) return (
        <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3">
            <XCircle size={20} />
            <span>{error}</span>
        </div>
    );

    if (!project) return <div className="p-8 text-[#6B7280]">Proyecto no encontrado</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header Section */}
            <header className="bg-white p-8 rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#36DBBA15] text-[#36DBBA] text-xs font-bold uppercase tracking-wider">
                                {project.status}
                            </span>
                            <span className="text-[#9CA3AF] text-sm">ID: #{project.id.toString().slice(-6)}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-[#111827]">{project.name}</h2>
                        {project.description && (
                            <p className="mt-3 text-[#6B7280] leading-relaxed max-w-2xl">{project.description}</p>
                        )}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Fases */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-[#111827]">
                            <Layers size={22} className="text-[#36DBBA]" />
                            <h3 className="text-xl font-bold text-[#111827]">Fases del Proyecto</h3>
                        </div>

                        <div className="space-y-4">
                            {project.phases.length === 0 && (
                                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-8 text-center text-[#9CA3AF]">
                                    No hay fases definidas todavía.
                                </div>
                            )}
                            {project.phases.map((ph) => (
                                <div key={ph.id} className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                                    <div className="p-5 border-b border-[#F3F4F6] flex justify-between items-center bg-white">
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 flex items-center justify-center bg-[#F3F4F6] text-[#111827] rounded-full text-xs font-bold">
                                                {ph.order}
                                            </span>
                                            <h4 className="font-bold text-[#111827]">{ph.title}</h4>
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#F3F4F6] text-[#6B7280]">
                                            {ph.status}
                                        </span>
                                    </div>

                                    <div className="p-5 space-y-5">
                                        {ph.description && <p className="text-sm text-[#6B7280]">{ph.description}</p>}

                                        <div className="space-y-3">
                                            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                                                <ChevronRight size={14} className="text-[#36DBBA]" /> Entregas
                                            </p>
                                            {ph.deliveries.length === 0 && <p className="text-sm text-[#9CA3AF] italic">Sin entregas aún.</p>}
                                            {ph.deliveries.map((d) => (
                                                <div key={d.id} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:border-[#36DBBA] transition-colors group">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                                                            {d.title} <span className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-[#9CA3AF]">v{d.version}</span>
                                                        </span>
                                                        {d.description && <p className="text-xs text-[#6B7280] line-clamp-1">{d.description}</p>}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[11px] font-medium text-[#9CA3AF]">{d.status}</span>
                                                        {d.fileUrl && (
                                                            <a
                                                                href={d.fileUrl}
                                                                target="_blank"
                                                                className="p-2 bg-white text-[#36DBBA] rounded-md border border-[#E5E7EB] hover:bg-[#36DBBA] hover:text-white transition-all shadow-sm"
                                                            >
                                                                <ExternalLink size={16} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar: Presupuestos y Facturas */}
                <div className="space-y-10">
                    {/* Presupuestos */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FileText size={20} className="text-[#36DBBA]" />
                            <h3 className="font-bold text-[#111827]">Presupuestos</h3>
                        </div>

                        <div className="space-y-4">
                            {project.budgets.map((b) => {
                                const canDecide = b.status === "SENT";
                                const isBusy = decidingBudgetId === b.id;

                                return (
                                    <div key={b.id} className={`p-5 rounded-xl border transition-all ${canDecide ? 'bg-white border-[#36DBBA] shadow-[0_0_15px_-5px_rgba(54,219,186,0.2)]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="text-xl font-bold text-[#111827]">
                                                {(b.totalCents / 100).toLocaleString()} <span className="text-xs font-normal text-[#6B7280]">{b.currency}</span>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${b.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' : 'bg-white text-[#6B7280]'}`}>
                                                {b.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#9CA3AF] mb-4">
                                            <div className="flex items-center gap-1.5"><Calendar size={12} /> {b.sentAt ? new Date(b.sentAt).toLocaleDateString() : '-'}</div>
                                            <div className="flex items-center gap-1.5"><Info size={12} /> Expira: {b.validUntil ? new Date(b.validUntil).toLocaleDateString() : '-'}</div>
                                        </div>

                                        {canDecide && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onDecideBudget(b.id, "ACCEPT")}
                                                    disabled={isBusy}
                                                    className="flex-1 bg-[#36DBBA] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#2BC4A6] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {isBusy ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                                                    Aceptar
                                                </button>
                                                <button
                                                    onClick={() => onDecideBudget(b.id, "REJECT")}
                                                    disabled={isBusy}
                                                    className="flex-1 bg-white text-[#6B7280] border border-[#E5E7EB] py-2 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all disabled:opacity-50"
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Facturas */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Receipt size={20} className="text-[#36DBBA]" />
                            <h3 className="font-bold text-[#111827]">Facturas</h3>
                        </div>
                        <div className="space-y-3">
                            {project.invoices.length === 0 && <p className="text-sm text-[#9CA3AF] italic px-1">Sin facturas emitidas.</p>}
                            {project.invoices.map((inv) => (
                                <div key={inv.id} className="p-4 bg-white border border-[#E5E7EB] rounded-xl hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-[#111827]">
                                            {(inv.amountCents / 100).toLocaleString()} {inv.currency}
                                        </span>
                                        <span className="text-[10px] font-bold text-[#36DBBA]">{inv.status}</span>
                                    </div>
                                    <div className="text-[11px] text-[#9CA3AF] space-y-1">
                                        <p>Nº: {inv.number || "Pendiente"}</p>
                                        <p>Vencimiento: {inv.dueAt ? new Date(inv.dueAt).toLocaleDateString() : "-"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}