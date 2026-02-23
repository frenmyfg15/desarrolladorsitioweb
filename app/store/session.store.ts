import { create } from "zustand";
import { persist } from "zustand/middleware";

import { authApi } from "../api/auth/auth.api";
import { empresaApi } from "../api/empresa/empresa.api";

import type { PublicUser } from "../api/auth/auth.types";
import type { Empresa } from "../api/empresa/empresa.types";

type SessionState = {
    user: PublicUser | null;
    empresa: Empresa | null;

    isLoading: boolean;

    // acciones
    setUser: (user: PublicUser | null) => void;
    setEmpresa: (empresa: Empresa | null) => void;

    hydrate: () => Promise<void>;  // carga /auth/me y /empresa/me si hay sesión
    logout: () => Promise<void>;   // limpia cookie + estado
};

export const useSessionStore = create<SessionState>()(
    persist(
        (set, get) => ({
            user: null,
            empresa: null,
            isLoading: false,

            setUser: (user) => set({ user }),
            setEmpresa: (empresa) => set({ empresa }),

            hydrate: async () => {
                // evita llamadas duplicadas si la app lo llama varias veces
                if (get().isLoading) return;

                set({ isLoading: true });

                try {
                    // 1) ver si hay sesión
                    const me = await authApi.me();
                    set({ user: me.user });

                    // 2) cargar empresa (puede no existir todavía)
                    try {
                        const { empresa } = await empresaApi.me();
                        set({ empresa });
                    } catch (e) {
                        // si no hay empresa aún (404), la dejamos en null
                        set({ empresa: null });
                    }
                } catch (e) {
                    // si no hay sesión, limpiar todo
                    set({ user: null, empresa: null });
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                try {
                    await authApi.logout();
                } finally {
                    // aunque falle la llamada, limpiamos el estado local
                    set({ user: null, empresa: null });
                }
            },
        }),
        {
            name: "novaforge_session", // clave en localStorage
            // Persistimos solo datos, no flags
            partialize: (state) => ({ user: state.user, empresa: state.empresa }),
        }
    )
);
