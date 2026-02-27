// invoices.api.ts
import { api } from "./axios";
import type { UserDTO } from "./auth.api";
import type { ProjectStatus } from "./projects.api";

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELED";

export type InvoiceDTO = {
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
};

export type InvoiceWithProjectDTO = InvoiceDTO & {
    project: {
        id: string;
        status: ProjectStatus;
        name: string;
        description: string | null;
        clientId: string;
        startDate: string | null;
        dueDate: string | null;
        createdAt: string;
        updatedAt: string;
        client: UserDTO;
    };
};

export type CreateInvoiceBody = {
    amountCents: number;
    currency?: string; // default EUR en backend
    status?: InvoiceStatus;
    number?: string;
    issuedAt?: string; // ISO
    dueAt?: string; // ISO
    notes?: string;
};

export type UpdateInvoiceBody = {
    amountCents?: number;
    currency?: string;
    status?: InvoiceStatus;
    number?: string | null;
    issuedAt?: string | null;
    dueAt?: string | null;
    notes?: string | null;
};

export async function getAllInvoices() {
    const res = await api.get<{ invoices: InvoiceWithProjectDTO[] }>("/admin/invoices");
    return res.data.invoices;
}

export async function createInvoice(projectId: string, body: CreateInvoiceBody) {
    const res = await api.post<{ invoice: InvoiceDTO }>(
        `/admin/projects/${projectId}/invoices`,
        body
    );
    return res.data.invoice;
}

export async function updateInvoice(id: string, body: UpdateInvoiceBody) {
    const res = await api.patch<{ invoice: InvoiceDTO }>(`/admin/invoices/${id}`, body);
    return res.data.invoice;
}

export async function deleteInvoice(id: string) {
    await api.delete(`/admin/invoices/${id}`);
}