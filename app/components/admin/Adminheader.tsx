"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useAuthStore } from "@/app/store/auth.store";
import { menu } from "./Adminsidebar";

export function AdminHeader() {
    const pathname = usePathname();
    const user = useAuthStore((s) => s.user);

    const pageTitle = menu.find((m) => m.href === pathname)?.label ?? "Admin";

    // Iniciales del email para el avatar
    const initials = user?.email?.slice(0, 2).toUpperCase() ?? "AD";

    return (
        <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white">

            {/* Título de la página activa */}
            <h1 className="text-sm font-semibold text-gray-900 tracking-tight">
                {pageTitle}
            </h1>

            {/* Acciones derechas */}
            <div className="flex items-center gap-3">

                {/* Notificaciones */}
                <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                    <Bell size={17} strokeWidth={1.8} />
                    {/* Badge */}
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#36DBBA]" />
                </button>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-lg bg-[#36DBBA]/15 flex items-center justify-center">
                    <span className="text-xs font-semibold text-[#2BC4A6]">{initials}</span>
                </div>

            </div>
        </header>
    );
}