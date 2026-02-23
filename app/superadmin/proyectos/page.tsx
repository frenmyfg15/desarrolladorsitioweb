"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Proyecto, proyectoApi } from "@/app/api/proyectos/proyecto.api";
import {
    Check,
    ChevronRight,
    Loader2,
    Search,
    Trash2,
    Eye,
    Filter,
} from "lucide-react";

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(" ");
}

function formatDate(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}

const tone = {
    primary: "#6FCFBA",
    dark: "#1F3D3A",
    mint: "#E9F7F3",
    white: "#FFFFFF",
    gray50: "#F2F4F5",
    gray500: "#8A8F93",
    gray900: "#2B2E31",
    border: "#DDEBE6",
    border2: "#CDEFE6",
    dangerBorder: "#F3C6CE",
    dangerBg: "#FFECEF",
    dangerText: "#7B1E2B",
    warnBorder: "#EBD9B6",
    warnBg: "#FFF6DF",
    warnText: "#6A4A12",
};

function Badge({
    children,
    tone: t = "neutral",
}: {
    children: React.ReactNode;
    tone?: "neutral" | "brand" | "success" | "warning" | "danger";
}) {
    const styles: Record<string, string> = {
        neutral: "border-[#DDEBE6] bg-white text-[#2B2E31] ring-1 ring-inset ring-[#DDEBE6]",
        brand: "border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] ring-1 ring-inset ring-[#CDEFE6]",
        success: "border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] ring-1 ring-inset ring-[#CDEFE6]",
        warning: "border-[#EBD9B6] bg-[#FFF6DF] text-[#6A4A12] ring-1 ring-inset ring-[#EBD9B6]",
        danger: "border-[#F3C6CE] bg-[#FFECEF] text-[#7B1E2B] ring-1 ring-inset ring-[#F3C6CE]",
    };

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
                styles[t]
            )}
        >
            {children}
        </span>
    );
}

function IconButton({
    onClick,
    disabled,
    title,
    children,
    variant = "neutral",
}: {
    onClick?: () => void;
    disabled?: boolean;
    title?: string;
    children: React.ReactNode;
    variant?: "neutral" | "brand" | "danger";
}) {
    const v =
        variant === "brand"
            ? "border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] hover:bg-[#DFF3ED] hover:border-[#BEE7DC]"
            : variant === "danger"
                ? "border-[#F3C6CE] bg-white text-[#7B1E2B] hover:bg-[#FFECEF]"
                : "border-[#DDEBE6] bg-white text-[#2B2E31] hover:bg-[#F2F4F5] hover:border-[#CFE4DD]";

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cx(
                "inline-flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition",
                v,
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "active:translate-y-[1px]",
                "disabled:cursor-not-allowed disabled:opacity-60"
            )}
        >
            {children}
        </button>
    );
}

function GhostButton({
    onClick,
    disabled,
    children,
}: {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold",
                "border-[#CDEFE6] bg-white text-[#1F3D3A] shadow-sm transition",
                "hover:bg-[#E9F7F3] hover:border-[#BEE7DC]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "active:translate-y-[1px]",
                "disabled:cursor-not-allowed disabled:opacity-60"
            )}
        >
            {children}
        </button>
    );
}

function PrimaryButton({
    onClick,
    disabled,
    children,
}: {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
                "bg-[#6FCFBA] text-[#1F3D3A]",
                "shadow-[0_10px_22px_rgba(111,207,186,0.28)]",
                "transition",
                "hover:brightness-[0.98] hover:shadow-[0_12px_26px_rgba(111,207,186,0.34)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "active:translate-y-[1px]",
                "disabled:cursor-not-allowed disabled:opacity-60"
            )}
        >
            {children}
        </button>
    );
}

function Input({
    value,
    onChange,
    placeholder,
    leftIcon,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    leftIcon?: React.ReactNode;
}) {
    return (
        <div className="relative">
            {leftIcon ? (
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8F93]">
                    {leftIcon}
                </div>
            ) : null}
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cx(
                    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm",
                    leftIcon ? "pl-10.5" : "",
                    "placeholder:text-[#8A8F93]",
                    "outline-none transition",
                    "border-[#DDEBE6] hover:border-[#BEE7DC]",
                    "focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25"
                )}
            />
        </div>
    );
}

function Select({
    value,
    onChange,
    children,
}: {
    value: string;
    onChange: (v: string) => void;
    children: React.ReactNode;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cx(
                "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm",
                "outline-none transition",
                "border-[#DDEBE6] hover:border-[#BEE7DC]",
                "focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25"
            )}
        >
            {children}
        </select>
    );
}

