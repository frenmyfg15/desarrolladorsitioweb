"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/app/store/auth.store";
import { getInvoicesByUser, type InvoiceWithProjectDTO } from "@/app/api/invoices.client.api";
import {
    Receipt,
    Calendar,
    Hash,
    ArrowUpRight,
    Loader2,
    FileWarning,
    SearchX,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";

export default function ClientInvoicesPage() {
    const user = useAuthStore((s) => s.user);

    const [invoices, setInvoices] = useState<InvoiceWithProjectDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        setError(null);

        getInvoicesByUser(user.id)
            .then(setInvoices)
            .catch((err: any) => {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    "No se pudieron cargar las facturas";
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return <div className="p-6 text-[#6B7280]">No autenticado</div>;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-[#36DBBA]" size={40} />
                <p className="text-[#9CA3AF] font-medium">Cargando historial de facturación...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 p-6 bg-red-50 text-red-600 rounded-xl border border-red-100">
                <FileWarning size={20} />
                <p className="font-medium">{error}</p>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PAID":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider border border-green-100">
                        <CheckCircle2 size={12} /> Pagada
                    </span>
                );
            case "OVERDUE":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider border border-red-100">
                        <AlertCircle size={12} /> Vencida
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                        <Clock size={12} /> {status}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Facturas</h2>
                    <p className="text-[#6B7280] text-sm mt-1">Historial de pagos y documentos emitidos.</p>
                </div>
                <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Total Facturas</p>
                    <p className="text-2xl font-bold text-[#111827]">{invoices.length}</p>
                </div>
            </div>

            {invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-[#E5E7EB] border-dashed shadow-sm">
                    <SearchX size={48} className="text-[#E5E7EB] mb-4" />
                    <p className="text-[#6B7280] font-medium">Sin facturas disponibles</p>
                    <p className="text-[#9CA3AF] text-sm">Las facturas aparecerán aquí una vez generadas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {invoices.map((inv) => (
                        <Link
                            key={inv.id}
                            href={`/client/proyectos/${inv.project.id}`}
                            className="group relative bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl p-6 transition-all duration-300 hover:border-[#36DBBA] hover:shadow-[0_8px_30px_rgb(54,219,186,0.08)]"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[#9CA3AF] text-xs font-medium mb-1">
                                        <Hash size={14} />
                                        <span>{inv.number || "Borrador"}</span>
                                    </div>
                                    <div className="text-2xl font-bold text-[#111827]">
                                        {(inv.amountCents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                        <span className="text-sm font-medium text-[#6B7280] ml-1.5">{inv.currency}</span>
                                    </div>
                                </div>
                                {getStatusBadge(inv.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar size={12} /> Emisión
                                    </p>
                                    <p className="text-sm font-semibold text-[#111827]">
                                        {inv.issuedAt ? new Date(inv.issuedAt).toLocaleDateString() : "-"}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5">
                                        <Clock size={12} /> Vencimiento
                                    </p>
                                    <p className={`text-sm font-semibold ${inv.status === 'OVERDUE' ? 'text-red-500' : 'text-[#111827]'}`}>
                                        {inv.dueAt ? new Date(inv.dueAt).toLocaleDateString() : "-"}
                                    </p>
                                </div>
                            </div>

                            {inv.notes && (
                                <div className="mb-6 p-3 bg-white/50 rounded-lg text-xs text-[#6B7280] border border-[#E5E7EB]/50 italic">
                                    "{inv.notes}"
                                </div>
                            )}

                            <div className="pt-5 border-t border-[#E5E7EB] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#E5E7EB] text-[#36DBBA]">
                                        <Receipt size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Proyecto</p>
                                        <p className="text-sm font-bold text-[#111827] group-hover:text-[#36DBBA] transition-colors line-clamp-1">
                                            {inv.project.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-[#36DBBA] font-bold text-xs opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                    VER PROYECTO <ArrowUpRight size={14} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}