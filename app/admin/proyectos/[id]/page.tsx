"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    User, FolderKanban, Layers, FileText, Receipt,
    ExternalLink, ChevronRight, Calendar, Package,
    Plus, Pencil, Trash2, X, AlertCircle,
} from "lucide-react";
import { getProjectById, type ProjectDetailDTO } from "@/app/api/projects.api";
import {
    createBudget, updateBudget, deleteBudget,
    type BudgetDTO, type BudgetStatus,
} from "@/app/api/budget.api";
import {
    createPhase, updatePhase, deletePhase,
    type PhaseWithProjectDTO, type PhaseStatus,
} from "@/app/api/phases.api";
import {
    createInvoice, updateInvoice, deleteInvoice,
    type InvoiceDTO, type InvoiceStatus,
} from "@/app/api/invoices.api";
import {
    createDelivery, updateDelivery, deleteDelivery,
    type DeliveryDTO, type DeliveryStatus,
} from "@/app/api/deliveries.api";

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(date: string | null | undefined) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

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
        ACTIVE: "bg-emerald-50 text-emerald-600",
        COMPLETED: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        IN_PROGRESS: "bg-blue-50 text-blue-500",
        PENDING: "bg-amber-50 text-amber-600",
        CANCELLED: "bg-red-50 text-red-500",
        CANCELED: "bg-red-50 text-red-500",
        INACTIVE: "bg-gray-100 text-gray-500",
        PAID: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        UNPAID: "bg-red-50 text-red-500",
        OVERDUE: "bg-red-50 text-red-500",
        DRAFT: "bg-gray-100 text-gray-500",
        SENT: "bg-blue-50 text-blue-500",
        ACCEPTED: "bg-emerald-50 text-emerald-600",
        REJECTED: "bg-red-50 text-red-500",
        EXPIRED: "bg-amber-50 text-amber-600",
        APPROVED: "bg-emerald-50 text-emerald-600",
        SUBMITTED: "bg-blue-50 text-blue-500",
        TODO: "bg-gray-100 text-gray-500",
        BLOCKED: "bg-orange-50 text-orange-500",
        DONE: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        ADMIN: "bg-[#36DBBA]/10 text-[#2BC4A6]",
        USER: "bg-gray-100 text-gray-500",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[value] ?? "bg-gray-100 text-gray-500"}`}>
            {value}
        </span>
    );
}

// ── Section ────────────────────────────────────────────────────────────────
function Section({ icon: Icon, title, count, action, children }: {
    icon: React.ElementType; title: string; count?: number;
    action?: React.ReactNode; children: React.ReactNode;
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

// ── Shared form styles ─────────────────────────────────────────────────────
const inputCls = "px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#36DBBA] focus:bg-white focus:ring-2 focus:ring-[#36DBBA]/15";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {children}
        </label>
    );
}

function SubmitBtn({ saving, isEdit, labels }: {
    saving: boolean; isEdit: boolean; labels: [string, string, string];
}) {
    return (
        <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl bg-[#36DBBA] text-white text-sm font-semibold tracking-tight shadow-[0_4px_14px_rgba(54,219,186,0.3)] transition hover:bg-[#2BC4A6] hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
            {saving ? labels[2] : isEdit ? labels[1] : labels[0]}
        </button>
    );
}

function ErrorMsg({ msg }: { msg: string }) {
    return (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle size={15} className="shrink-0" />{msg}
        </div>
    );
}

// ── Modal base ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: {
    title: string; onClose: () => void; children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}>
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-xl p-6 flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900 tracking-tight">{title}</h2>
                    <button onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        <X size={16} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

// ── Budget Modal ───────────────────────────────────────────────────────────
const BUDGET_STATUSES: BudgetStatus[] = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"];

function BudgetModal({ projectId, initial, onClose, onSaved }: {
    projectId: string; initial?: BudgetDTO | null;
    onClose: () => void; onSaved: (b: BudgetDTO) => void;
}) {
    const isEdit = !!initial;
    const [totalEuros, setTotalEuros] = useState(initial ? String(initial.totalCents / 100) : "");
    const [currency, setCurrency] = useState(initial?.currency ?? "EUR");
    const [status, setStatus] = useState<BudgetStatus>(initial?.status ?? "DRAFT");
    const [sentAt, setSentAt] = useState(toDateInput(initial?.sentAt));
    const [validUntil, setValidUntil] = useState(toDateInput(initial?.validUntil));
    const [notes, setNotes] = useState(initial?.notes ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const totalCents = Math.round(parseFloat(totalEuros) * 100);
        if (isNaN(totalCents) || totalCents <= 0) { setError("Introduce un importe válido"); return; }
        setSaving(true);
        try {
            const body = {
                totalCents, currency, status,
                sentAt: sentAt ? new Date(sentAt).toISOString() : null,
                validUntil: validUntil ? new Date(validUntil).toISOString() : null,
                notes: notes.trim() || null,
            };
            const saved = isEdit ? await updateBudget(initial!.id, body) : await createBudget(projectId, body as any);
            onSaved(saved);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "No se pudo guardar");
        } finally { setSaving(false); }
    }

    return (
        <Modal title={isEdit ? "Editar presupuesto" : "Nuevo presupuesto"} onClose={onClose}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Importe">
                        <input className={inputCls} type="number" min="0.01" step="0.01"
                            value={totalEuros} onChange={(e) => setTotalEuros(e.target.value)} placeholder="0.00" required />
                    </Field>
                    <Field label="Moneda">
                        <input className={inputCls} type="text" value={currency} maxLength={3}
                            onChange={(e) => setCurrency(e.target.value.toUpperCase())} placeholder="EUR" />
                    </Field>
                </div>
                <Field label="Estado">
                    <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as BudgetStatus)}>
                        {BUDGET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Fecha envío">
                        <input className={inputCls} type="date" value={sentAt} onChange={(e) => setSentAt(e.target.value)} />
                    </Field>
                    <Field label="Válido hasta">
                        <input className={inputCls} type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                    </Field>
                </div>
                <Field label="Notas (opcional)">
                    <textarea className={`${inputCls} resize-none`} rows={3} value={notes}
                        onChange={(e) => setNotes(e.target.value)} placeholder="Observaciones..." />
                </Field>
                {error && <ErrorMsg msg={error} />}
                <SubmitBtn saving={saving} isEdit={isEdit} labels={["Crear presupuesto", "Guardar cambios", "Guardando..."]} />
            </form>
        </Modal>
    );
}

// ── Phase Modal ────────────────────────────────────────────────────────────
const PHASE_STATUSES: PhaseStatus[] = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE", "CANCELED"];
type PhaseRow = ProjectDetailDTO["phases"][number];

function PhaseModal({ projectId, initial, nextOrder, onClose, onSaved }: {
    projectId: string; initial?: PhaseRow | null; nextOrder: number;
    onClose: () => void; onSaved: (p: PhaseWithProjectDTO) => void;
}) {
    const isEdit = !!initial;
    const [title, setTitle] = useState(initial?.title ?? "");
    const [description, setDesc] = useState(initial?.description ?? "");
    const [order, setOrder] = useState(initial?.order ?? nextOrder);
    const [status, setStatus] = useState<PhaseStatus>((initial?.status as PhaseStatus) ?? "TODO");
    const [startDate, setStartDate] = useState(toDateInput(initial?.startDate));
    const [dueDate, setDueDate] = useState(toDateInput(initial?.dueDate));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!title.trim()) { setError("El título es obligatorio"); return; }
        setSaving(true);
        try {
            const body = {
                title: title.trim(), description: description.trim() || null,
                order, status,
                startDate: startDate ? new Date(startDate).toISOString() : null,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            };
            const saved = isEdit ? await updatePhase(initial!.id, body) : await createPhase(projectId, body as any);
            onSaved(saved);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "No se pudo guardar");
        } finally { setSaving(false); }
    }

    return (
        <Modal title={isEdit ? "Editar fase" : "Nueva fase"} onClose={onClose}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-[1fr_80px] gap-3">
                    <Field label="Título">
                        <input className={inputCls} type="text" value={title}
                            onChange={(e) => setTitle(e.target.value)} placeholder="Nombre de la fase" required />
                    </Field>
                    <Field label="Orden">
                        <input className={inputCls} type="number" min={1} value={order}
                            onChange={(e) => setOrder(Number(e.target.value))} />
                    </Field>
                </div>
                <Field label="Descripción (opcional)">
                    <textarea className={`${inputCls} resize-none`} rows={3} value={description}
                        onChange={(e) => setDesc(e.target.value)} placeholder="Descripción de la fase..." />
                </Field>
                <Field label="Estado">
                    <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as PhaseStatus)}>
                        {PHASE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Fecha inicio">
                        <input className={inputCls} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </Field>
                    <Field label="Fecha entrega">
                        <input className={inputCls} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </Field>
                </div>
                {error && <ErrorMsg msg={error} />}
                <SubmitBtn saving={saving} isEdit={isEdit} labels={["Crear fase", "Guardar cambios", "Guardando..."]} />
            </form>
        </Modal>
    );
}

// ── Invoice Modal ──────────────────────────────────────────────────────────
const INVOICE_STATUSES: InvoiceStatus[] = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELED"];
type InvoiceRow = ProjectDetailDTO["invoices"][number];

function InvoiceModal({ projectId, initial, onClose, onSaved }: {
    projectId: string; initial?: InvoiceRow | null;
    onClose: () => void; onSaved: (inv: InvoiceDTO) => void;
}) {
    const isEdit = !!initial;
    const [amountEuros, setAmountEuros] = useState(initial ? String(initial.amountCents / 100) : "");
    const [currency, setCurrency] = useState(initial?.currency ?? "EUR");
    const [status, setStatus] = useState<InvoiceStatus>((initial?.status as InvoiceStatus) ?? "DRAFT");
    const [number, setNumber] = useState(initial?.number ?? "");
    const [issuedAt, setIssuedAt] = useState(toDateInput(initial?.issuedAt));
    const [dueAt, setDueAt] = useState(toDateInput(initial?.dueAt));
    const [notes, setNotes] = useState(initial?.notes ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const amountCents = Math.round(parseFloat(amountEuros) * 100);
        if (isNaN(amountCents) || amountCents <= 0) { setError("Introduce un importe válido"); return; }
        setSaving(true);
        try {
            const body = {
                amountCents, currency, status,
                number: number.trim() || null,
                issuedAt: issuedAt ? new Date(issuedAt).toISOString() : null,
                dueAt: dueAt ? new Date(dueAt).toISOString() : null,
                notes: notes.trim() || null,
            };
            const saved = isEdit ? await updateInvoice(initial!.id, body) : await createInvoice(projectId, body as any);
            onSaved(saved);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "No se pudo guardar");
        } finally { setSaving(false); }
    }

    return (
        <Modal title={isEdit ? "Editar factura" : "Nueva factura"} onClose={onClose}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Importe">
                        <input className={inputCls} type="number" min="0.01" step="0.01"
                            value={amountEuros} onChange={(e) => setAmountEuros(e.target.value)} placeholder="0.00" required />
                    </Field>
                    <Field label="Moneda">
                        <input className={inputCls} type="text" value={currency} maxLength={3}
                            onChange={(e) => setCurrency(e.target.value.toUpperCase())} placeholder="EUR" />
                    </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Número (opcional)">
                        <input className={inputCls} type="text" value={number}
                            onChange={(e) => setNumber(e.target.value)} placeholder="FAC-001" />
                    </Field>
                    <Field label="Estado">
                        <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as InvoiceStatus)}>
                            {INVOICE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Fecha emisión">
                        <input className={inputCls} type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)} />
                    </Field>
                    <Field label="Fecha vencimiento">
                        <input className={inputCls} type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
                    </Field>
                </div>
                <Field label="Notas (opcional)">
                    <textarea className={`${inputCls} resize-none`} rows={3} value={notes}
                        onChange={(e) => setNotes(e.target.value)} placeholder="Observaciones..." />
                </Field>
                {error && <ErrorMsg msg={error} />}
                <SubmitBtn saving={saving} isEdit={isEdit} labels={["Crear factura", "Guardar cambios", "Guardando..."]} />
            </form>
        </Modal>
    );
}

// ── Delivery Modal ─────────────────────────────────────────────────────────
const DELIVERY_STATUSES: DeliveryStatus[] = ["PENDING", "SUBMITTED", "APPROVED", "REJECTED"];
type DeliveryRow = ProjectDetailDTO["phases"][number]["deliveries"][number];

function DeliveryModal({ phaseId, initial, onClose, onSaved }: {
    phaseId: string; initial?: DeliveryRow | null;
    onClose: () => void; onSaved: (d: DeliveryDTO) => void;
}) {
    const isEdit = !!initial;
    const [title, setTitle] = useState(initial?.title ?? "");
    const [description, setDesc] = useState(initial?.description ?? "");
    const [fileUrl, setFileUrl] = useState(initial?.fileUrl ?? "");
    const [status, setStatus] = useState<DeliveryStatus>((initial?.status as DeliveryStatus) ?? "PENDING");
    const [version, setVersion] = useState(initial?.version ?? 1);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!title.trim()) { setError("El título es obligatorio"); return; }
        setSaving(true);
        try {
            const body = {
                title: title.trim(),
                description: description.trim() || null,
                fileUrl: fileUrl.trim() || null,
                status,
                version,
            };
            const saved = isEdit
                ? await updateDelivery(initial!.id, body)
                : await createDelivery(phaseId, body as any);
            onSaved(saved);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "No se pudo guardar");
        } finally { setSaving(false); }
    }

    return (
        <Modal title={isEdit ? "Editar entrega" : "Nueva entrega"} onClose={onClose}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-[1fr_80px] gap-3">
                    <Field label="Título">
                        <input className={inputCls} type="text" value={title}
                            onChange={(e) => setTitle(e.target.value)} placeholder="Nombre de la entrega" required />
                    </Field>
                    <Field label="Versión">
                        <input className={inputCls} type="number" min={1} value={version}
                            onChange={(e) => setVersion(Number(e.target.value))} />
                    </Field>
                </div>
                <Field label="Descripción (opcional)">
                    <textarea className={`${inputCls} resize-none`} rows={2} value={description}
                        onChange={(e) => setDesc(e.target.value)} placeholder="Descripción de la entrega..." />
                </Field>
                <Field label="Estado">
                    <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as DeliveryStatus)}>
                        {DELIVERY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </Field>
                <Field label="URL del archivo (opcional)">
                    <input className={inputCls} type="url" value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." />
                </Field>
                {error && <ErrorMsg msg={error} />}
                <SubmitBtn saving={saving} isEdit={isEdit} labels={["Crear entrega", "Guardar cambios", "Guardando..."]} />
            </form>
        </Modal>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────
type PhaseModalState = { mode: "create" } | { mode: "edit"; phase: PhaseRow };
type InvoiceModalState = { mode: "create" } | { mode: "edit"; invoice: InvoiceRow };
type DeliveryModalState = { mode: "create"; phaseId: string } | { mode: "edit"; delivery: DeliveryRow; phaseId: string };

export default function ProyectoDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [project, setProject] = useState<ProjectDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [budgetModal, setBudgetModal] = useState<"create" | "edit" | null>(null);
    const [phaseModal, setPhaseModal] = useState<PhaseModalState | null>(null);
    const [invoiceModal, setInvoiceModal] = useState<InvoiceModalState | null>(null);
    const [deliveryModal, setDeliveryModal] = useState<DeliveryModalState | null>(null);
    const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);
    const [deletingPhaseId, setDeletingPhaseId] = useState<string | null>(null);
    const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null);
    const [deletingDeliveryId, setDeletingDeliveryId] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        getProjectById(id).then(setProject).finally(() => setLoading(false));
    }, [id]);

    // ── Budget ──
    function handleBudgetSaved(saved: BudgetDTO) {
        setProject((prev) => {
            if (!prev) return prev;
            const exists = prev.budgets.some((b) => b.id === saved.id);
            const budgets = exists
                ? prev.budgets.map((b) => (b.id === saved.id ? saved : b))
                : [saved, ...prev.budgets];
            return { ...prev, budgets };
        });
        setBudgetModal(null);
    }

    async function handleBudgetDelete(budgetId: string) {
        if (!window.confirm("¿Seguro que quieres eliminar este presupuesto?")) return;
        setDeletingBudgetId(budgetId);
        try {
            await deleteBudget(budgetId);
            setProject((prev) => prev ? { ...prev, budgets: prev.budgets.filter((b) => b.id !== budgetId) } : prev);
        } finally { setDeletingBudgetId(null); }
    }

    // ── Phase ──
    function toPhaseRow(saved: PhaseWithProjectDTO): PhaseRow {
        return {
            id: saved.id, status: saved.status as any, projectId: saved.projectId,
            title: saved.title, description: saved.description, order: saved.order,
            startDate: saved.startDate, dueDate: saved.dueDate,
            createdAt: saved.createdAt, updatedAt: saved.updatedAt,
            deliveries: saved.deliveries ?? [],
        };
    }

    function handlePhaseSaved(saved: PhaseWithProjectDTO) {
        const row = toPhaseRow(saved);
        setProject((prev) => {
            if (!prev) return prev;
            const exists = prev.phases.some((p) => p.id === row.id);
            const phases = exists
                ? prev.phases.map((p) => (p.id === row.id ? row : p))
                : [...prev.phases, row].sort((a, b) => a.order - b.order);
            return { ...prev, phases };
        });
        setPhaseModal(null);
    }

    async function handlePhaseDelete(phaseId: string) {
        if (!window.confirm("¿Seguro que quieres eliminar esta fase?")) return;
        setDeletingPhaseId(phaseId);
        try {
            await deletePhase(phaseId);
            setProject((prev) => prev ? { ...prev, phases: prev.phases.filter((p) => p.id !== phaseId) } : prev);
        } finally { setDeletingPhaseId(null); }
    }

    // ── Invoice ──
    function handleInvoiceSaved(saved: InvoiceDTO) {
        setProject((prev) => {
            if (!prev) return prev;
            const exists = prev.invoices.some((i) => i.id === saved.id);
            const invoices = exists
                ? prev.invoices.map((i) => (i.id === saved.id ? { ...i, ...saved } : i))
                : [saved, ...prev.invoices];
            return { ...prev, invoices };
        });
        setInvoiceModal(null);
    }

    async function handleInvoiceDelete(invoiceId: string) {
        if (!window.confirm("¿Seguro que quieres eliminar esta factura?")) return;
        setDeletingInvoiceId(invoiceId);
        try {
            await deleteInvoice(invoiceId);
            setProject((prev) => prev ? { ...prev, invoices: prev.invoices.filter((i) => i.id !== invoiceId) } : prev);
        } finally { setDeletingInvoiceId(null); }
    }

    // ── Delivery ──
    function handleDeliverySaved(phaseId: string, saved: DeliveryDTO) {
        setProject((prev) => {
            if (!prev) return prev;
            const phases = prev.phases.map((ph) => {
                if (ph.id !== phaseId) return ph;
                const exists = ph.deliveries.some((d) => d.id === saved.id);
                const deliveries = exists
                    ? ph.deliveries.map((d) => (d.id === saved.id ? { ...d, ...saved } : d))
                    : [...ph.deliveries, saved];
                return { ...ph, deliveries };
            });
            return { ...prev, phases };
        });
        setDeliveryModal(null);
    }

    async function handleDeliveryDelete(phaseId: string, deliveryId: string) {
        if (!window.confirm("¿Seguro que quieres eliminar esta entrega?")) return;
        setDeletingDeliveryId(deliveryId);
        try {
            await deleteDelivery(deliveryId);
            setProject((prev) => {
                if (!prev) return prev;
                const phases = prev.phases.map((ph) =>
                    ph.id !== phaseId ? ph : { ...ph, deliveries: ph.deliveries.filter((d) => d.id !== deliveryId) }
                );
                return { ...prev, phases };
            });
        } finally { setDeletingDeliveryId(null); }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="w-6 h-6 rounded-full border-2 border-[#36DBBA] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-48 text-sm text-gray-400">
                Proyecto no encontrado.
            </div>
        );
    }

    const budget = project.budgets[0] ?? null;
    const nextOrder = project.phases.length + 1;

    return (
        <>
            <div className="flex flex-col gap-6 max-w-2xl">

                {/* ── 1. Cliente ── */}
                <Section icon={User} title="Cliente">
                    <button
                        onClick={() => router.push(`/admin/usuarios/${project.client.id}`)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all text-left w-full"
                    >
                        <div className="w-9 h-9 rounded-xl bg-[#36DBBA]/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold text-[#2BC4A6]">
                                {project.client.email.slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {project.client.name || project.client.email}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                <span className="text-xs text-gray-400">{project.client.email}</span>
                                <Badge value={project.client.role} />
                                <Badge value={project.client.status} />
                            </div>
                        </div>
                        <ChevronRight size={15} className="text-gray-300 shrink-0" />
                    </button>
                </Section>

                {/* ── 2. Proyecto ── */}
                <Section icon={FolderKanban} title="Proyecto">
                    <div className="px-4 py-4 rounded-xl border border-gray-100 bg-white flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-semibold text-gray-900 tracking-tight">{project.name}</h3>
                            <Badge value={project.status} />
                        </div>
                        {project.description && (
                            <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
                        )}
                        <div className="flex items-center gap-4 pt-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar size={13} strokeWidth={1.8} />
                                <span>Inicio: <span className="text-gray-600 font-medium">{fmt(project.startDate)}</span></span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar size={13} strokeWidth={1.8} />
                                <span>Entrega: <span className="text-gray-600 font-medium">{fmt(project.dueDate)}</span></span>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ── 3. Presupuesto ── */}
                <Section
                    icon={Receipt}
                    title="Presupuesto"
                    action={!budget ? (
                        <button onClick={() => setBudgetModal("create")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#36DBBA]/10 text-[#2BC4A6] text-xs font-semibold hover:bg-[#36DBBA]/20 transition-colors">
                            <Plus size={13} /> Nuevo
                        </button>
                    ) : null}
                >
                    {!budget ? (
                        <Empty label="Sin presupuesto. Usa el botón 'Nuevo' para crear uno." />
                    ) : (
                        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-xl font-semibold text-gray-900 tracking-tight">
                                        {money(budget.totalCents, budget.currency)}
                                    </span>
                                    <Badge value={budget.status} />
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setBudgetModal("edit")}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => handleBudgetDelete(budget.id)} disabled={deletingBudgetId === budget.id}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                            <div className="border-t border-gray-50 px-4 py-3 grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-gray-400">Enviado</p>
                                    <p className="text-sm text-gray-700 font-medium mt-0.5">{fmt(budget.sentAt)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Válido hasta</p>
                                    <p className="text-sm text-gray-700 font-medium mt-0.5">{fmt(budget.validUntil)}</p>
                                </div>
                                {budget.notes && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-400">Notas</p>
                                        <p className="text-sm text-gray-600 mt-0.5">{budget.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Section>

                {/* ── 4. Fases ── */}
                <Section
                    icon={Layers}
                    title="Fases"
                    count={project.phases.length}
                    action={
                        <button onClick={() => setPhaseModal({ mode: "create" })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#36DBBA]/10 text-[#2BC4A6] text-xs font-semibold hover:bg-[#36DBBA]/20 transition-colors">
                            <Plus size={13} /> Nueva
                        </button>
                    }
                >
                    {project.phases.length === 0 ? (
                        <Empty label="Sin fases. Usa el botón 'Nueva' para crear la primera." />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {project.phases.map((ph) => (
                                <div key={ph.id} className="rounded-xl border border-gray-100 bg-white overflow-hidden">

                                    {/* Fase header */}
                                    <div className="flex items-start justify-between gap-3 px-4 py-3.5 border-b border-gray-50">
                                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                            <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0">
                                                {ph.order}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900">{ph.title}</p>
                                                {ph.description && (
                                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{ph.description}</p>
                                                )}
                                                {(ph.startDate || ph.dueDate) && (
                                                    <div className="flex items-center gap-3 mt-1">
                                                        {ph.startDate && (
                                                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                                                <Calendar size={11} strokeWidth={1.8} />{fmt(ph.startDate)}
                                                            </span>
                                                        )}
                                                        {ph.dueDate && (
                                                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                                                <Calendar size={11} strokeWidth={1.8} />{fmt(ph.dueDate)}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Badge value={ph.status} />
                                            <button onClick={() => setPhaseModal({ mode: "edit", phase: ph })}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                                <Pencil size={13} />
                                            </button>
                                            <button onClick={() => handlePhaseDelete(ph.id)} disabled={deletingPhaseId === ph.id}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Entregas header */}
                                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50/60">
                                        <span className="text-xs font-medium text-gray-400">
                                            Entregas ({ph.deliveries.length})
                                        </span>
                                        <button
                                            onClick={() => setDeliveryModal({ mode: "create", phaseId: ph.id })}
                                            className="flex items-center gap-1 text-xs font-semibold text-[#2BC4A6] hover:text-[#2BC4A6]/70 transition-colors"
                                        >
                                            <Plus size={12} /> Nueva entrega
                                        </button>
                                    </div>

                                    {/* Entregas lista */}
                                    {ph.deliveries.length === 0 ? (
                                        <div className="px-4 py-3 text-xs text-gray-400 flex items-center gap-1.5">
                                            <Package size={13} strokeWidth={1.8} /> Sin entregas todavía
                                        </div>
                                    ) : (
                                        <div className="flex flex-col divide-y divide-gray-50">
                                            {ph.deliveries.map((d) => (
                                                <div key={d.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <Package size={14} strokeWidth={1.8} className="text-gray-300 shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-gray-700 truncate">{d.title}</p>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <Badge value={d.status} />
                                                                <span className="text-xs text-gray-400">v{d.version}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {d.fileUrl && (
                                                            <a href={d.fileUrl} target="_blank" rel="noreferrer"
                                                                className="flex items-center gap-1 text-xs text-[#2BC4A6] font-medium hover:underline mr-1">
                                                                Ver archivo <ExternalLink size={11} />
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => setDeliveryModal({ mode: "edit", delivery: d, phaseId: ph.id })}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                                            <Pencil size={13} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeliveryDelete(ph.id, d.id)}
                                                            disabled={deletingDeliveryId === d.id}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                {/* ── 5. Facturas ── */}
                <Section
                    icon={FileText}
                    title="Facturas"
                    count={project.invoices.length}
                    action={
                        <button onClick={() => setInvoiceModal({ mode: "create" })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#36DBBA]/10 text-[#2BC4A6] text-xs font-semibold hover:bg-[#36DBBA]/20 transition-colors">
                            <Plus size={13} /> Nueva
                        </button>
                    }
                >
                    {project.invoices.length === 0 ? (
                        <Empty label="Sin facturas. Usa el botón 'Nueva' para crear la primera." />
                    ) : (
                        <div className="flex flex-col gap-2">
                            {project.invoices.map((inv) => (
                                <div key={inv.id} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3.5">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-gray-900">{inv.number || "Sin número"}</p>
                                                <Badge value={inv.status} />
                                            </div>
                                            <span className="text-lg font-semibold text-gray-900 tracking-tight">
                                                {money(inv.amountCents, inv.currency)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setInvoiceModal({ mode: "edit", invoice: inv })}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => handleInvoiceDelete(inv.id)} disabled={deletingInvoiceId === inv.id}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                    {(inv.issuedAt || inv.dueAt || inv.notes) && (
                                        <div className="border-t border-gray-50 px-4 py-3 grid grid-cols-2 gap-3">
                                            {inv.issuedAt && (
                                                <div>
                                                    <p className="text-xs text-gray-400">Emitida</p>
                                                    <p className="text-sm text-gray-700 font-medium mt-0.5">{fmt(inv.issuedAt)}</p>
                                                </div>
                                            )}
                                            {inv.dueAt && (
                                                <div>
                                                    <p className="text-xs text-gray-400">Vencimiento</p>
                                                    <p className="text-sm text-gray-700 font-medium mt-0.5">{fmt(inv.dueAt)}</p>
                                                </div>
                                            )}
                                            {inv.notes && (
                                                <div className="col-span-2">
                                                    <p className="text-xs text-gray-400">Notas</p>
                                                    <p className="text-sm text-gray-600 mt-0.5">{inv.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

            </div>

            {/* ── Modales ── */}
            {budgetModal && (
                <BudgetModal projectId={id}
                    initial={budgetModal === "edit" ? budget : null}
                    onClose={() => setBudgetModal(null)}
                    onSaved={handleBudgetSaved} />
            )}

            {phaseModal && (
                <PhaseModal projectId={id}
                    initial={phaseModal.mode === "edit" ? phaseModal.phase : null}
                    nextOrder={nextOrder}
                    onClose={() => setPhaseModal(null)}
                    onSaved={handlePhaseSaved} />
            )}

            {invoiceModal && (
                <InvoiceModal projectId={id}
                    initial={invoiceModal.mode === "edit" ? invoiceModal.invoice : null}
                    onClose={() => setInvoiceModal(null)}
                    onSaved={handleInvoiceSaved} />
            )}

            {deliveryModal && (
                <DeliveryModal
                    phaseId={deliveryModal.phaseId}
                    initial={deliveryModal.mode === "edit" ? deliveryModal.delivery : null}
                    onClose={() => setDeliveryModal(null)}
                    onSaved={(saved) => handleDeliverySaved(deliveryModal.phaseId, saved)} />
            )}
        </>
    );
}