function SkeletonRow() {
    return (
        <tr className="border-b border-[#EEF4F2] last:border-b-0">
            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="h-3.5 w-56 rounded bg-[#F2F4F5] animate-pulse" />
                    <div className="h-3 w-[28rem] rounded bg-[#F2F4F5] animate-pulse" />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="h-7 w-20 rounded-full bg-[#F2F4F5] animate-pulse" />
            </td>
            <td className="px-6 py-4">
                <div className="h-7 w-28 rounded-full bg-[#F2F4F5] animate-pulse" />
            </td>
            <td className="px-6 py-4">
                <div className="h-3.5 w-32 rounded bg-[#F2F4F5] animate-pulse" />
            </td>
            <td className="px-6 py-4">
                <div className="h-3.5 w-36 rounded bg-[#F2F4F5] animate-pulse" />
            </td>
            <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                    <div className="h-10 w-10 rounded-xl bg-[#F2F4F5] animate-pulse" />
                    <div className="h-10 w-10 rounded-xl bg-[#F2F4F5] animate-pulse" />
                    <div className="h-10 w-10 rounded-xl bg-[#F2F4F5] animate-pulse" />
                </div>
            </td>
        </tr>
    );
}

export default function ProyectosPage() {
    const router = useRouter();

    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [q, setQ] = useState("");
    const [status, setStatus] = useState<"ALL" | "PENDIENTE" | "APROBADO">("ALL");
    const [tipo, setTipo] = useState<"ALL" | "WEB" | "APP">("ALL");

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await proyectoApi.list();
            setProyectos(res.proyectos ?? []);
        } catch (e: any) {
            setError(e?.message ?? "Error cargando proyectos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();

        return proyectos
            .filter((p) => {
                if (status === "APROBADO" && !p.aprobado) return false;
                if (status === "PENDIENTE" && p.aprobado) return false;
                if (tipo !== "ALL" && p.tipo !== tipo) return false;

                if (!query) return true;
                return (
                    p.nombre.toLowerCase().includes(query) ||
                    (p.descripcion ?? "").toLowerCase().includes(query) ||
                    p.id.toLowerCase().includes(query)
                );
            })
            .sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime());
    }, [proyectos, q, status, tipo]);

    const onApprove = async (id: string) => {
        try {
            setBusyId(id);
            await proyectoApi.approve(id);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Error aprobando proyecto");
        } finally {
            setBusyId(null);
        }
    };

    const onDelete = async (id: string) => {
        const ok = window.confirm("¿Eliminar este proyecto? (Solo se puede si no tiene facturas asociadas.)");
        if (!ok) return;

        try {
            setBusyId(id);
            await proyectoApi.delete(id);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Error eliminando proyecto");
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-5">
            <div
                className={cx(
                    "rounded-3xl border bg-white shadow-sm",
                    "border-[#DDEBE6]",
                    "p-5 md:p-6",
                    "bg-[radial-gradient(1000px_420px_at_15%_-10%,rgba(111,207,186,0.26),transparent_55%),radial-gradient(900px_380px_at_90%_0%,rgba(233,247,243,0.95),transparent_60%)]"
                )}
            >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                <Filter className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-2xl font-semibold tracking-tight text-[#2B2E31]">Proyectos</h1>
                                <p className="mt-1 text-sm text-[#8A8F93]">Listado y acciones de administración.</p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <Badge tone="neutral">
                                Mostrando <span className="font-semibold text-[#2B2E31]">{filtered.length}</span>
                                <span className="text-[#8A8F93]">/</span>
                                <span className="font-semibold text-[#2B2E31]">{proyectos.length}</span>
                            </Badge>
                            {status !== "ALL" ? <Badge tone="brand">Estado: {status}</Badge> : null}
                            {tipo !== "ALL" ? <Badge tone="brand">Tipo: {tipo}</Badge> : null}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <GhostButton onClick={() => load()} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Refrescar
                        </GhostButton>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="rounded-3xl border border-[#DDEBE6] bg-white p-4 shadow-sm md:p-5">
                <div className="grid gap-3 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-6">
                        <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Buscar</label>
                        <Input value={q} onChange={setQ} placeholder="Nombre, descripción o id…" leftIcon={<Search className="h-4 w-4" />} />
                    </div>

                    <div className="md:col-span-3">
                        <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Estado</label>
                        <Select value={status} onChange={(v) => setStatus(v as any)}>
                            <option value="ALL">Todos</option>
                            <option value="PENDIENTE">Pendientes</option>
                            <option value="APROBADO">Aprobados</option>
                        </Select>
                    </div>

                    <div className="md:col-span-3">
                        <label className="mb-1.5 block text-xs font-semibold text-[#1F3D3A]">Tipo</label>
                        <Select value={tipo} onChange={(v) => setTipo(v as any)}>
                            <option value="ALL">Todos</option>
                            <option value="WEB">WEB</option>
                            <option value="APP">APP</option>
                        </Select>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-[#8A8F93]">
                        {q.trim() || status !== "ALL" || tipo !== "ALL" ? (
                            <span>Filtros activos.</span>
                        ) : (
                            <span>Sin filtros adicionales.</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <GhostButton
                            onClick={() => {
                                setQ("");
                                setStatus("ALL");
                                setTipo("ALL");
                            }}
                            disabled={loading}
                        >
                            Limpiar
                        </GhostButton>
                        <PrimaryButton onClick={() => load()} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Aplicar
                        </PrimaryButton>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-3xl border border-[#F3C6CE] bg-[#FFECEF] p-4 text-sm text-[#7B1E2B] shadow-sm">
                    <strong>Error:</strong> {error}
                </div>
            ) : null}

            {/* Table */}
            <div className="rounded-3xl border border-[#DDEBE6] bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-[#DDEBE6] bg-white px-4 py-3 md:px-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#6FCFBA]" />
                        <div className="text-sm font-semibold text-[#2B2E31]">Listado</div>
                        <div className="text-xs text-[#8A8F93]">Proyectos</div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[#E9F7F3]/55 text-left text-[11px] uppercase tracking-wide text-[#1F3D3A]">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Nombre</th>
                                <th className="px-6 py-3 font-semibold">Tipo</th>
                                <th className="px-6 py-3 font-semibold">Estado</th>
                                <th className="px-6 py-3 font-semibold">Empresa</th>
                                <th className="px-6 py-3 font-semibold">Creado</th>
                                <th className="px-6 py-3 text-right font-semibold">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#EEF4F2]">
                            {loading ? (
                                <>
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                </>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-14">
                                        <div className="mx-auto max-w-md text-center">
                                            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A]">
                                                <Search className="h-5 w-5" />
                                            </div>
                                            <div className="mt-4 text-sm font-semibold text-[#2B2E31]">No hay resultados</div>
                                            <div className="mt-1 text-sm text-[#8A8F93]">Prueba con otros filtros o una búsqueda distinta.</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p) => {
                                    const isBusy = busyId === p.id;
                                    const estado = p.aprobado ? "Aprobado" : "Pendiente";

                                    return (
                                        <tr key={p.id} className="group transition-colors hover:bg-[#E9F7F3]/45">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-[#2B2E31]">{p.nombre}</div>
                                                <div className="mt-0.5 text-xs text-[#8A8F93]">
                                                    {p.descripcion ? p.descripcion : "Sin descripción"} · <span className="font-mono">ID: {p.id}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <Badge tone="brand">{p.tipo}</Badge>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <Badge tone={p.aprobado ? "success" : "warning"}>{estado}</Badge>
                                                    <div className="text-xs text-[#8A8F93]">
                                                        {p.aprobadoEn ? `Aprobado: ${formatDate(p.aprobadoEn)}` : "—"}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-[#2B2E31]">{p.empresaId}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-[#2B2E31]">{formatDate(p.creadoEn)}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <IconButton
                                                        onClick={() => router.push(`/superadmin/proyectos/${p.id}`)}
                                                        title="Ver"
                                                        disabled={isBusy}
                                                        variant="brand"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </IconButton>

                                                    <IconButton
                                                        onClick={() => onApprove(p.id)}
                                                        title={p.aprobado ? "Ya está aprobado" : "Aprobar proyecto"}
                                                        disabled={p.aprobado || isBusy}
                                                        variant="brand"
                                                    >
                                                        {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                    </IconButton>

                                                    <IconButton
                                                        onClick={() => onDelete(p.id)}
                                                        title="Eliminar proyecto"
                                                        disabled={isBusy}
                                                        variant="danger"
                                                    >
                                                        {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    </IconButton>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-2 border-t border-[#DDEBE6] bg-[#E9F7F3]/25 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                    <div className="text-xs text-[#8A8F93]">
                        Mostrando <span className="font-semibold text-[#2B2E31]">{filtered.length}</span> de{" "}
                        <span className="font-semibold text-[#2B2E31]">{proyectos.length}</span>.
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge tone="neutral">Ordenado por creación</Badge>
                        <span className="inline-flex items-center gap-1 text-xs text-[#8A8F93]">
                            <ChevronRight className="h-3.5 w-3.5" />
                            Más reciente primero
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
