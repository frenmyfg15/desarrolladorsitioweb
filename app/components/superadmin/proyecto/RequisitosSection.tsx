"use client";

import { useEffect, useMemo, useState } from "react";
import { requisitosApi, RequisitosInput, RequisitosProyecto } from "@/app/api/requisitos/requisitos.api";
import {
    Activity,
    BadgeCheck,
    Check,
    FileText,
    Globe,
    Loader2,
    Lock,
    PenTool,
    Pencil,
    Save,
    Search,
    Settings2,
    ShieldCheck,
    Wrench,
    X,
    Plus,
} from "lucide-react";

function cx(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(" ");
}

function Badge({
    children,
    tone = "neutral",
}: {
    children: React.ReactNode;
    tone?: "neutral" | "brand" | "warning" | "danger";
}) {
    const tones: Record<string, string> = {
        neutral: "border-[#DDEBE6] bg-white text-[#2B2E31] ring-1 ring-inset ring-[#DDEBE6]",
        brand: "border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] ring-1 ring-inset ring-[#CDEFE6]",
        warning: "border-[#EBD9B6] bg-[#FFF6DF] text-[#6A4A12] ring-1 ring-inset ring-[#EBD9B6]",
        danger: "border-[#F3C6CE] bg-[#FFECEF] text-[#7B1E2B] ring-1 ring-inset ring-[#F3C6CE]",
    };

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
                tones[tone]
            )}
        >
            {children}
        </span>
    );
}

function Pill({
    children,
    tone = "neutral",
}: {
    children: React.ReactNode;
    tone?: "neutral" | "brand" | "warning";
}) {
    const tones: Record<string, string> = {
        neutral: "border-[#DDEBE6] bg-white text-[#2B2E31]",
        brand: "border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A]",
        warning: "border-[#EBD9B6] bg-[#FFF6DF] text-[#6A4A12]",
    };

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                tones[tone]
            )}
        >
            {children}
        </span>
    );
}

function PrimaryButton({
    children,
    disabled,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
                "bg-[#6FCFBA] text-[#1F3D3A]",
                "shadow-[0_10px_22px_rgba(111,207,186,0.28)] transition",
                "hover:brightness-[0.98] hover:shadow-[0_12px_26px_rgba(111,207,186,0.34)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "active:translate-y-[1px]",
                disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
            )}
        >
            {children}
        </button>
    );
}

function GhostButton({
    children,
    disabled,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold",
                "border-[#CDEFE6] bg-white text-[#1F3D3A] shadow-sm transition",
                "hover:bg-[#E9F7F3] hover:border-[#BEE7DC]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "active:translate-y-[1px]",
                disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
            )}
        >
            {children}
        </button>
    );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cx(
                "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm",
                "border-[#DDEBE6] placeholder:text-[#8A8F93] outline-none transition",
                "hover:border-[#BEE7DC] focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25",
                props.disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
            )}
        />
    );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={cx(
                "w-full min-h-[112px] rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2B2E31] shadow-sm",
                "border-[#DDEBE6] placeholder:text-[#8A8F93] outline-none transition",
                "hover:border-[#BEE7DC] focus:border-[#6FCFBA] focus:ring-2 focus:ring-[#6FCFBA]/25",
                props.disabled ? "cursor-not-allowed opacity-60" : "",
                props.className ?? ""
            )}
        />
    );
}

