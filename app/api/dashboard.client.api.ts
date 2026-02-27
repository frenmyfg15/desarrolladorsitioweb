import { api } from "./axios";
import type { ProjectStatus, InvoiceStatus } from "./projects.api";

export type ClientDashboardDTO = {
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

        overdueTop: Array<{
            id: string;
            status: InvoiceStatus;
            projectId: string;
            number: string | null;
            issuedAt: string | null;
            dueAt: string | null;
            currency: string;
            amountCents: number;
            notes: string | null;
            createdAt: string;
            updatedAt: string;
            project: { id: string; name: string; status: ProjectStatus };
        }>;

        dueSoonTop: Array<{
            id: string;
            status: InvoiceStatus;
            projectId: string;
            number: string | null;
            issuedAt: string | null;
            dueAt: string | null;
            currency: string;
            amountCents: number;
            notes: string | null;
            createdAt: string;
            updatedAt: string;
            project: { id: string; name: string; status: ProjectStatus };
        }>;
    };
    budgets: {
        pendingDecisionCount: number;
    };
};

export async function getClientDashboard(userId: string) {
    const res = await api.get<ClientDashboardDTO>(`/users/${userId}/dashboard`);
    return res.data;
}