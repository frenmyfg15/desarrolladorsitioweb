// dashboard.api.ts
import { api } from "./axios";

export type KPI = {
    usersTotal: number;
    usersActive: number;
    projectsTotal: number;
    phasesTotal: number;
    deliveriesTotal: number;
    budgetsTotal: number;
    invoicesTotal: number;
};

export type Billing = {
    currency: string; // "EUR"
    totalCents: number;
    paidCents: number;
    unpaidCents: number;
    overdueCents: number;
};

export type StatusCount = { status: string; count: number };
export type StatusCountSum = { status: string; count: number; sumCents: number };

export type DashboardInvoiceRow = {
    id: string;
    status: string;
    number: string | null;
    issuedAt: string | null;
    dueAt: string | null;
    currency: string;
    amountCents: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    project: {
        id: string;
        name: string;
        status?: string;
        client?: { id: string; email: string; name: string | null };
    };
};

export type DashboardProjectRow = {
    id: string;
    status: string;
    name: string;
    description: string | null;
    clientId: string;
    startDate: string | null;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    client: { id: string; email: string; name: string | null; status?: string };
};

export type DashboardPhaseRow = {
    id: string;
    status: string;
    projectId: string;
    title: string;
    description: string | null;
    order: number;
    startDate: string | null;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    project: {
        id: string;
        name: string;
        client: { id: string; email: string; name: string | null };
    };
};

export type TopClientRow = {
    client: { id: string; email: string; name: string | null };
    totalCents: number;
    paidCents: number;
    count: number;
};

export type DashboardDTO = {
    kpis: KPI;
    billing: Billing;
    charts: {
        projectsByStatus: StatusCount[];
        phasesByStatus: StatusCount[];
        invoicesByStatus: StatusCountSum[];
        budgetsByStatus: StatusCountSum[];
    };
    lists: {
        recentInvoices: DashboardInvoiceRow[];
        recentProjects: DashboardProjectRow[];
        overdueInvoices: DashboardInvoiceRow[];
        upcomingProjects: DashboardProjectRow[];
        upcomingPhases: DashboardPhaseRow[];
        topClients: TopClientRow[];
    };
};

export async function getAdminDashboard() {
    const res = await api.get<DashboardDTO>("/admin/dashboard");
    return res.data;
}