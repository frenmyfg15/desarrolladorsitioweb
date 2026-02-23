"use client";

import { proyectoApi } from "@/app/api/proyectos/proyecto.api";
import { Proyecto } from "@/app/api/proyectos/proyecto.types";
import { useEffect, useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    Activity,
    BadgeCheck,
    Clock3,
    FolderKanban,
    Globe,
    Smartphone,
} from "lucide-react";

type Metrics = {
    total: number;
    aprobados: number;
    pendientes: number;
    web: number;
    app: number;
};

const COLORS = {
    aprobado: "#06b6d4", // cyan-500
    pendiente: "#94a3b8", // slate-400
    web: "#6366f1",      // indigo-500
    app: "#f43f5e",      // rose-500
    grid: "#e2e8f0",     // slate-200
};

function formatDate(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}

function StatCard({
    title,
    value,
    subtitle,
    icon,
}: {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</div>
                    <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                        {value}
                    </div>
                    {subtitle ? (
                        <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
                    ) : null}
                </div>

                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 ring-1 ring-cyan-100 text-cyan-700">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function Panel({
    title,
    subtitle,
    icon,
    children,
}: {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        {icon ? (
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 ring-1 ring-cyan-100 text-cyan-700">
                                {icon}
                            </span>
                        ) : null}
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
                    </div>
                    {subtitle ? (
                        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                    ) : null}
                </div>
            </div>

            {children}
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm text-slate-600">
            {text}
        </div>
    );
}

function ChartHint({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-4 flex items-center justify-center gap-4 flex-wrap border-t border-slate-50 pt-4">
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                {children}
            </div>
        </div>
    );
}

export function MetricProyectos() {
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await proyectoApi.list();
                if (!alive) return;
                setProyectos(res.proyectos ?? []);
            } catch (e: any) {
                if (!alive) return;
                setError(e?.message ?? "Error cargando proyectos");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    const metrics: Metrics = useMemo(() => {
        const total = proyectos.length;
        const aprobados = proyectos.filter((p) => p.aprobado).length;
        const pendientes = total - aprobados;
        const web = proyectos.filter((p) => p.tipo === "WEB").length;
        const app = proyectos.filter((p) => p.tipo === "APP").length;
        return { total, aprobados, pendientes, web, app };
    }, [proyectos]);

    const recientes = useMemo(() => {
        return [...proyectos]
            .sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime())
            .slice(0, 12);
    }, [proyectos]);

    const estadoPie = useMemo(() => [
        { name: "Aprobados", value: metrics.aprobados, color: COLORS.aprobado },
        { name: "Pendientes", value: metrics.pendientes, color: COLORS.pendiente },
    ], [metrics]);

    const tipoPie = useMemo(() => [
        { name: "WEB", value: metrics.web, color: COLORS.web },
        { name: "APP", value: metrics.app, color: COLORS.app },
    ], [metrics]);

    const recientesBars = useMemo(() => {
        const grouped = new Map<string, number>();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
        }).reverse();

        last7Days.forEach(day => grouped.set(day, 0));

        for (const p of proyectos) {
            const d = new Date(p.creadoEn);
            const key = d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
            if (grouped.has(key)) {
                grouped.set(key, (grouped.get(key) ?? 0) + 1);
            }
        }
        return Array.from(grouped.entries()).map(([day, count]) => ({ day, count }));
    }, [proyectos]);

    const latest = proyectos.length > 0
        ? [...proyectos].sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime())[0]
        : null;

    if (loading) return (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <Activity className="mx-auto h-8 w-8 animate-spin text-cyan-500" />
            <p className="mt-4 text-sm text-slate-500">Sincronizando métricas...</p>
        </section>
    );

    if (error) return (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-start gap-3">
                <Activity className="h-5 w-5" />
                <div><div className="font-bold">Error de conexión</div><div>{error}</div></div>
            </div>
        </section>
    );

    return (
        <section className="grid gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Panel de Control</h2>
                <p className="text-sm text-slate-500">Visualización de rendimiento y estados de desarrollo.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard title="Total Proyectos" value={metrics.total} icon={<FolderKanban className="h-5 w-5" />} />
                <StatCard title="Aprobados" value={metrics.aprobados} subtitle="En producción" icon={<BadgeCheck className="h-5 w-5" />} />
                <StatCard title="Pendientes" value={metrics.pendientes} subtitle="En revisión" icon={<Clock3 className="h-5 w-5" />} />
                <StatCard title="Ecosistema Web" value={metrics.web} icon={<Globe className="h-5 w-5" />} />
                <StatCard title="Ecosistema App" value={metrics.app} icon={<Smartphone className="h-5 w-5" />} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Panel title="Estado de Proyectos" subtitle="Ratio de aprobación" icon={<Activity className="h-4 w-4" />}>
                    {metrics.total === 0 ? <EmptyState text="Sin datos" /> : (
                        <>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Pie
                                            data={estadoPie}
                                            dataKey="value"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            cornerRadius={6}
                                        >
                                            {estadoPie.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <ChartHint>Aprobados vs Pendientes</ChartHint>
                        </>
                    )}
                </Panel>

                <Panel title="Distribución de Stack" subtitle="Plataformas objetivo" icon={<Globe className="h-4 w-4" />}>
                    {metrics.total === 0 ? <EmptyState text="Sin datos" /> : (
                        <>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Pie
                                            data={tipoPie}
                                            dataKey="value"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            cornerRadius={6}
                                        >
                                            {tipoPie.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <ChartHint>WEB vs APP Móvil</ChartHint>
                        </>
                    )}
                </Panel>

                <Panel title="Actividad Semanal" subtitle="Volumen de creación" icon={<Activity className="h-4 w-4" />}>
                    {recientesBars.length === 0 ? <EmptyState text="Sin actividad" /> : (
                        <>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={recientesBars} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                                        <XAxis
                                            dataKey="day"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11, fill: '#64748b' }}
                                            dy={10}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11, fill: '#64748b' }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f1f5f9' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar
                                            dataKey="count"
                                            fill={COLORS.aprobado}
                                            radius={[6, 6, 0, 0]}
                                            barSize={32}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <ChartHint>Últimos 7 días activos</ChartHint>
                        </>
                    )}
                </Panel>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/10 text-cyan-400">
                            <FolderKanban className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">Última incorporación</div>
                            <div className="text-lg font-bold">
                                {latest ? latest.nombre : "No hay proyectos"}
                            </div>
                        </div>
                    </div>
                    {latest && (
                        <div className="flex gap-3">
                            <div className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium border border-white/10">
                                {latest.tipo}
                            </div>
                            <div className={`rounded-full px-4 py-1.5 text-xs font-bold ${latest.aprobado ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {latest.aprobado ? "ACTIVO" : "PENDIENTE"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}