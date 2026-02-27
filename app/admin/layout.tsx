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

    useEffect(() => {
        if (!isHydrated) return;
        if (!user) { router.replace("/login"); return; }
        if (user.role !== "ADMIN") router.replace("/");
    }, [user, isHydrated, router]);

    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-6 h-6 rounded-full border-2 border-[#36DBBA] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!user || user.role !== "ADMIN") return null;

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-50 overflow-hidden">

            {/* Sidebar: Oculto en móviles vía AdminSidebar interno, aquí definimos su espacio en desktop */}
            <aside className="hidden lg:block w-[240px] h-full shrink-0 border-r border-gray-200 bg-white">
                <AdminSidebar />
            </aside>

            {/* Sidebar para móviles (se renderiza fuera del flujo anterior) */}
            <div className="lg:hidden">
                <AdminSidebar />
            </div>

            {/* Contenedor derecho */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto">

                {/* Header */}
                <header className="sticky top-0 z-30 shrink-0 shadow-sm bg-white">
                    <AdminHeader />
                </header>

                {/* Área de contenido */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-[1600px] mx-auto">
                        {children}

                        {/* Espacio al final del scroll */}
                        <div className="h-20 w-full" />
                    </div>
                </main>
            </div>

        </div>
    );
}