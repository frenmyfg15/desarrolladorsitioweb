"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllInvoices, deleteInvoice, type InvoiceWithProjectDTO } from "@/app/api/invoices.api";

export default function FacturasPage() {
    const router = useRouter();

    const [invoices, setInvoices] = useState<InvoiceWithProjectDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        setError(null);

        try {
            const list = await getAllInvoices();
            setInvoices(list);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Error cargando facturas");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function onDelete(id: string) {
        const ok = window.confirm("¿Seguro que quieres eliminar esta factura?");
        if (!ok) return;

        setError(null);
        setDeletingId(id);

        try {
            await deleteInvoice(id);
            setInvoices((prev) => prev.filter((i) => i.id !== id));
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "No se pudo eliminar");
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) return <div>Cargando facturas...</div>;

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <h1 style={{ margin: 0 }}>Facturas</h1>

                <button
                    onClick={load}
                    style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid #eee",
                        background: "white",
                        cursor: "pointer",
                    }}
                >
                    Refrescar
                </button>
            </div>

            {error && (
                <div
                    style={{
                        padding: 10,
                        borderRadius: 8,
                        border: "1px solid #ffd1d1",
                        background: "#fff5f5",
                        color: "crimson",
                        fontSize: 14,
                    }}
                >
                    {error}
                </div>
            )}

            <div style={{ display: "grid", gap: 8 }}>
                {invoices.map((inv) => (
                    <div
                        key={inv.id}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            gap: 10,
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 8,
                            border: "1px solid #eee",
                            background: "white",
                        }}
                    >
                        {/* principal: factura — secundario: proyecto */}
                        <button
                            onClick={() => router.push(`/admin/proyectos/${inv.project.id}`)}
                            style={{
                                border: "none",
                                background: "transparent",
                                textAlign: "left",
                                padding: 0,
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                                <div style={{ fontWeight: 700 }}>
                                    {inv.number || "Sin número"}
                                </div>
                                <div style={{ fontSize: 12, color: "#666" }}>{inv.status}</div>
                            </div>

                            <div style={{ fontSize: 13, marginTop: 4 }}>
                                {(inv.amountCents / 100).toFixed(2)} {inv.currency}
                            </div>

                            <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
                                Proyecto: <span style={{ color: "#111" }}>{inv.project.name}</span> • {inv.project.status}
                            </div>

                            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                                Cliente:{" "}
                                {inv.project.client?.name
                                    ? `${inv.project.client.name} (${inv.project.client.email})`
                                    : inv.project.client.email}
                            </div>
                        </button>

                        <button
                            onClick={() => onDelete(inv.id)}
                            disabled={deletingId === inv.id}
                            style={{
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "1px solid #111",
                                background: deletingId === inv.id ? "#eee" : "white",
                                cursor: deletingId === inv.id ? "not-allowed" : "pointer",
                            }}
                            title="Eliminar"
                        >
                            {deletingId === inv.id ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}