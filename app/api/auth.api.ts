// auth.api.ts

import { api } from "./axios";


type LoginBody = {
    email: string;
    password: string;
};

export type UserDTO = {
    id: string;
    email: string;
    name: string | null;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    createdAt: string;
    updatedAt: string;
};

export async function login(body: LoginBody) {
    const res = await api.post<{ user: UserDTO }>("/auth/login", body);
    return res.data.user;
}

// (opcional) si luego lo creas en backend
export async function logout() {
    await api.post("/auth/logout");
}