// deliveries.api.ts
import { api } from "./axios";

export type DeliveryStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";

export type DeliveryDTO = {
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

export type CreateDeliveryBody = {
    title: string;
    description?: string;
    fileUrl?: string;
    status?: DeliveryStatus;
    version?: number; // default 1 en backend
};

export type UpdateDeliveryBody = {
    title?: string;
    description?: string | null;
    fileUrl?: string | null;
    status?: DeliveryStatus;
    version?: number;
};

export async function createDelivery(phaseId: string, body: CreateDeliveryBody) {
    const res = await api.post<{ delivery: DeliveryDTO }>(
        `/admin/phases/${phaseId}/deliveries`,
        body
    );
    return res.data.delivery;
}

export async function updateDelivery(id: string, body: UpdateDeliveryBody) {
    const res = await api.patch<{ delivery: DeliveryDTO }>(`/admin/deliveries/${id}`, body);
    return res.data.delivery;
}

export async function deleteDelivery(id: string) {
    await api.delete(`/admin/deliveries/${id}`);
}