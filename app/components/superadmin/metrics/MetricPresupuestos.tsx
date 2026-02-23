"use client";

import { Presupuesto, presupuestoApi } from "@/app/api/presupuesto/presupuesto.api";
import { Proyecto, proyectoApi } from "@/app/api/proyectos/proyecto.api";
import { useEffect, useMemo, useState } from "react";
import {
    Area,
    AreaChart,
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
    Receipt,
    Wallet,
} from "lucide-react";

/**
 * Paleta + estilo (igual que MetricProyectos)
 */
const COLORS = {
    aceptado: "#06b6d4", // cyan-500
    pendiente: "#94a3b8", // slate-400
    sin: "#6366f1", // indigo-500
    total: "#6366f1", // indigo-500
    pagado: "#06b6d4", // cyan-500
    porPagar: "#f43f5e", // rose-500
    grid: "#e2e8f0", // slate-200
};

function formatDate(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}

// Decimal string → number
function toNumber(decimalStr: string | null | undefined) {
    if (!decimalStr) return 0;
    const n = Number(decimalStr);
    return Number.isFinite(n) ? n : 0;
}

function formatMoney(amount: number, currency: string) {
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
            amount
        );
    } catch {
        return `${amount.toFixed(2)} ${currency}`;
    }
}

type PresupuestoItem = {
    proyectoId: string;
    proyectoNombre: string;
    presupuesto: Presupuesto | null;
};

