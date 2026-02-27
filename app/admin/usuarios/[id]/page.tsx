"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Building2, FolderKanban, FileText, ChevronRight } from "lucide-react";
import { getUserByIdFull, UserFullAdminViewDTO } from "@/app/api/users.api";

// ── Helpers ────────────────────────────────────────────────────────────────
function money(cents: number, currency: string) {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(cents / 100);
}

// ── Badge ──────────────────────────────────────────────────────────────────
function Badge({ value }: { value: string }) {
    const styles: Record<string, string> = {
        ADMIN: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        USER: "bg-gray-100 text-gray-500",
        ACTIVE: "bg-emerald-50 text-emerald-600",
        INACTIVE: "bg-red-50 text-red-500",
        COMPLETED: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        IN_PROGRESS: "bg-blue-50 text-blue-500",
        PENDING: "bg-amber-50 text-amber-600",
        CANCELLED: "bg-red-50 text-red-500",
        PAID: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        UNPAID: "bg-red-50 text-red-500",
        DRAFT: "bg-gray-100 text-gray-500",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[value] ?? "bg-gray-100 text-gray-500"}`}>
            {value}
        </span>
    );
}

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({ icon: Icon, title, count, children }: {
    icon: React.ElementType; title: string; count?: number; children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Icon size={15} strokeWidth={1.8} className="text-[#2BC4A6]" />
                <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
                    {title}
                    {count !== undefined && (
                        <span className="ml-1.5 text-xs font-medium text-gray-400">({count})</span>
                    )}
                </h2>
            </div>
            {children}
        </section>
    );
}

// ── Empty ──────────────────────────────────────────────────────────────────
function Empty({ label }: { label: string }) {
    return <p className="text-sm text-gray-400 px-1">{label}</p>;
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function UsuarioDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [data, setData] = useState<UserFullAdminViewDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getUserByIdFull(id).then(setData).finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="w-6 h-6 rounded-full border-2 border-[#36DBBA] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-48 text-sm text-gray-400">
                Usuario no encontrado.
            </div>
        );
    }

    const { user, company, projects, invoices } = data;
    const initials = user.email.slice(0, 2).toUpperCase();

    return (
        <div className="flex flex-col gap-6 max-w-2xl">

            {/* ── 1. Usuario ── */}
            <Section icon={User} title="Usuario">
                <div className="flex items-center gap-4 px-4 py-4 rounded-xl border border-gray-100 bg-white">
                    <div className="w-11 h-11 rounded-xl bg-[#36DBBA]/10 flex items-center justify-center shrink-0">
                        <span className="text-base font-semibold text-[#2BC4A6]">{initials}</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                        {user.name && (
                            <p className="text-xs text-gray-400 mt-0.5">{user.name}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <Badge value={user.role} />
                            <Badge value={user.status} />
                        </div>
                    </div>
                </div>
            </Section>

            {/* ── 3. Proyectos ── */}
            <Section icon={FolderKanban} title="Proyectos" count={projects.length}>
                {projects.length === 0 ? (
                    <Empty label="Sin proyectos" />
                ) : (
                    <div className="flex flex-col gap-2">
                        {projects.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => router.push(`/admin/proyectos/${p.id}`)}
                                className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all text-left"
                            >
                                <div className="w-8 h-8 rounded-lg bg-[#36DBBA]/10 flex items-center justify-center shrink-0">
                                    <FolderKanban size={15} strokeWidth={1.8} className="text-[#2BC4A6]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                                    <div className="mt-1">
                                        <Badge value={p.status} />
                                    </div>
                                </div>
                                <ChevronRight size={15} className="text-gray-300 shrink-0" />
                            </button>
                        ))}
                    </div>
                )}
            </Section>

            {/* ── 4. Facturas ── */}
            <Section icon={FileText} title="Facturas" count={invoices.length}>
                {invoices.length === 0 ? (
                    <Empty label="Sin facturas" />
                ) : (
                    <div className="flex flex-col gap-2">
                        {invoices.map((inv) => (
                            <div
                                key={inv.id}
                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-white"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {inv.number || "Sin número"}
                                    </p>
                                    <div className="mt-1">
                                        <Badge value={inv.status} />
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">
                                    {money(inv.amountCents, inv.currency)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

        </div>
    );
}