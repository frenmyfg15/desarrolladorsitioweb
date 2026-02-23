import { api } from "../axios";


export type AceptadoPor = "CLIENTE" | "SUPER_ADMIN";

export type Presupuesto = {
    id: string;
    empresaId: string;
    proyectoId: string;

    moneda: string;
    total: string;   // Decimal como string
    pagado: string;  // Decimal como string
    notas: string | null;

    aceptado: boolean;
    aceptadoEn: string | null;
    aceptadoPor: AceptadoPor | null;
    aceptadoPorId: string | null;

    creadoEn: string;
    actualizadoEn: string;
};

export type CreatePresupuestoInput = {
    total: string;
    moneda?: string;
    notas?: string;
};

export type UpdatePresupuestoInput = {
    pagado?: string;
    notas?: string;
    moneda?: string;
};

export type PresupuestoResponse = { presupuesto: Presupuesto | null };
export type PresupuestoWriteResponse = { presupuesto: Presupuesto };


export const presupuestoApi = {
    // GET /proyectos/:id/presupuesto
    get: async (proyectoId: string) => {
        const { data } = await api.get<PresupuestoResponse>(`/proyectos/${proyectoId}/presupuesto`);
        return data;
    },

    // POST /proyectos/:id/presupuesto (solo SUPER_ADMIN)
    create: async (proyectoId: string, input: CreatePresupuestoInput) => {
        const { data } = await api.post<PresupuestoWriteResponse>(`/proyectos/${proyectoId}/presupuesto`, input);
        return data;
    },

    // PUT /proyectos/:id/presupuesto (solo SUPER_ADMIN)
    update: async (proyectoId: string, input: UpdatePresupuestoInput) => {
        const { data } = await api.put<PresupuestoWriteResponse>(`/proyectos/${proyectoId}/presupuesto`, input);
        return data;
    },

    // PATCH /proyectos/:id/presupuesto/aceptar (USUARIO o SUPER_ADMIN)
    aceptar: async (proyectoId: string) => {
        const { data } = await api.patch<PresupuestoWriteResponse>(`/proyectos/${proyectoId}/presupuesto/aceptar`);
        return data;
    },

    // DELETE /proyectos/:id/presupuesto (solo SUPER_ADMIN; solo si no aceptado y pagado=0)
    delete: async (proyectoId: string) => {
        await api.delete(`/proyectos/${proyectoId}/presupuesto`);
        return;
    },
};
