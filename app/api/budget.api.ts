// budget.api.ts
import { api } from "./axios";

export type BudgetStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";

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

export type CreateBudgetBody = {
    totalCents: number;
    currency?: string; // default EUR en backend
    status?: BudgetStatus;
    sentAt?: string; // ISO
    validUntil?: string; // ISO
    notes?: string;
};

export type UpdateBudgetBody = {
    totalCents?: number;
    currency?: string;
    status?: BudgetStatus;
    sentAt?: string | null; // ISO o null
    validUntil?: string | null; // ISO o null
    notes?: string | null;
};

export async function createBudget(projectId: string, body: CreateBudgetBody) {
    const res = await api.post<{ budget: BudgetDTO }>(
        `/admin/projects/${projectId}/budgets`,
        body
    );
    return res.data.budget;
}

export async function updateBudget(id: string, body: UpdateBudgetBody) {
    const res = await api.patch<{ budget: BudgetDTO }>(`/admin/budgets/${id}`, body);
    return res.data.budget;
}

export async function deleteBudget(id: string) {
    await api.delete(`/admin/budgets/${id}`);
}