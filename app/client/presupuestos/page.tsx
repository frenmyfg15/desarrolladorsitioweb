"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/app/store/auth.store";
import { getBudgetsByUser, type BudgetWithProjectDTO } from "@/app/api/budgets.client.api";
import {
    FileText,
    Calendar,
    ArrowRight,
    Loader2,
    AlertCircle,
    SearchX,
    Clock,
    CheckCircle2,
    XCircle
} from "lucide-react";

export default function ClientBudgetsPage() {
    const user = useAuthStore((s) => s.user);

    const [budgets, setBudgets] = useState<BudgetWithProjectDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        setError(null);

        getBudgetsByUser(user.id)
            .then(setBudgets)
            .catch((err: any) => {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    "No se pudieron cargar los presupuestos";
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) {
        return (
            <div className="flex items-center gap-3 p-6 bg-red-50 text-red-600 rounded-xl border border-red-100">
                <AlertCircle size={20} />
                <p className="font-medium">No autenticado</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-[#36DBBA]" size={40} />
                <p className="text-[#9CA3AF] font-medium">Sincronizando presupuestos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 p-6 bg-red-50 text-red-600 rounded-xl border border-red-100">
                <XCircle size={20} />
                <p className="font-medium">{error}</p>
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "ACCEPTED":
                return "bg-green-50 text-green-600 border-green-100";
            case "REJECTED":
                return "bg-red-50 text-red-600 border-red-100";
            case "SENT":
                return "bg-[#36DBBA15] text-[#36DBBA] border-[#36DBBA20]";
            default:
                return "bg-gray-50 text-gray-500 border-gray-100";
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Presupuestos</h2>
                <p className="text-[#6B7280] text-sm mt-1">Revisa y gestiona las propuestas económicas de tus proyectos.</p>
            </div>

            {budgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E5E7EB] border-dashed">
                    <SearchX size={48} className="text-[#E5E7EB] mb-4" />
                    <p className="text-[#6B7280] font-medium">No tienes presupuestos</p>
                    <p className="text-[#9CA3AF] text-sm">Las propuestas aparecerán aquí cuando sean enviadas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budgets.map((b) => (
                        <Link
                            key={b.id}
                            href={`/client/proyectos/${b.project.id}`}
                            className="group block bg-white border border-[#E5E7EB] rounded-xl p-6 transition-all duration-300 hover:border-[#36DBBA] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-[#111827]">
                                        {(b.totalCents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                        <span className="text-sm font-medium text-[#9CA3AF] ml-1.5">{b.currency}</span>
                                    </div>
                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(b.status)}`}>
                                        {b.status}
                                    </div>
                                </div>
                                <div className="p-2.5 bg-[#F9FAFB] rounded-lg text-[#9CA3AF] group-hover:text-[#36DBBA] group-hover:bg-[#36DBBA10] transition-colors">
                                    <FileText size={20} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Enviado</p>
                                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                        <Calendar size={14} className="text-[#E5E7EB]" />
                                        {b.sentAt ? new Date(b.sentAt).toLocaleDateString() : "-"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Válido hasta</p>
                                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                        <Clock size={14} className="text-[#E5E7EB]" />
                                        {b.validUntil ? new Date(b.validUntil).toLocaleDateString() : "-"}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-[#F3F4F6] flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Proyecto Relacionado</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-[#111827] text-sm group-hover:text-[#36DBBA] transition-colors">
                                            {b.project.name}
                                        </span>
                                        <span className="w-1 h-1 bg-[#E5E7EB] rounded-full" />
                                        <span className="text-xs text-[#9CA3AF]">{b.project.status}</span>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-[#E5E7EB] group-hover:text-[#36DBBA] group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}