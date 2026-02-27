import { api } from "./axios";
import type { InvoiceStatus, ProjectStatus } from "./projects.api";

export type InvoiceWithProjectDTO = {
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

    project: {
        id: string;
        name: string;
        status: ProjectStatus;
        clientId: string;
        startDate: string | null;
        dueDate: string | null;
        createdAt: string;
        updatedAt: string;
    };
};

/**
 * GET /users/:id/invoices
 */
export async function getInvoicesByUser(userId: string) {
    const res = await api.get<{ invoices: InvoiceWithProjectDTO[] }>(`/users/${userId}/invoices`);
    return res.data.invoices;
}