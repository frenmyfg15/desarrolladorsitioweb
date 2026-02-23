import { api } from "../axios";
import type { LoginInput, LoginResponse, MeResponse, LogoutResponse } from "./auth.types";

export const authApi = {
    // POST /auth/login
    login: async (input: LoginInput) => {
        const { data } = await api.post<LoginResponse>("/auth/login", input);
        return data;
    },

    // GET /auth/me
    me: async () => {
        const { data } = await api.get<MeResponse>("/auth/me");
        return data;
    },

    // POST /auth/logout
    logout: async () => {
        const { data } = await api.post<LogoutResponse>("/auth/logout");
        return data;
    },
};
