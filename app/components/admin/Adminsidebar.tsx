"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Building2,
    FolderKanban,
    Layers,
    FileText,
    LogOut,
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

    return (
        <aside className="flex flex-col h-full border-r border-gray-100 bg-white px-4 py-6">

            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 mb-8">
                <Image src={logo} alt="NovaForge" className="w-[34px] h-[34px] object-contain" />
                <span className="text-base font-semibold text-gray-900 tracking-tight">
                    NovaForge
                </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1 flex-1">
                {menu.map(({ label, href, icon: Icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
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
            <div className="border-t border-gray-100 pt-4 mt-4 flex flex-col gap-3">
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
        </aside>
    );
}

export { menu };