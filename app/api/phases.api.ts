// phases.api.ts
import { api } from "./axios";
import type { ProjectListItemDTO, ProjectStatus } from "./projects.api";
import type { UserDTO } from "./auth.api";

export type PhaseStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELED";
export type DeliveryStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";

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

export type PhaseWithProjectDTO = {
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

export type CreatePhaseBody = {
    title: string;
    description?: string;
    order?: number;
    status?: PhaseStatus;
    startDate?: string; // ISO
    dueDate?: string; // ISO
};

export type UpdatePhaseBody = {
    title?: string;
    description?: string | null;
    order?: number;
    status?: PhaseStatus;
    startDate?: string | null; // ISO o null
    dueDate?: string | null; // ISO o null
};

export async function getAllPhases() {
    const res = await api.get<{ phases: PhaseWithProjectDTO[] }>("/admin/phases");
    return res.data.phases;
}

export async function createPhase(projectId: string, body: CreatePhaseBody) {
    const res = await api.post<{ phase: PhaseWithProjectDTO }>(
        `/admin/projects/${projectId}/phases`,
        body
    );
    return res.data.phase;
}

export async function updatePhase(id: string, body: UpdatePhaseBody) {
    const res = await api.patch<{ phase: PhaseWithProjectDTO }>(`/admin/phases/${id}`, body);
    return res.data.phase;
}

export async function deletePhase(id: string) {
    await api.delete(`/admin/phases/${id}`);
}