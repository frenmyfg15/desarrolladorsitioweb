"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useAuthStore } from "@/app/store/auth.store";
import { menu } from "./Adminsidebar";

export function AdminHeader() {
    const pathname = usePathname();
    const user = useAuthStore((s) => s.user);

    const pageTitle = menu.find((m) => m.href === pathname)?.label ?? "Admin";

    const initials = user?.email?.slice(0, 2).toUpperCase() ?? "AD";

    return (
        <header className="h-16 lg:h-14 flex items-center justify-between px-4 md:px-6 border-b border-gray-100 bg-white">

            {/* Título de la página activa - Margen izquierdo en mobile para no chocar con el trigger del sidebar */}
            <h1 className="text-sm font-semibold text-gray-900 tracking-tight ml-10 lg:ml-0">
                {pageTitle}
            </h1>

            {/* Acciones derechas */}
            <div className="flex items-center gap-2 md:gap-3">

                {/* Notificaciones */}
                <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                    <Bell size={17} strokeWidth={1.8} />
                    {/* Badge */}
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#36DBBA]" />
                </button>

                {/* Info de usuario solo en desktop */}
                <div className="hidden sm:flex flex-col items-end mr-1">
                    <span className="text-[11px] font-medium text-gray-900 leading-none truncate max-w-[120px]">
                        {user?.name || 'Admin'}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight truncate max-w-[120px]">
                        {user?.email}
                    </span>
                </div>

                {/* Avatar */}
                <div className="w-8 h-8 shrink-0 rounded-lg bg-[#36DBBA]/15 flex items-center justify-center border border-[#36DBBA]/20">
                    <span className="text-xs font-semibold text-[#2BC4A6]">{initials}</span>
                </div>

            </div>
        </header>
    );
}