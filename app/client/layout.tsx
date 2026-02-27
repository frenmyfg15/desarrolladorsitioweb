"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/app/store/auth.store";
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Receipt,
    LogOut,
    User as UserIcon,
    Menu,
    X
} from "lucide-react";

export default function ClientLayout({ children }: { children: ReactNode }) {
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);
    const isHydrated = useAuthStore((s) => s.isHydrated);
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="flex h-screen bg-[#FFFFFF] font-sans text-[#111827] overflow-hidden flex-col md:flex-row">
            {/* OVERLAY MOBILE */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ASIDE */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 border-r border-[#E5E7EB] bg-[#FFFFFF] flex flex-col p-6 gap-8 shrink-0 h-full transition-transform duration-300 transform
                md:relative md:translate-x-0
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex items-center justify-between md:justify-start gap-3 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#36DBBA] rounded-lg flex items-center justify-center shadow-sm">
                            <div className="w-4 h-4 bg-white rounded-sm" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-[#111827]">
                            Cliente
                        </span>
                    </div>
                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
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

            {/* CONTENEDOR DERECHO */}
            <div className="flex-1 flex flex-col bg-[#F9FAFB] overflow-y-auto h-full">
                {/* HEADER */}
                <header className="sticky top-0 z-20 h-20 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-[#E5E7EB] flex items-center justify-between px-4 md:px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="font-semibold text-base md:text-lg text-[#111827] truncate max-w-[150px] sm:max-w-none">
                            {isHydrated && user ? (
                                <>
                                    <span className="text-[#6B7280] font-normal hidden sm:inline">Bienvenido de nuevo,</span> {user.name || "Usuario"}
                                </>
                            ) : (
                                "Panel de Control"
                            )}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-3 md:pr-4 md:border-r md:border-[#E5E7EB]">
                            <div className="text-right hidden lg:block">
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

                {/* MAIN */}
                <main className="p-4 md:p-8 flex-1">
                    <div className="max-w-7xl mx-auto">
                        {children}
                        <div className="h-20" />
                    </div>
                </main>
            </div>
        </div>
    );
}