"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import { AdminSidebar } from "../components/admin/Adminsidebar";
import { AdminHeader } from "../components/admin/Adminheader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const isHydrated = useAuthStore((s) => s.isHydrated);

    // Proteger ruta admin
    useEffect(() => {
        if (!isHydrated) return;
        if (!user) { router.replace("/login"); return; }
        if (user.role !== "ADMIN") router.replace("/");
    }, [user, isHydrated, router]);

    // Cargando hidratación
    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-6 h-6 rounded-full border-2 border-[#36DBBA] border-t-transparent animate-spin" />
            </div>
        );
    }

    // Evitar parpadeo si no es admin
    if (!user || user.role !== "ADMIN") return null;

    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden">

            {/* Sidebar fijo: No se mueve */}
            <aside className="w-[240px] h-full shrink-0 border-r border-gray-200 bg-white">
                <AdminSidebar />
            </aside>

            {/* Contenedor derecho: Gestiona su propio scroll */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto">

                {/* Header fijo: Se queda arriba al hacer scroll en el contenido */}
                <header className="sticky top-0 z-30 shrink-0 shadow-sm">
                    <AdminHeader />
                </header>

                {/* Área de contenido */}
                <main className="flex-1 p-8">
                    <div className="max-w-[1600px] mx-auto">
                        {children}

                        {/* Espacio al final del scroll como pediste */}
                        <div className="h-20 w-full" />
                    </div>
                </main>
            </div>

        </div>
    );
}