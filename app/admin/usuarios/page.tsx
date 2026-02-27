"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Trash2, ChevronRight, X, AlertCircle } from "lucide-react";
import { getAllUsers, createUser, deleteUser } from "@/app/api/users.api";
import type { UserDTO } from "@/app/api/auth.api";

// ── Badge de rol / estado ──────────────────────────────────────────────────
function Badge({ value }: { value: string }) {
    const styles: Record<string, string> = {
        ADMIN: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        USER: "bg-gray-100 text-gray-500",
        ACTIVE: "bg-emerald-50 text-emerald-600",
        INACTIVE: "bg-red-50 text-red-500",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[value] ?? "bg-gray-100 text-gray-500"}`}>
            {value}
        </span>
    );
}

// ── Input reutilizable ─────────────────────────────────────────────────────
function Field({
    label, type = "text", value, onChange, placeholder, required,
}: {
    label: string; type?: string; value: string;
    onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#36DBBA] focus:bg-white focus:ring-2 focus:ring-[#36DBBA]/15"
            />
        </label>
    );
}

// ── Modal crear usuario ────────────────────────────────────────────────────
function CreateUserModal({
    onClose, onCreated,
}: {
    onClose: () => void;
    onCreated: (user: UserDTO) => void;
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<"USER" | "ADMIN">("USER");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canCreate = useMemo(
        () => email.trim().length > 3 && password.length >= 6,
        [email, password]
    );

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canCreate) return;
        setError(null);
        setCreating(true);
        try {
            const newUser = await createUser({
                email: email.trim(),
                password,
                name: name.trim() || undefined,
                role,
            });
            onCreated(newUser);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "No se pudo crear el usuario");
        } finally {
            setCreating(false);
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-xl p-6 flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header modal */}
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                        Crear usuario
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <Field label="Email" type="email" value={email} onChange={setEmail}
                        placeholder="usuario@email.com" required />

                    <Field label="Contraseña (mínimo 6 caracteres)" type="password"
                        value={password} onChange={setPassword} placeholder="••••••••" required />

                    <Field label="Nombre (opcional)" value={name} onChange={setName}
                        placeholder="Juan Pérez" />

                    {/* Rol */}
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-gray-700">Rol</span>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")}
                            className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition focus:border-[#36DBBA] focus:bg-white focus:ring-2 focus:ring-[#36DBBA]/15"
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </label>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            <AlertCircle size={15} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={creating || !canCreate}
                        className="w-full py-2.5 rounded-xl bg-[#36DBBA] text-white text-sm font-semibold tracking-tight shadow-[0_4px_14px_rgba(54,219,186,0.3)] transition hover:bg-[#2BC4A6] hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {creating ? "Creando..." : "Crear usuario"}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function UsuariosPage() {
    const router = useRouter();

    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [open, setOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function refreshUsers(silent = false) {
        if (silent) setRefreshing(true);
        else setLoading(true);
        try {
            const list = await getAllUsers();
            setUsers(list);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => { refreshUsers(); }, []);

    async function onDeleteUser(id: string) {
        const ok = window.confirm("¿Seguro que quieres eliminar este usuario?");
        if (!ok) return;
        setError(null);
        setDeletingId(id);
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
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
        <>
            <div className="flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Usuarios</h1>
                        <p className="text-sm text-gray-400 mt-0.5">{users.length} usuarios registrados</p>
                    </div>

                    <button
                        onClick={() => refreshUsers(true)}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
                        Refrescar
                    </button>
                </div>

                {/* Error global */}
                {error && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                        <AlertCircle size={15} className="shrink-0" />
                        {error}
                    </div>
                )}

                {/* Lista */}
                <div className="flex flex-col gap-2">
                    {users.length === 0 ? (
                        <div className="text-center py-16 text-gray-400 text-sm">
                            No hay usuarios todavía.
                        </div>
                    ) : (
                        users.map((u) => (
                            <div
                                key={u.id}
                                className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all"
                            >
                                {/* Info — clickable */}
                                <button
                                    onClick={() => router.push(`/admin/usuarios/${u.id}`)}
                                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                                >
                                    {/* Avatar inicial */}
                                    <div className="w-9 h-9 rounded-xl bg-[#36DBBA]/10 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-semibold text-[#2BC4A6]">
                                            {u.email.slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{u.email}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Badge value={u.role} />
                                            <Badge value={u.status} />
                                        </div>
                                    </div>

                                    <ChevronRight size={15} className="text-gray-300 shrink-0 ml-auto" />
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={() => onDeleteUser(u.id)}
                                    disabled={deletingId === u.id}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    title="Eliminar usuario"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* FAB */}
            <button
                onClick={() => { setError(null); setOpen(true); }}
                className="fixed right-6 bottom-6 w-12 h-12 rounded-xl bg-[#36DBBA] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(54,219,186,0.4)] hover:bg-[#2BC4A6] hover:-translate-y-px transition-all"
                aria-label="Crear usuario"
            >
                <Plus size={20} />
            </button>

            {/* Modal */}
            {open && (
                <CreateUserModal
                    onClose={() => setOpen(false)}
                    onCreated={(newUser) => {
                        setUsers((prev) => [newUser, ...prev]);
                        setOpen(false);
                    }}
                />
            )}
        </>
    );
}