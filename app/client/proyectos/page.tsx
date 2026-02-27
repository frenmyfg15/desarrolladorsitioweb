"use client";

import { useEffect, useState } from "react";
import { getProjectsByUser, ClientProjectListItemDTO } from "@/app/api/projects.client.api";
import { useAuthStore } from "@/app/store/auth.store";
import Link from "next/link";
import { Briefcase, ChevronRight, Circle, Loader2, FolderOpen } from "lucide-react";

export default function ClientProjectsPage() {
    const user = useAuthStore((s) => s.user);

    const [projects, setProjects] = useState<ClientProjectListItemDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        getProjectsByUser(user.id)
            .then(setProjects)
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64 bg-[#F3F4F6] rounded-xl border border-dashed border-[#E5E7EB]">
                <p className="text-[#6B7280]">No autenticado</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="animate-spin text-[#36DBBA]" size={32} />
                <p className="text-[#9CA3AF] text-sm font-medium">Cargando tus proyectos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Proyectos</h2>
                    <p className="text-[#6B7280] text-sm mt-1">Gestiona y visualiza el progreso de tus trabajos activos.</p>
                </div>
                <div className="bg-[#36DBBA15] p-3 rounded-full">
                    <Briefcase className="text-[#36DBBA]" size={24} />
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] shadow-sm">
                    <FolderOpen size={48} className="text-[#E5E7EB] mb-4" />
                    <p className="text-[#6B7280] font-medium">No tienes proyectos registrados</p>
                    <p className="text-[#9CA3AF] text-sm">Cuando inicies un nuevo proyecto, aparecerá aquí.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p) => (
                        <Link
                            key={p.id}
                            href={`/client/proyectos/${p.id}`}
                            className="group relative bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl p-6 transition-all duration-300 hover:border-[#36DBBA] hover:shadow-[0_0_20px_-5px_rgba(54,219,186,0.3)] hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Briefcase size={18} className="text-[#36DBBA]" />
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#E5E7EB] shadow-sm">
                                    <Circle size={8} className="fill-[#36DBBA] text-[#36DBBA]" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                                        {p.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-bold text-[#111827] group-hover:text-[#36DBBA] transition-colors line-clamp-1">
                                    {p.name}
                                </h3>
                                <p className="text-xs text-[#9CA3AF] flex items-center gap-1">
                                    ID de proyecto: #{p.id.toString().slice(-5)}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                                <span className="text-sm font-medium text-[#6B7280]">Ver detalles</span>
                                <ChevronRight size={18} className="text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}