function ModalShell({
    open,
    title,
    description,
    onClose,
    children,
    footer,
}: {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" onMouseDown={onClose} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-4xl rounded-3xl border border-[#DDEBE6] bg-white shadow-2xl"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between gap-3 border-b border-[#DDEBE6] px-5 py-4">
                        <div className="min-w-0">
                            <div className="text-base font-semibold text-[#2B2E31]">{title}</div>
                            {description ? <div className="mt-1 text-sm text-[#8A8F93]">{description}</div> : null}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className={cx(
                                "inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-[#2B2E31] shadow-sm transition",
                                "border-[#DDEBE6] hover:bg-[#F2F4F5]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                                "active:translate-y-[1px]"
                            )}
                            title="Cerrar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="px-5 py-4">{children}</div>

                    {footer ? (
                        <div className="flex items-center justify-end gap-2 border-t border-[#DDEBE6] px-5 py-4">
                            {footer}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function Panel({
    title,
    subtitle,
    icon,
    right,
    children,
}: {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-[#DDEBE6] bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        {icon ? (
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                {icon}
                            </span>
                        ) : null}
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold tracking-tight text-[#2B2E31]">{title}</h3>
                            {subtitle ? <p className="mt-1 text-sm text-[#8A8F93]">{subtitle}</p> : null}
                        </div>
                    </div>
                </div>
                {right ? <div className="shrink-0">{right}</div> : null}
            </div>

            {children}
        </div>
    );
}

function Toggle({
    label,
    description,
    checked,
    onChange,
    icon,
}: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    icon?: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cx(
                "w-full rounded-3xl border p-4 text-left transition",
                checked ? "border-[#BEE7DC] bg-[#E9F7F3]/55" : "border-[#DDEBE6] bg-white hover:bg-[#F2F4F5]/70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FCFBA]/35"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <span
                        className={cx(
                            "mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm",
                            checked ? "border-[#CDEFE6] bg-white text-[#1F3D3A]" : "border-[#DDEBE6] bg-white text-[#2B2E31]"
                        )}
                    >
                        {icon ?? <Settings2 className="h-5 w-5" />}
                    </span>

                    <div className="min-w-0">
                        <div className="font-semibold text-[#2B2E31]">{label}</div>
                        {description ? <div className="mt-1 text-xs text-[#8A8F93]">{description}</div> : null}
                    </div>
                </div>

                <span
                    className={cx(
                        "relative mt-1 inline-flex h-6 w-11 items-center rounded-full transition",
                        checked ? "bg-[#6FCFBA]" : "bg-[#DDEBE6]"
                    )}
                    aria-hidden="true"
                >
                    <span
                        className={cx(
                            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
                            checked ? "translate-x-5" : "translate-x-1"
                        )}
                    />
                </span>
            </div>
        </button>
    );
}

export function RequisitosSection({
    proyectoId,
    requisitos,
    hasPresupuesto,
    onUpdated,
}: {
    proyectoId: string;
    requisitos: RequisitosProyecto | null | undefined;
    hasPresupuesto: boolean;
    onUpdated: () => void;
}) {
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<RequisitosInput>(() => ({
        necesitaLogo: requisitos?.necesitaLogo ?? false,
        tieneManualMarca: requisitos?.tieneManualMarca ?? false,
        tieneDiseno: requisitos?.tieneDiseno ?? false,
        disenoPorNosotros: requisitos?.disenoPorNosotros ?? true,
        necesitaCopy: requisitos?.necesitaCopy ?? false,
        tieneDominio: requisitos?.tieneDominio ?? false,
        tieneHosting: requisitos?.tieneHosting ?? false,
        necesitaSeo: requisitos?.necesitaSeo ?? false,
        necesitaAnalitica: requisitos?.necesitaAnalitica ?? true,
        necesitaMantenimiento: requisitos?.necesitaMantenimiento ?? false,
        notas: requisitos?.notas ?? "",
        websReferencia: requisitos?.websReferencia ?? "",
    }));

    useEffect(() => {
        setForm({
            necesitaLogo: requisitos?.necesitaLogo ?? false,
            tieneManualMarca: requisitos?.tieneManualMarca ?? false,
            tieneDiseno: requisitos?.tieneDiseno ?? false,
            disenoPorNosotros: requisitos?.disenoPorNosotros ?? true,
            necesitaCopy: requisitos?.necesitaCopy ?? false,
            tieneDominio: requisitos?.tieneDominio ?? false,
            tieneHosting: requisitos?.tieneHosting ?? false,
            necesitaSeo: requisitos?.necesitaSeo ?? false,
            necesitaAnalitica: requisitos?.necesitaAnalitica ?? true,
            necesitaMantenimiento: requisitos?.necesitaMantenimiento ?? false,
            notas: requisitos?.notas ?? "",
            websReferencia: requisitos?.websReferencia ?? "",
        });
    }, [requisitos?.actualizadoEn]);

    const summary = useMemo(() => {
        const yes = (v?: boolean) => (v ? "Sí" : "No");
        const updated = requisitos?.actualizadoEn ? new Date(requisitos.actualizadoEn).toLocaleString() : "—";

        const chips = [
            { label: `Logo: ${yes(requisitos?.necesitaLogo)}`, tone: requisitos?.necesitaLogo ? "warning" : "neutral" },
            { label: `Diseño: ${yes(requisitos?.tieneDiseno)}`, tone: requisitos?.tieneDiseno ? "brand" : "neutral" },
            { label: `SEO: ${yes(requisitos?.necesitaSeo)}`, tone: requisitos?.necesitaSeo ? "brand" : "neutral" },
            { label: `Copy: ${yes(requisitos?.necesitaCopy)}`, tone: requisitos?.necesitaCopy ? "brand" : "neutral" },
        ] as Array<{ label: string; tone: "neutral" | "brand" | "warning" }>;

        const doneCount = [
            requisitos?.tieneManualMarca,
            requisitos?.tieneDiseno,
            requisitos?.tieneDominio,
            requisitos?.tieneHosting,
            requisitos?.necesitaAnalitica !== undefined ? !false : false,
        ].filter(Boolean).length;

        return { updated, chips, doneCount };
    }, [requisitos]);

    const submit = async () => {
        try {
            setSaving(true);
            setError(null);

            if (requisitos) await requisitosApi.update(proyectoId, form);
            else await requisitosApi.create(proyectoId, form);

            setEditing(false);
            onUpdated();
        } catch (e: any) {
            setError(e?.message ?? "Error guardando requisitos");
        } finally {
            setSaving(false);
        }
    };

    if (!editing) {
        return (
            <section className="grid gap-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-xl font-semibold tracking-tight text-[#2B2E31]">Requisitos</h2>
                        <p className="mt-1 text-sm text-[#8A8F93]">
                            Checklist de materiales y necesidades antes de arrancar el proyecto.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {hasPresupuesto ? (
                            <Pill tone="warning">
                                <Lock className="h-3.5 w-3.5" />
                                Bloqueado por presupuesto
                            </Pill>
                        ) : (
                            <Pill tone="brand">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Editable
                            </Pill>
                        )}

                        <PrimaryButton
                            onClick={() => setEditing(true)}
                            disabled={hasPresupuesto}
                            title={hasPresupuesto ? "No se pueden editar requisitos si hay presupuesto" : ""}
                        >
                            {requisitos ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            {requisitos ? "Editar" : "Crear"}
                        </PrimaryButton>
                    </div>
                </div>

                {requisitos ? (
                    <Panel
                        title="Resumen"
                        subtitle="Vista rápida de lo principal."
                        icon={<FileText className="h-5 w-5" />}
                        right={
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge tone="neutral">
                                    Actualizado: <span className="font-semibold text-[#2B2E31]">{summary.updated}</span>
                                </Badge>
                            </div>
                        }
                    >
                        <div className="flex flex-wrap gap-2">
                            {summary.chips.map((c, idx) => (
                                <Badge key={idx} tone={c.tone}>
                                    {c.label}
                                </Badge>
                            ))}
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/25 p-5">
                                <div className="flex items-center gap-2 text-sm font-semibold text-[#2B2E31]">
                                    <PenTool className="h-4 w-4 text-[#1F3D3A]" />
                                    Notas
                                </div>
                                <div className="mt-2 text-sm text-[#8A8F93] whitespace-pre-wrap">
                                    {requisitos.notas?.trim() ? requisitos.notas : "—"}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/25 p-5">
                                <div className="flex items-center gap-2 text-sm font-semibold text-[#2B2E31]">
                                    <Globe className="h-4 w-4 text-[#1F3D3A]" />
                                    Webs de referencia
                                </div>
                                <div className="mt-2 text-sm text-[#8A8F93] whitespace-pre-wrap">
                                    {requisitos.websReferencia?.trim() ? requisitos.websReferencia : "—"}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-3xl border border-[#DDEBE6] bg-white p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                        <Search className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Estado de preparación</div>
                                        <div className="text-sm font-semibold text-[#2B2E31]">Requisitos definidos</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Badge tone="brand">REQUISITOS</Badge>
                                    <Badge tone="neutral">Proyecto</Badge>
                                </div>
                            </div>
                        </div>
                    </Panel>
                ) : (
                    <Panel
                        title="Sin requisitos"
                        subtitle="Aún no se han definido requisitos para este proyecto."
                        icon={<Activity className="h-5 w-5" />}
                        right={
                            hasPresupuesto ? (
                                <Badge tone="warning">
                                    <Lock className="h-3.5 w-3.5" />
                                    Bloqueado
                                </Badge>
                            ) : (
                                <Badge tone="brand">Listo para crear</Badge>
                            )
                        }
                    >
                        <div className="rounded-3xl border border-dashed border-[#DDEBE6] bg-[#F2F4F5] p-10 text-center">
                            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div className="text-sm font-semibold text-[#2B2E31]">No hay requisitos creados</div>
                            <div className="mt-1 text-sm text-[#8A8F93]">
                                {hasPresupuesto
                                    ? "Ya hay presupuesto, por eso no se pueden crear/editar requisitos."
                                    : "Crea los requisitos para empezar con claridad."}
                            </div>
                        </div>

                        <div className="mt-5 rounded-3xl border border-[#DDEBE6] bg-white p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                        <Search className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Estado de preparación</div>
                                        <div className="text-sm font-semibold text-[#2B2E31]">Pendiente de requisitos</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Badge tone="brand">REQUISITOS</Badge>
                                    <Badge tone="neutral">Proyecto</Badge>
                                </div>
                            </div>
                        </div>
                    </Panel>
                )}

                <ModalShell
                    open={editing}
                    onClose={() => {
                        if (saving) return;
                        setEditing(false);
                    }}
                    title={requisitos ? "Editar requisitos" : "Crear requisitos"}
                    description="Activa/desactiva necesidades y añade notas."
                    footer={
                        <>
                            <GhostButton onClick={() => setEditing(false)} disabled={saving}>
                                <X className="h-4 w-4" />
                                Cancelar
                            </GhostButton>
                            <PrimaryButton onClick={submit} disabled={saving}>
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {saving ? "Guardando…" : "Guardar"}
                            </PrimaryButton>
                        </>
                    }
                >
                    {error ? (
                        <div className="mb-4 rounded-3xl border border-[#F3C6CE] bg-[#FFECEF] p-4 text-sm text-[#7B1E2B]">
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#F3C6CE] bg-white text-[#7B1E2B] shadow-sm">
                                    <Activity className="h-5 w-5" />
                                </span>
                                <div className="min-w-0">
                                    <div className="font-semibold">Error</div>
                                    <div className="mt-1">{error}</div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div className="grid gap-4">
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                            <Toggle
                                label="Necesita logo"
                                description="Diseño o refinado de logotipo."
                                checked={!!form.necesitaLogo}
                                onChange={(v) => setForm({ ...form, necesitaLogo: v })}
                                icon={<PenTool className="h-5 w-5" />}
                            />
                            <Toggle
                                label="Tiene manual de marca"
                                description="Guía de tipografías, colores y uso."
                                checked={!!form.tieneManualMarca}
                                onChange={(v) => setForm({ ...form, tieneManualMarca: v })}
                                icon={<ShieldCheck className="h-5 w-5" />}
                            />
                            <Toggle
                                label="Tiene diseño"
                                description="Diseño UI ya definido (Figma, etc.)."
                                checked={!!form.tieneDiseno}
                                onChange={(v) => setForm({ ...form, tieneDiseno: v })}
                                icon={<PenTool className="h-5 w-5" />}
                            />
                            <Toggle
                                label="Diseño por nosotros"
                                description="Nos encargamos del diseño UI/UX."
                                checked={!!form.disenoPorNosotros}
                                onChange={(v) => setForm({ ...form, disenoPorNosotros: v })}
                                icon={<Settings2 className="h-5 w-5" />}
                            />
                            <Toggle
                                label="Necesita copy"
                                description="Redacción de contenidos."
                                checked={!!form.necesitaCopy}
                                onChange={(v) => setForm({ ...form, necesitaCopy: v })}
                                icon={<FileText className="h-5 w-5" />}
                            />
                            <Toggle
                                label="Tiene dominio"
                                description="Dominio comprado y disponible."
                                checked={!!form.tieneDominio}
                                onChange={(v) => setForm({ ...form, tieneDominio: v })}
                                icon={<Globe className="h-5 w-5" />}
                            />
                            <Toggle
                                label="Tiene hosting"
                                description="Alojamiento contratado/configurado."
                                checked={!!form.tieneHosting}
                                onChange={(v) => setForm({ ...form, tieneHosting: v })}
                                icon={<Globe className="h-5 w-5" />}
                            />
                            <Toggle
                                label="Necesita SEO"
                                description="Optimización on-page y técnica."
                                checked={!!form.necesitaSeo}
                                onChange={(v) => setForm({ ...form, necesitaSeo: v })}
                                icon={<Search className="h-5 w-5" />}
                            />
                            <Toggle
                                label="Necesita analítica"
                                description="GA4/Tag Manager/eventos."
                                checked={!!form.necesitaAnalitica}
                                onChange={(v) => setForm({ ...form, necesitaAnalitica: v })}
                                icon={<BadgeCheck className="h-5 w-5" />}
                            />
                            <Toggle
                                label="Necesita mantenimiento"
                                description="Soporte, actualizaciones y mejoras."
                                checked={!!form.necesitaMantenimiento}
                                onChange={(v) => setForm({ ...form, necesitaMantenimiento: v })}
                                icon={<Wrench className="h-5 w-5" />}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="grid gap-2">
                                <div className="text-xs font-semibold text-[#1F3D3A]">Notas</div>
                                <Textarea
                                    placeholder="Contexto, prioridades, accesos, etc."
                                    value={form.notas ?? ""}
                                    onChange={(e) => setForm({ ...form, notas: e.target.value })}
                                />
                            </label>

                            <label className="grid gap-2">
                                <div className="text-xs font-semibold text-[#1F3D3A]">Webs de referencia</div>
                                <Input
                                    placeholder="Ej: https://..., https://..."
                                    value={form.websReferencia ?? ""}
                                    onChange={(e) => setForm({ ...form, websReferencia: e.target.value })}
                                />
                                <div className="text-[11px] text-[#8A8F93]">
                                    Puedes pegar varias URLs separadas por comas o saltos de línea.
                                </div>
                            </label>
                        </div>

                        <div className="rounded-3xl border border-[#DDEBE6] bg-[#E9F7F3]/25 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#CDEFE6] bg-[#E9F7F3] text-[#1F3D3A] shadow-sm">
                                        <Check className="h-5 w-5" />
                                    </span>
                                    <div className="min-w-0">
                                        <div className="text-xs font-semibold uppercase tracking-wide text-[#8A8F93]">Guardado</div>
                                        <div className="text-sm font-semibold text-[#2B2E31]">Los cambios se aplican al proyecto</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge tone="brand">Seguro</Badge>
                                    <Badge tone="neutral">Requisitos</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalShell>
            </section>
        );
    }

    return null;
}
