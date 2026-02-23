"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    Clock3,
    Building2,
    Receipt,
    Users,
    Settings,
} from "lucide-react";

const items = [
    { href: "/superadmin", label: "Resumen", icon: LayoutDashboard },
    { href: "/superadmin/proyectos", label: "Proyectos", icon: FolderKanban },
    { href: "/superadmin/empresas", label: "Empresas", icon: Building2 },
    { href: "/superadmin/facturas", label: "Facturas", icon: Receipt },
    { href: "/superadmin/usuarios", label: "Usuarios", icon: Users },
    { href: "/superadmin/settings", label: "Settings", icon: Settings },
];

export default function SideMenu() {
    const pathname = usePathname();

    return (
        <nav
            className={[
                // fixed sidebar
                "fixed left-0 top-0 z-40",
                "h-screen w-72",

                // layout / spacing
                "p-6",

                // style
                "bg-white/90 backdrop-blur",
                "border-r border-slate-200",

                // internal layout
                "grid gap-4",
            ].join(" ")}
        >
            {/* Brand */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-transparent to-transparent" />
                    <div className="absolute -right-6 -top-6 h-14 w-14 rounded-full bg-cyan-400/20 blur-xl" />
                </div>

                <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold leading-5 text-slate-900">
                        Nova Forge
                    </div>
                    <div className="truncate text-xs font-medium tracking-wide text-slate-500">
                        SUPER ADMIN
                    </div>
                </div>
            </div>

            {/* Links (scroll si hace falta) */}
            <div className="grid gap-1 overflow-y-auto pr-1">
                {items.map((item) => {
                    const active =
                        pathname === item.href ||
                        (item.href !== "/superadmin" && pathname?.startsWith(item.href));

                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={[
                                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                                "border border-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                                active ? "bg-cyan-50 text-slate-900 border-cyan-100 shadow-sm" : "",
                            ].join(" ")}
                        >
                            <span
                                className={[
                                    "inline-flex h-8 w-8 items-center justify-center rounded-lg transition",
                                    active
                                        ? "bg-white ring-1 ring-cyan-100 text-cyan-700"
                                        : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700 group-hover:ring-1 group-hover:ring-slate-200",
                                ].join(" ")}
                            >
                                <Icon className="h-4 w-4" />
                            </span>

                            <span className="min-w-0 flex-1 truncate">{item.label}</span>

                            <span
                                className={[
                                    "h-1.5 w-1.5 rounded-full transition",
                                    active ? "bg-cyan-500" : "bg-transparent group-hover:bg-slate-300",
                                ].join(" ")}
                                aria-hidden="true"
                            />
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-1 rounded-2xl border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">
                    Tip: usa <span className="font-semibold text-slate-700">⌘K</span> para
                    buscar (si añades command palette).
                </div>
            </div>
        </nav>
    );
}
