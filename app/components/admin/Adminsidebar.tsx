"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    Building2,
    FolderKanban,
    Layers,
    FileText,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useAuthStore } from "@/app/store/auth.store";
import Image from "next/image";
import logo from '@/app/assets/novaforge/logo.png'

const menu = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Usuarios", href: "/admin/usuarios", icon: Users },
    { label: "Proyectos", href: "/admin/proyectos", icon: FolderKanban },
    { label: "Fases", href: "/admin/fases", icon: Layers },
    { label: "Facturas", href: "/admin/facturas", icon: FileText },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white border border-gray-100 rounded-lg shadow-sm"
            >
                <Menu size={20} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col px-4 py-6 transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>

                {/* Logo */}
                <div className="flex items-center justify-between lg:justify-start gap-2.5 px-2 mb-8">
                    <div className="flex items-center gap-2.5">
                        <Image src={logo} alt="NovaForge" className="w-[34px] h-[34px] object-contain" />
                        <span className="text-base font-semibold text-gray-900 tracking-tight">
                            NovaForge
                        </span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
                    {menu.map(({ label, href, icon: Icon }) => {
                        const active = pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                                ${active
                                        ? "bg-[#36DBBA]/10 text-[#2BC4A6]"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon size={17} strokeWidth={1.8} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className="border-t border-gray-100 pt-4 mt-4 flex flex-col gap-3 shrink-0">
                    <div className="px-3">
                        <p className="text-xs text-gray-400 font-medium">Sesión activa</p>
                        <p className="text-sm text-gray-700 font-medium truncate mt-0.5">
                            {user?.email}
                        </p>
                    </div>

                    <button
                        onClick={() => logout().then(() => router.replace("/login"))}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={17} strokeWidth={1.8} />
                        Cerrar sesión
                    </button>
                </div>

                {/* Bottom space for the scroll */}
                <div className="h-4 shrink-0 lg:hidden" />
            </aside>
        </>
    );
}

export { menu };