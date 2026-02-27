"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/app/store/auth.store";
import { getInvoicesByUser, type InvoiceWithProjectDTO } from "@/app/api/invoices.client.api";
import {
    Receipt,
    Calendar,
    Hash,
    ExternalLink,
    Loader2,
    FileWarning,
    SearchX,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageCircle,
    ArrowRight
} from "lucide-react";

const WHATSAPP_NUMBER = "34604894472";

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
                const msg = err?.response?.data?.message || err?.message || "No se pudieron cargar las facturas";
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return <div className="p-6 text-[#6B7280]">No autenticado</div>;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-[#36DBBA]" size={40} />
                <p className="text-[#9CA3AF] font-medium">Sincronizando historial de facturación...</p>
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

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-green-50 text-green-600 border-green-100";
            case "OVERDUE":
                return "bg-red-50 text-red-600 border-red-100";
            default:
                return "bg-blue-50 text-blue-600 border-blue-100";
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex items-end justify-between border-b border-[#F3F4F6] pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Facturación</h2>
                    <p className="text-[#6B7280] text-sm mt-1">Consulta tus pagos realizados y facturas pendientes.</p>
                </div>
                <div className="bg-[#F9FAFB] px-4 py-2 rounded-lg border border-[#E5E7EB]">
                    <span className="text-[10px] font-bold text-[#9CA3AF] uppercase block">Total Documentos</span>
                    <span className="text-xl font-bold text-[#111827]">{invoices.length}</span>
                </div>
            </header>

            {invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-[#E5E7EB] border-dashed shadow-sm">
                    <SearchX size={48} className="text-[#E5E7EB] mb-4" />
                    <p className="text-[#6B7280] font-medium">No hay facturas registradas</p>
                    <p className="text-[#9CA3AF] text-sm">Tu historial aparecerá aquí automáticamente.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {invoices.map((inv) => {
                        const msg = encodeURIComponent(
                            `¡Hola! Quiero gestionar el pago de una factura.\n\n` +
                            `📁 Proyecto: ${inv.project.name} (${inv.project.id})\n` +
                            `📄 Factura ID: ${inv.id}\n` +
                            `🔢 Número: ${inv.number || "-"}\n` +
                            `💰 Importe: ${(inv.amountCents / 100).toFixed(2)} ${inv.currency}\n` +
                            `📅 Vencimiento: ${inv.dueAt ? new Date(inv.dueAt).toLocaleDateString() : "-"}`
                        );

                        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
                        const canPay = inv.status === "SENT" || inv.status === "OVERDUE";

                        return (
                            <div
                                key={inv.id}
                                className="group bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
                            >
                                {/* Header Factura */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[#9CA3AF] text-[10px] font-bold uppercase tracking-widest">
                                            <Hash size={12} /> {inv.number || "PENDIENTE"}
                                        </div>
                                        <div className="text-2xl font-bold text-[#111827]">
                                            {(inv.amountCents / 100).toLocaleString()}
                                            <span className="text-sm font-medium text-[#6B7280] ml-1.5">{inv.currency}</span>
                                        </div>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(inv.status)}`}>
                                        {inv.status}
                                    </div>
                                </div>

                                {/* Fechas y Notas */}
                                <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6]">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Emisión</p>
                                        <p className="text-xs font-semibold text-[#6B7280]">
                                            {inv.issuedAt ? new Date(inv.issuedAt).toLocaleDateString() : "-"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Vencimiento</p>
                                        <p className={`text-xs font-semibold ${inv.status === 'OVERDUE' ? 'text-red-500 font-bold' : 'text-[#6B7280]'}`}>
                                            {inv.dueAt ? new Date(inv.dueAt).toLocaleDateString() : "-"}
                                        </p>
                                    </div>
                                </div>

                                {inv.notes && (
                                    <p className="text-xs text-[#9CA3AF] italic mb-5 px-1 line-clamp-2">
                                        "{inv.notes}"
                                    </p>
                                )}

                                {/* Info Proyecto */}
                                <div className="mt-auto pt-5 border-t border-[#F3F4F6]">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-8 h-8 rounded-lg bg-[#36DBBA10] flex items-center justify-center text-[#36DBBA]">
                                            <Receipt size={16} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Proyecto</p>
                                            <p className="text-sm font-bold text-[#111827] truncate">{inv.project.name}</p>
                                        </div>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/client/proyectos/${inv.project.id}`}
                                            className="flex-1 text-center py-2.5 bg-white border border-[#E5E7EB] text-[#6B7280] text-xs font-bold rounded-xl hover:bg-[#F9FAFB] hover:text-[#111827] transition-all flex items-center justify-center gap-2"
                                        >
                                            Ver Proyecto <ArrowRight size={14} />
                                        </Link>

                                        {canPay && (
                                            <a
                                                href={waLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 text-center py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:bg-[#128C7E] shadow-[0_4px_12px_rgba(37,211,102,0.2)] transition-all flex items-center justify-center gap-2"
                                            >
                                                <MessageCircle size={14} /> Pagar WhatsApp
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}