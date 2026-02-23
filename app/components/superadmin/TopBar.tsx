"use client";

import { useRouter } from "next/navigation";
import { LogOut, Shield, User } from "lucide-react";
import { useSessionStore } from "../../store/session.store";

export default function TopBar() {
    const router = useRouter();
    const user = useSessionStore((s) => s.user);
    const logout = useSessionStore((s) => s.logout);

    const onLogout = async () => {
        await logout();
        router.push("/");
    };

    const fullName = user ? `${user.nombre} ${user.apellido}` : "—";
    const initial = user?.nombre?.charAt(0)?.toUpperCase() ?? "?";

    return (
        <div className="flex w-full items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 ring-1 ring-cyan-100">
                    <Shield className="h-5 w-5 text-cyan-600" />
                </span>

                <div className="leading-tight">
                    <p className="text-xs font-medium text-slate-500">Panel</p>
                    <p className="text-sm font-semibold text-slate-900">
                        Super Admin
                    </p>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {/* User */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                        {initial}
                    </span>

                    <span className="max-w-[160px] truncate text-sm text-slate-700">
                        {fullName}
                    </span>

                    <User className="h-4 w-4 text-slate-400" />
                </div>

                {/* Logout */}
                <button
                    onClick={onLogout}
                    className="
            inline-flex items-center gap-2 rounded-xl
            border border-slate-200 bg-white px-3 py-2
            text-sm font-semibold text-slate-700
            transition
            hover:border-red-200 hover:bg-red-50 hover:text-red-600
            focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40
            focus-visible:ring-offset-2 focus-visible:ring-offset-white
          "
                >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </div>
    );
}
