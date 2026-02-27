"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Trash2, ChevronRight, AlertCircle, FolderKanban } from "lucide-react";
import type { ProjectListItemDTO } from "@/app/api/projects.api";
import { getAllProjects, deleteProject } from "@/app/api/projects.api";

// ── Badge de estado ────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        ACTIVE: "bg-emerald-50 text-emerald-600",
        INACTIVE: "bg-gray-100 text-gray-500",
        COMPLETED: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        CANCELLED: "bg-red-50 text-red-500",
        IN_PROGRESS: "bg-blue-50 text-blue-500",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-500"}`}>
            {status}
        </span>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ProyectosPage() {
    const router = useRouter();

    const [projects, setProjects] = useState<ProjectListItemDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function load(silent = false) {
        if (silent) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const list = await getAllProjects();
            setProjects(list);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Error cargando proyectos");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function onDelete(id: string) {
        const ok = window.confirm("¿Seguro que quieres eliminar este proyecto?");
        if (!ok) return;
        setError(null);
        setDeletingId(id);
        try {
            await deleteProject(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "No se pudo eliminar");
        } finally {
            setDeletingId(null);
        }
    }

    // ── Loading ──
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
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Proyectos</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{projects.length} proyectos registrados</p>
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
                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                        <FolderKanban size={32} strokeWidth={1.5} />
                        <p className="text-sm">No hay proyectos todavía.</p>
                    </div>
                ) : (
                    projects.map((p) => (
                        <div
                            key={p.id}
                            className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all"
                        >
                            {/* Icono */}
                            <div className="w-9 h-9 rounded-xl bg-[#36DBBA]/10 flex items-center justify-center shrink-0">
                                <FolderKanban size={17} strokeWidth={1.8} className="text-[#2BC4A6]" />
                            </div>

                            {/* Info — clickable */}
                            <button
                                onClick={() => router.push(`/admin/proyectos/${p.id}`)}
                                className="flex-1 min-w-0 text-left"
                            >
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                                    <StatusBadge status={p.status} />
                                </div>

                                {p.description && (
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{p.description}</p>
                                )}

                                <p className="text-xs text-gray-400 mt-1">
                                    Cliente:{" "}
                                    <span className="text-gray-600 font-medium">
                                        {p.client?.name ? `${p.client.name} (${p.client.email})` : p.client.email}
                                    </span>
                                </p>
                            </button>

                            <ChevronRight size={15} className="text-gray-300 shrink-0" />

                            {/* Delete */}
                            <button
                                onClick={() => onDelete(p.id)}
                                disabled={deletingId === p.id}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Eliminar proyecto"
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