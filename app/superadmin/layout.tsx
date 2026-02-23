import type { ReactNode } from "react";
import SuperAdminShell from "../components/superadmin/SuperAdminShell";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
    return <SuperAdminShell>{children}</SuperAdminShell>;
}
