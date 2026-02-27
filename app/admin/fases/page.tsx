"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Trash2, ChevronRight, AlertCircle, Layers } from "lucide-react";
import { deletePhase, getAllPhases, type PhaseWithProjectDTO } from "@/app/api/phases.api";

// ── Badge ──────────────────────────────────────────────────────────────────
function Badge({ value }: { value: string }) {
    const styles: Record<string, string> = {
        TODO: "bg-gray-100 text-gray-500",
        IN_PROGRESS: "bg-blue-50 text-blue-500",
        BLOCKED: "bg-orange-50 text-orange-500",
        DONE: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        CANCELED: "bg-red-50 text-red-500",
        ACTIVE: "bg-emerald-50 text-emerald-600",
        COMPLETED: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        INACTIVE: "bg-gray-100 text-gray-500",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[value] ?? "bg-gray-100 text-gray-500"}`}>
            {value}
        </span>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function FasesPage() {
    const router = useRouter();

    const [phases, setPhases] = useState<PhaseWithProjectDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function load(silent = false) {
        if (silent) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const list = await getAllPhases();
            setPhases(list);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Error cargando fases");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function onDelete(id: string) {
        if (!window.confirm("¿Seguro que quieres eliminar esta fase?")) return;
        setError(null);
        setDeletingId(id);
        try {
            await deletePhase(id);
            setPhases((prev) => prev.filter((p) => p.id !== id));
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "No se pudo eliminar");
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="w-6 h-6 rounded-full border-2 border-[#36DBBA] border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Fases</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{phases.length} fases registradas</p>
                </div>
                <button
                    onClick={() => load(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
                    Refrescar
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle size={15} className="shrink-0" />
                    {error}
                </div>
            )}

            {/* Lista */}
            <div className="flex flex-col gap-2">
                {phases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                        <Layers size={32} strokeWidth={1.5} />
                        <p className="text-sm">No hay fases todavía.</p>
                    </div>
                ) : (
                    phases.map((ph) => (
                        <div
                            key={ph.id}
                            className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all"
                        >
                            {/* Número de orden */}
                            <div className="w-9 h-9 rounded-xl bg-[#36DBBA]/10 flex items-center justify-center shrink-0">
                                <span className="text-sm font-semibold text-[#2BC4A6]">{ph.order}</span>
                            </div>

                            {/* Info — clickable → proyecto */}
                            <button
                                onClick={() => router.push(`/admin/proyectos/${ph.project.id}`)}
                                className="flex-1 min-w-0 text-left"
                            >
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{ph.title}</p>
                                    <Badge value={ph.status} />
                                </div>

                                {ph.description && (
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{ph.description}</p>
                                )}

                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                    <span className="text-xs text-gray-400">
                                        Proyecto:{" "}
                                        <span className="text-gray-600 font-medium">{ph.project.name}</span>
                                    </span>
                                    <Badge value={ph.project.status} />
                                    <span className="text-xs text-gray-300">·</span>
                                    <span className="text-xs text-gray-400">
                                        {ph.project.client?.name
                                            ? `${ph.project.client.name} (${ph.project.client.email})`
                                            : ph.project.client.email}
                                    </span>
                                </div>
                            </button>

                            <ChevronRight size={15} className="text-gray-300 shrink-0" />

                            {/* Delete */}
                            <button
                                onClick={() => onDelete(ph.id)}
                                disabled={deletingId === ph.id}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Eliminar fase"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}