"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    User,
    FolderKanban,
    FileText,
    ChevronRight,
    Plus,
    X,
    AlertCircle,
    Calendar,
} from "lucide-react";
import { getUserByIdFull, UserFullAdminViewDTO } from "@/app/api/users.api";
import {
    createProjectForUser,
    type CreateProjectBody,
    type ProjectListItemDTO,
    type ProjectStatus,
} from "@/app/api/projects.api";

// ── Helpers ────────────────────────────────────────────────────────────────
function money(cents: number, currency: string) {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(cents / 100);
}
function toDateInput(iso: string | null | undefined) {
    if (!iso) return "";
    return iso.slice(0, 10);
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
        OVERDUE: "bg-red-50 text-red-500",
        DRAFT: "bg-gray-100 text-gray-500",
        SENT: "bg-blue-50 text-blue-500",
        ON_HOLD: "bg-amber-50 text-amber-600",
        CANCELED: "bg-red-50 text-red-500",
    };
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[value] ?? "bg-gray-100 text-gray-500"
                }`}
        >
            {value}
        </span>
    );
}

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({
    icon: Icon,
    title,
    count,
    action,
    children,
}: {
    icon: React.ElementType;
    title: string;
    count?: number;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon size={15} strokeWidth={1.8} className="text-[#2BC4A6]" />
                    <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
                        {title}
                        {count !== undefined && (
                            <span className="ml-1.5 text-xs font-medium text-gray-400">({count})</span>
                        )}
                    </h2>
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

// ── Empty ──────────────────────────────────────────────────────────────────
function Empty({ label }: { label: string }) {
    return <p className="text-sm text-gray-400 px-1">{label}</p>;
}

// ── Modal base ─────────────────────────────────────────────────────────────
function Modal({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-xl p-6 flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900 tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function ErrorMsg({ msg }: { msg: string }) {
    return (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle size={15} className="shrink-0" />
            {msg}
        </div>
    );
}

// ── Create Project Modal ───────────────────────────────────────────────────
const PROJECT_STATUSES: ProjectStatus[] = ["DRAFT", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELED"];
const inputCls =
    "px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#36DBBA] focus:bg-white focus:ring-2 focus:ring-[#36DBBA]/15";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {children}
        </label>
    );
}

function CreateProjectModal({
    userId,
    onClose,
    onCreated,
}: {
    userId: string;
    onClose: () => void;
    onCreated: (p: ProjectListItemDTO) => void;
}) {
    const [name, setName] = useState("");
    const [description, setDesc] = useState("");
    const [status, setStatus] = useState<ProjectStatus>("DRAFT");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSave = useMemo(() => name.trim().length > 1, [name]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!canSave) {
            setError("El nombre del proyecto es obligatorio");
            return;
        }

        setSaving(true);
        try {
            const body: CreateProjectBody = {
                name: name.trim(),
                description: description.trim() || undefined,
                status,
                startDate: startDate ? new Date(startDate).toISOString() : undefined,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            };

            const created = await createProjectForUser(userId, body);
            onCreated(created);
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "No se pudo crear el proyecto");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal title="Nuevo proyecto" onClose={onClose}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <Field label="Nombre">
                    <input
                        className={inputCls}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre del proyecto"
                        required
                    />
                </Field>

                <Field label="Descripción (opcional)">
                    <textarea
                        className={`${inputCls} resize-none`}
                        rows={3}
                        value={description}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Descripción..."
                    />
                </Field>

                <Field label="Estado">
                    <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
                        {PROJECT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                    <Field label="Fecha inicio">
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                className={`${inputCls} pl-9`}
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                    </Field>

                    <Field label="Fecha entrega">
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                className={`${inputCls} pl-9`}
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </Field>
                </div>

                {error && <ErrorMsg msg={error} />}

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 rounded-xl bg-[#36DBBA] text-white text-sm font-semibold tracking-tight shadow-[0_4px_14px_rgba(54,219,186,0.3)] transition hover:bg-[#2BC4A6] hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {saving ? "Creando..." : "Crear proyecto"}
                </button>
            </form>
        </Modal>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function UsuarioDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [data, setData] = useState<UserFullAdminViewDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [projectModalOpen, setProjectModalOpen] = useState(false);

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
        return <div className="flex items-center justify-center h-48 text-sm text-gray-400">Usuario no encontrado.</div>;
    }

    const { user, projects, invoices } = data;
    const initials = user.email.slice(0, 2).toUpperCase();

    function onProjectCreated(p: ProjectListItemDTO) {
        // OJO: data.projects en tu DTO ya incluye invoices dentro en algunos lugares,
        // aquí solo necesitamos meter el nuevo proyecto y listo.
        setData((prev) => {
            if (!prev) return prev;
            return { ...prev, projects: [p as any, ...prev.projects] };
        });
    }

    return (
        <>
            <div className="flex flex-col gap-6 max-w-2xl">
                {/* ── 1. Usuario ── */}
                <Section icon={User} title="Usuario">
                    <div className="flex items-center gap-4 px-4 py-4 rounded-xl border border-gray-100 bg-white">
                        <div className="w-11 h-11 rounded-xl bg-[#36DBBA]/10 flex items-center justify-center shrink-0">
                            <span className="text-base font-semibold text-[#2BC4A6]">{initials}</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                            {user.name && <p className="text-xs text-gray-400 mt-0.5">{user.name}</p>}
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <Badge value={user.role} />
                                <Badge value={user.status} />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ── 3. Proyectos ── */}
                <Section
                    icon={FolderKanban}
                    title="Proyectos"
                    count={projects.length}
                    action={
                        <button
                            onClick={() => setProjectModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#36DBBA]/10 text-[#2BC4A6] text-xs font-semibold hover:bg-[#36DBBA]/20 transition-colors"
                        >
                            <Plus size={13} /> Nuevo
                        </button>
                    }
                >
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
                                <div key={inv.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-white">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{inv.number || "Sin número"}</p>
                                        <div className="mt-1">
                                            <Badge value={inv.status} />
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{money(inv.amountCents, inv.currency)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>
            </div>

            {projectModalOpen && (
                <CreateProjectModal
                    userId={id}
                    onClose={() => setProjectModalOpen(false)}
                    onCreated={onProjectCreated}
                />
            )}
        </>
    );
}