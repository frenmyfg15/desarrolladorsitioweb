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
        <div className="min-h-screen grid grid-cols-[240px_1fr] bg-gray-50">

            {/* Sidebar fijo */}
            <div className="sticky top-0 h-screen">
                <AdminSidebar />
            </div>

            {/* Contenido principal */}
            <div className="flex flex-col min-h-screen">
                <AdminHeader />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>

        </div>
    );
}