/**
 * UI (mismo look&feel que MetricProyectos)
 */
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
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {title}
                    </div>
                    <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                        {value}
                    </div>
                    {subtitle ? <div className="mt-1 text-xs text-slate-500">{subtitle}</div> : null}
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
                    {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
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

function NiceTooltipMoney({
    active,
    payload,
    label,
    currency,
}: {
    active?: boolean;
    payload?: any[];
    label?: string;
    currency?: string;
}) {
    if (!active || !payload?.length) return null;

    return (
        <div
            style={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            className="bg-white px-3 py-2 text-xs"
        >
            {label ? <div className="mb-1 font-semibold text-slate-900">{label}</div> : null}
            <div className="grid gap-1">
                {payload.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-6">
                        <span className="text-slate-600">{p.name}</span>
                        <span className="font-semibold text-slate-900">
                            {typeof p.value === "number"
                                ? currency
                                    ? formatMoney(Number(p.value) || 0, currency)
                                    : p.value.toLocaleString()
                                : String(p.value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function MetricPresupuestos() {
    const [items, setItems] = useState<PresupuestoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const proyectosRes = await proyectoApi.list();
                const proyectos: Proyecto[] = proyectosRes.proyectos ?? [];

                const results = await Promise.allSettled(
                    proyectos.map(async (p) => {
                        const res = await presupuestoApi.get(p.id);
                        return {
                            proyectoId: p.id,
                            proyectoNombre: p.nombre,
                            presupuesto: res.presupuesto ?? null,
                        } satisfies PresupuestoItem;
                    })
                );

                if (!alive) return;

                const ok: PresupuestoItem[] = results
                    .filter(
                        (r): r is PromiseFulfilledResult<PresupuestoItem> =>
                            r.status === "fulfilled"
                    )
                    .map((r) => r.value);

                setItems(ok);
            } catch (e: any) {
                if (!alive) return;
                setError(e?.message ?? "Error cargando presupuestos");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    const computed = useMemo(() => {
        const conPresupuesto = items.filter((i) => i.presupuesto !== null);
        const sinPresupuesto = items.filter((i) => i.presupuesto === null);

        const aceptados = conPresupuesto.filter((i) => i.presupuesto!.aceptado);
        const pendientesAceptar = conPresupuesto.filter((i) => !i.presupuesto!.aceptado);

        // Sums by currency
        const sumsByCurrency = new Map<
            string,
            {
                total: number;
                pagado: number;
                pendiente: number;
                count: number;
                aceptados: number;
                noAceptados: number;
            }
        >();

        for (const i of conPresupuesto) {
            const p = i.presupuesto!;
            const currency = p.moneda || "EUR";
            const total = toNumber(p.total);
            const pagado = toNumber(p.pagado);
            const pendiente = Math.max(0, total - pagado);

            const entry =
                sumsByCurrency.get(currency) ?? {
                    total: 0,
                    pagado: 0,
                    pendiente: 0,
                    count: 0,
                    aceptados: 0,
                    noAceptados: 0,
                };

            entry.total += total;
            entry.pagado += pagado;
            entry.pendiente += pendiente;
            entry.count += 1;
            if (p.aceptado) entry.aceptados += 1;
            else entry.noAceptados += 1;

            sumsByCurrency.set(currency, entry);
        }

        const monedas = Array.from(sumsByCurrency.entries()).sort((a, b) =>
            a[0].localeCompare(b[0])
        );

        const recientes = [...conPresupuesto]
            .sort(
                (a, b) =>
                    new Date(b.presupuesto!.creadoEn).getTime() -
                    new Date(a.presupuesto!.creadoEn).getTime()
            )
            .slice(0, 12);

        const estadoPie = [
            { name: "Aceptados", value: aceptados.length, color: COLORS.aceptado },
            { name: "Pendientes", value: pendientesAceptar.length, color: COLORS.pendiente },
            { name: "Sin presupuesto", value: sinPresupuesto.length, color: COLORS.sin },
        ];

        const monedaBars = monedas.map(([currency, v]) => ({
            currency,
            total: v.total,
            pagado: v.pagado,
            pendiente: v.pendiente,
            count: v.count,
            aceptados: v.aceptados,
            noAceptados: v.noAceptados,
        }));

        const timeSeries = [...recientes]
            .map((i) => {
                const p = i.presupuesto!;
                const created = new Date(p.creadoEn);
                return {
                    t: created.getTime(),
                    label: created.toLocaleDateString(undefined, { month: "short", day: "2-digit" }),
                    total: toNumber(p.total),
                    pagado: toNumber(p.pagado),
                    moneda: p.moneda || "EUR",
                };
            })
            .sort((a, b) => a.t - b.t);

        const mixedCurrencies = new Set(timeSeries.map((x) => x.moneda)).size > 1;

        const latest = conPresupuesto.length
            ? [...conPresupuesto].sort(
                (a, b) =>
                    new Date(b.presupuesto!.creadoEn).getTime() -
                    new Date(a.presupuesto!.creadoEn).getTime()
            )[0]
            : null;

        return {
            totalProyectos: items.length,
            conPresupuesto: conPresupuesto.length,
            sinPresupuesto: sinPresupuesto.length,
            aceptados: aceptados.length,
            pendientesAceptar: pendientesAceptar.length,
            estadoPie,
            monedaBars,
            timeSeries,
            mixedCurrencies,
            latest,
        };
    }, [items]);

    if (loading)
        return (
            <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <Activity className="mx-auto h-8 w-8 animate-spin text-cyan-500" />
                <p className="mt-4 text-sm text-slate-500">Sincronizando métricas...</p>
            </section>
        );

    if (error)
        return (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex items-start gap-3">
                    <Activity className="h-5 w-5" />
                    <div>
                        <div className="font-bold">Error de conexión</div>
                        <div>{error}</div>
                    </div>
                </div>
            </section>
        );

    return (
        <section className="grid gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Panel de Control</h2>
                <p className="text-sm text-slate-500">
                    Visualización de estado y montos agregados (por moneda).
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard
                    title="Proyectos analizados"
                    value={computed.totalProyectos}
                    icon={<FolderKanban className="h-5 w-5" />}
                />
                <StatCard
                    title="Con presupuesto"
                    value={computed.conPresupuesto}
                    icon={<Receipt className="h-5 w-5" />}
                />
                <StatCard
                    title="Sin presupuesto"
                    value={computed.sinPresupuesto}
                    subtitle="Aún no creado"
                    icon={<Clock3 className="h-5 w-5" />}
                />
                <StatCard
                    title="Aceptados"
                    value={computed.aceptados}
                    subtitle="Listos para ejecución"
                    icon={<BadgeCheck className="h-5 w-5" />}
                />
                <StatCard
                    title="Pendientes"
                    value={computed.pendientesAceptar}
                    subtitle="En revisión"
                    icon={<Activity className="h-5 w-5" />}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Pie */}
                <Panel
                    title="Estado de presupuestos"
                    subtitle="Aceptados vs Pendientes vs Sin presupuesto"
                    icon={<Activity className="h-4 w-4" />}
                >
                    {computed.totalProyectos === 0 ? (
                        <EmptyState text="Sin datos" />
                    ) : (
                        <>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: "12px",
                                                border: "none",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                            }}
                                        />
                                        <Pie
                                            data={computed.estadoPie}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            cornerRadius={6}
                                        >
                                            {computed.estadoPie.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <ChartHint>Distribución general</ChartHint>
                        </>
                    )}
                </Panel>

                {/* Bars */}
                <Panel
                    title="Montos por moneda"
                    subtitle="Total vs Pagado vs Pendiente"
                    icon={<Wallet className="h-4 w-4" />}
                >
                    {computed.monedaBars.length === 0 ? (
                        <EmptyState text="Sin presupuestos" />
                    ) : (
                        <>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={computed.monedaBars} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                                        <XAxis
                                            dataKey="currency"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11, fill: "#64748b" }}
                                            dy={10}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11, fill: "#64748b" }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: "#f1f5f9" }}
                                            content={({ active, payload, label }: any) => (
                                                <NiceTooltipMoney active={active} payload={payload} label={label} currency={String(label ?? "EUR")} />
                                            )}
                                        />
                                        <Bar dataKey="total" name="Total" fill={COLORS.total} radius={[6, 6, 0, 0]} barSize={18} />
                                        <Bar dataKey="pagado" name="Pagado" fill={COLORS.pagado} radius={[6, 6, 0, 0]} barSize={18} />
                                        <Bar dataKey="pendiente" name="Pendiente" fill={COLORS.porPagar} radius={[6, 6, 0, 0]} barSize={18} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <ChartHint>Comparación por moneda</ChartHint>
                        </>
                    )}
                </Panel>

                {/* Area */}
                <Panel
                    title="Tendencia reciente"
                    subtitle="Total y pagado en los últimos presupuestos"
                    icon={<Receipt className="h-4 w-4" />}
                >
                    {computed.timeSeries.length === 0 ? (
                        <EmptyState text="Sin actividad" />
                    ) : (
                        <>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={computed.timeSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                                        <XAxis
                                            dataKey="label"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11, fill: "#64748b" }}
                                            dy={10}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11, fill: "#64748b" }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: "#f1f5f9" }}
                                            content={({ active, payload, label }: any) => {
                                                const moneda = payload?.[0]?.payload?.moneda ?? "EUR";
                                                return (
                                                    <NiceTooltipMoney
                                                        active={active}
                                                        payload={payload}
                                                        label={label}
                                                        currency={String(moneda)}
                                                    />
                                                );
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            name="Total"
                                            stroke="rgba(99,102,241,0.85)"
                                            fill="rgba(99,102,241,0.18)"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="pagado"
                                            name="Pagado"
                                            stroke="rgba(6,182,212,0.85)"
                                            fill="rgba(6,182,212,0.18)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <ChartHint>
                                {computed.mixedCurrencies
                                    ? "Nota: hay varias monedas; la tendencia es orientativa"
                                    : "Ordenado por fecha de creación"}
                            </ChartHint>
                        </>
                    )}
                </Panel>
            </div>

            {/* Footer dark (igual que MetricProyectos) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/10 text-cyan-400">
                            <Receipt className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                                Último presupuesto
                            </div>
                            <div className="text-lg font-bold">
                                {computed.latest ? computed.latest.proyectoNombre : "No hay presupuestos"}
                            </div>
                            <div className="mt-1 text-xs text-slate-400">
                                {computed.latest?.presupuesto?.creadoEn
                                    ? formatDate(computed.latest.presupuesto.creadoEn)
                                    : "—"}
                            </div>
                        </div>
                    </div>

                    {computed.latest?.presupuesto ? (
                        <div className="flex gap-3">
                            <div className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium border border-white/10">
                                {computed.latest.presupuesto.moneda || "EUR"}
                            </div>
                            <div
                                className={`rounded-full px-4 py-1.5 text-xs font-bold ${computed.latest.presupuesto.aceptado
                                    ? "bg-cyan-500/20 text-cyan-400"
                                    : "bg-amber-500/20 text-amber-400"
                                    }`}
                            >
                                {computed.latest.presupuesto.aceptado ? "ACEPTADO" : "PENDIENTE"}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
