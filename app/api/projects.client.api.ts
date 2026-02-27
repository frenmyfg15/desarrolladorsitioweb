// projects.client.api.ts
import { api } from "./axios";
import type {
    ProjectStatus,
    PhaseStatus,
    DeliveryStatus,
    BudgetStatus,
    InvoiceStatus,
} from "./projects.api";

export type ClientProjectListItemDTO = {
    id: string;
    status: ProjectStatus;
    name: string;
    description: string | null;
    clientId: string;
    startDate: string | null;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
};

export type ClientInvoiceDTO = {
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

export type ClientBudgetDTO = {
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

export type ClientPhaseDeliveryDocDTO = {
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

export type ClientProjectPhaseDTO = {
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
    deliveries: ClientPhaseDeliveryDocDTO[];
};

export type ClientProjectDetailDTO = {
    id: string;
    status: ProjectStatus;
    name: string;
    description: string | null;
    clientId: string;
    startDate: string | null;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;

    budgets: ClientBudgetDTO[];
    invoices: ClientInvoiceDTO[];
    phases: ClientProjectPhaseDTO[];
};

/**
 * GET /users/:userId/projects
 */
export async function getProjectsByUser(userId: string) {
    const res = await api.get<{ projects: ClientProjectListItemDTO[] }>(
        `/users/${userId}/projects`
    );
    return res.data.projects;
}

/**
 * GET /users/:userId/projects/:projectId
 */
export async function getProjectDetailById(userId: string, projectId: string) {
    const res = await api.get<{ project: ClientProjectDetailDTO }>(
        `/users/${userId}/projects/${projectId}`
    );
    return res.data.project;
}