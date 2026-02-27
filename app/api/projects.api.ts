// projects.api.ts
import { api } from "./axios";
import type { UserDTO } from "./auth.api";

export type ProjectStatus = "DRAFT" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELED";
export type PhaseStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELED";
export type DeliveryStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";
export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELED";
export type BudgetStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";

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

export type BudgetDTO = {
    id: string;
    status: BudgetStatus;
    projectId: string;
    currency: string;
    totalCents: number;
    sentAt: string | null;
    validUntil: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
};

export type PhaseDeliveryDocDTO = {
    id: string;
    status: DeliveryStatus;
    phaseId: string;
    title: string;
    description: string | null;
    fileUrl: string | null;
    version: number;
    createdAt: string;
    updatedAt: string;
};

export type ProjectPhaseDTO = {
    id: string;
    status: PhaseStatus;
    projectId: string;
    title: string;
    description: string | null;
    order: number;
    startDate: string | null;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    deliveries: PhaseDeliveryDocDTO[];
};

export type ProjectListItemDTO = {
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

export type ProjectDetailDTO = {
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
    budgets: BudgetDTO[];
    invoices: InvoiceDTO[];
    phases: ProjectPhaseDTO[];
};

export type CreateProjectBody = {
    name: string;
    description?: string;
    status?: ProjectStatus;
    startDate?: string; // ISO
    dueDate?: string;   // ISO
};

export type UpdateProjectBody = {
    name?: string;
    description?: string | null;
    status?: ProjectStatus;
    startDate?: string | null; // ISO o null
    dueDate?: string | null;   // ISO o null
};

export async function getAllProjects() {
    const res = await api.get<{ projects: ProjectListItemDTO[] }>("/admin/projects");
    return res.data.projects;
}

export async function getProjectById(id: string) {
    const res = await api.get<{ project: ProjectDetailDTO }>(`/admin/projects/${id}`);
    return res.data.project;
}

export async function createProjectForUser(userId: string, body: CreateProjectBody) {
    const res = await api.post<{ project: ProjectListItemDTO }>(
        `/admin/users/${userId}/projects`,
        body
    );
    return res.data.project;
}

export async function updateProject(id: string, body: UpdateProjectBody) {
    const res = await api.patch<{ project: ProjectListItemDTO }>(`/admin/projects/${id}`, body);
    return res.data.project;
}

export async function deleteProject(id: string) {
    await api.delete(`/admin/projects/${id}`);
}