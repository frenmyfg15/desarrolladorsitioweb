'use client'

import { MetricPresupuestos } from "../components/superadmin/metrics/MetricPresupuestos";
import { MetricProyectos } from "../components/superadmin/metrics/MetricProyectos";


export default function SuperAdminHomePage() {
    return (
        <div style={{ padding: 24, display: "grid", gap: 16 }}>
            <div>
                <h1 style={{ margin: 0 }}>Resumen</h1>
                <p style={{ margin: "6px 0 0", color: "#6b7280" }}>Dashboard principal del SUPER_ADMIN.</p>
            </div>

            {/* Categoría: Proyectos */}
            <MetricProyectos />

            {/* Categoría: Presupuestos */}
            <MetricPresupuestos />

            {/* Aquí luego meteremos otras categorías: Facturas, Usuarios, Empresas, etc */}
        </div>
    );
}
