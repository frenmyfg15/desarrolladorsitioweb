import { api } from "./axios";
import type { ProjectStatus, InvoiceStatus } from "./projects.api";

/** ---------- Modelos compartidos ---------- **/
export type DashInvoice = {
    id: string;
    status: InvoiceStatus;
    projectId?: string;
    number: string | null;
    issuedAt: string | null;
    dueAt: string | null;
    currency: string;
    amountCents: number;
    notes?: string | null;
    createdAt?: string;
    updatedAt?: string;
    project: { id: string; name: string; status: ProjectStatus };
    flags?: { payable?: boolean; isLate?: boolean; missingDueDate?: boolean };
};

/** ---------- DTO viejo (legacy) ---------- **/
export type ClientDashboardLegacyDTO = {
    now: string;
    projects: {
        total: number;
        active: number;
        onHold: number;
        completed: number;
        draft: number;
    };
    payments: {
        overdueCount: number;
        overdueTotalCents: number;
        dueSoonCount: number;
        dueSoonTotalCents: number;
        unpaidCount: number;
        unpaidTotalCents: number;
        noDueDateCount: number;
        overdueTop: DashInvoice[];
        dueSoonTop: DashInvoice[];
    };
    budgets: { pendingDecisionCount: number };
};

/** ---------- DTO nuevo (pro) ---------- **/
export type ClientDashboardDTO = {
    now: string;
    horizon: { dueSoonDays: number; dueSoonUntil: string };
    projects: { total: number; byStatus: Record<ProjectStatus | string, number> };
    invoices: {
        draft: { count: number; totalCents: number };
        payable: { count: number; totalCents: number; noDueDateCount: number };
        overdue: { count: number; totalCents: number; top: DashInvoice[] };
        dueSoon: { count: number; totalCents: number; top: DashInvoice[] };
        open: { count: number; totalCents: number; noDueDateCount: number };
    };
    budgets: { byStatus?: Record<string, number>; pendingDecisionCount: number };
};

function mergeUnique(a: DashInvoice[], b: DashInvoice[]) {
    const m = new Map<string, DashInvoice>();
    [...a, ...b].forEach((x) => m.set(x.id, x));
    return Array.from(m.values());
}

function isNewDTO(x: any): x is ClientDashboardDTO {
    return !!x && typeof x === "object" && !!x.invoices && !!x.projects?.byStatus;
}

function normalizeToNewDTO(input: any): ClientDashboardDTO {
    const raw = input?.dashboard ?? input;

    if (isNewDTO(raw)) {
        return {
            ...raw,
            horizon: raw.horizon ?? {
                dueSoonDays: 14,
                dueSoonUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            },
        };
    }

    const old = raw as ClientDashboardLegacyDTO;

    const payableTop = mergeUnique(old.payments.overdueTop, old.payments.dueSoonTop).filter(
        (i) => i.status === "SENT" || i.status === "OVERDUE"
    );

    const dueSoonOnly = old.payments.dueSoonTop.filter((i) => i.status === "SENT");

    return {
        now: old.now,
        horizon: {
            dueSoonDays: 14,
            dueSoonUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        projects: {
            total: old.projects.total,
            byStatus: {
                ACTIVE: old.projects.active,
                ON_HOLD: old.projects.onHold,
                COMPLETED: old.projects.completed,
                DRAFT: old.projects.draft,
            },
        },
        invoices: {
            draft: { count: 0, totalCents: 0 }, // legacy no lo trae
            payable: {
                count: payableTop.length,
                totalCents: payableTop.reduce((a, x) => a + x.amountCents, 0),
                noDueDateCount: old.payments.noDueDateCount,
            },
            overdue: {
                count: old.payments.overdueCount,
                totalCents: old.payments.overdueTotalCents,
                top: old.payments.overdueTop,
            },
            dueSoon: {
                count: old.payments.dueSoonCount,
                totalCents: old.payments.dueSoonTotalCents,
                top: dueSoonOnly,
            },
            open: {
                count: old.payments.unpaidCount,
                totalCents: old.payments.unpaidTotalCents,
                noDueDateCount: old.payments.noDueDateCount,
            },
        },
        budgets: {
            pendingDecisionCount: old.budgets.pendingDecisionCount,
            byStatus: {},
        },
    };
}

export async function getClientDashboard(userId: string) {
    const res = await api.get<unknown>(`/users/${userId}/dashboard`);
    return normalizeToNewDTO(res.data);
}