"use client";

import type { ReactNode } from "react";
import SideMenu from "./SideMenu";
import TopBar from "./TopBar";
import { GripVertical, Sparkles } from "lucide-react";

export default function SuperAdminShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="grid min-h-screen grid-cols-[280px_1fr]">
                {/* Sidebar */}
                <aside className="relative border-r border-slate-200 bg-white">
                    {/* Accent strip */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500/90" />

                    {/* Subtle header area */}
                    <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 ring-1 ring-cyan-100">
                            <Sparkles className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold leading-5">
                                Super Admin
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                Panel de control
                            </p>
                        </div>

                        <div className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400">
                            <GripVertical className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="p-3">
                        <div className="rounded-2xl bg-white">
                            <SideMenu />
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <div className="grid grid-rows-[64px_1fr]">
                    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                        <div className="flex h-16 items-center px-4">
                            <TopBar />
                        </div>
                    </header>

                    <main className="p-4 md:p-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
