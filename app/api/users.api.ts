// users.api.ts
import { api } from "./axios";
import type { UserDTO } from "./auth.api";

export type ProjectDTO = {
    id: string;
    status: "DRAFT" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELED";
    name: string;
    description: string | null;
    clientId: string;
    startDate: string | null;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;

    invoices: InvoiceDTO[];
};

export type InvoiceDTO = {
    id: string;
    status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELED";
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

export type UserFullAdminViewDTO = {
    user: UserDTO;
    company: null; // por ahora, hasta que exista Company en Prisma
    projects: ProjectDTO[];
    invoices: InvoiceDTO[]; // lista plana de facturas
};

export async function getAllUsers() {
    const res = await api.get<{ users: UserDTO[] }>("/admin/users");
    return res.data.users;
}

// types
export type CreateUserBody = {
    email: string;
    password: string;
    name?: string;
    role?: "ADMIN" | "USER";
};

// api
export async function createUser(body: CreateUserBody) {
    const res = await api.post<{ user: UserDTO }>("/admin/users", body);
    return res.data.user;
}

export async function getUserByIdFull(id: string) {
    const res = await api.get<UserFullAdminViewDTO>(`/admin/users/${id}`);
    return res.data;
}

export type UpdateUserBody = {
    email?: string;
    name?: string | null;
    role?: "ADMIN" | "USER";
    status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
};

export async function updateUser(id: string, body: UpdateUserBody) {
    const res = await api.patch<{ user: UserDTO }>(`/admin/users/${id}`, body);
    return res.data.user;
}

export async function deleteUser(id: string) {
    await api.delete(`/admin/users/${id}`);
}