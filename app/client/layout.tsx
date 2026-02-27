"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/app/store/auth.store";
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Receipt,
    LogOut,
    User as UserIcon
} from "lucide-react";

export default function ClientLayout({ children }: { children: ReactNode }) {
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);
    const isHydrated = useAuthStore((s) => s.isHydrated);
    const router = useRouter();
    const pathname = usePathname();

    async function onLogout() {
        await logout();
        router.replace("/login");
    }

    const menuItems = [
        { name: "Resumen", href: "/client/resumen", icon: LayoutDashboard },
        { name: "Proyectos", href: "/client/proyectos", icon: Briefcase },
        { name: "Presupuestos", href: "/client/presupuestos", icon: FileText },
        { name: "Facturas", href: "/client/facturas", icon: Receipt },
    ];

    return (
        <div className="flex min-h-screen bg-[#FFFFFF] font-sans text-[#111827]">
            <aside className="w-64 border-r border-[#E5E7EB] bg-[#FFFFFF] flex flex-col p-6 gap-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-[#36DBBA] rounded-lg flex items-center justify-center shadow-sm">
                        <div className="w-4 h-4 bg-white rounded-sm" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-[#111827]">
                        Cliente
                    </span>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-[#F3F4F6] text-[#36DBBA] font-medium"
                                    : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#36DBBA]"
                                    }`}
                            >
                                <item.icon
                                    size={20}
                                    className={isActive ? "text-[#36DBBA]" : "text-[#9CA3AF] group-hover:text-[#36DBBA]"}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 px-4 py-3 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Cerrar sesión</span>
                </button>
            </aside>

            <div className="flex-1 flex flex-col bg-[#F9FAFB]">
                <header className="h-20 bg-[#FFFFFF] border-b border-[#E5E7EB] flex items-center justify-between px-8">
                    <div>
                        <h1 className="font-semibold text-lg text-[#111827]">
                            {isHydrated && user ? (
                                <>
                                    <span className="text-[#6B7280] font-normal">Bienvenido de nuevo,</span> {user.name || "Usuario"}
                                </>
                            ) : (
                                "Panel de Control"
                            )}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pr-4 border-r border-[#E5E7EB]">
                            <div className="text-right">
                                <p className="text-sm font-medium text-[#111827]">
                                    {isHydrated ? user?.name : "Cargando..."}
                                </p>
                                <p className="text-xs text-[#9CA3AF]">
                                    {isHydrated ? user?.email : ""}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center border border-[#E5E7EB] hover:border-[#36DBBA] transition-colors cursor-pointer group">
                                <UserIcon size={20} className="text-[#6B7280] group-hover:text-[#36DBBA]" />
                            </div>
                        </div>

                        <button
                            onClick={onLogout}
                            className="p-2 text-[#6B7280] hover:text-[#36DBBA] transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut size={22} />
                        </button>
                    </div>
                </header>

                <main className="p-8 flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}