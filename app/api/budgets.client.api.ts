import { api } from "./axios";
import type { BudgetStatus, ProjectStatus } from "./projects.api";

export type BudgetWithProjectDTO = {
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
 * GET /users/:id/budgets
 */
export async function getBudgetsByUser(userId: string) {
    const res = await api.get<{ budgets: BudgetWithProjectDTO[] }>(`/users/${userId}/budgets`);
    return res.data.budgets;
}

export type BudgetDecisionBody = { decision: "ACCEPT" | "REJECT" };

export async function decideBudget(userId: string, budgetId: string, body: { decision: "ACCEPT" | "REJECT" }) {
    const res = await api.patch<{ budget: BudgetWithProjectDTO }>(
        `/users/${userId}/budgets/${budgetId}/decision`,
        body
    );
    return res.data.budget;
}