// auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as authApi from "../api/auth.api";

type User = authApi.UserDTO;

type AuthState = {
    user: User | null;
    isHydrated: boolean;

    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isHydrated: false,

            setUser: (user) => set({ user }),

            login: async (email, password) => {
                const user = await authApi.login({ email, password });
                set({ user });
                return user;
            },

            logout: async () => {
                await authApi.logout().catch(() => { });
                set({ user: null });
            },
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),
            onRehydrateStorage: () => (state) => {
                if (state) state.isHydrated = true;
            },
        }
    )
);