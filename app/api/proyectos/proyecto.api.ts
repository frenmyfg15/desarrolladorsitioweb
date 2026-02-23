import { api } from "../axios";

export type TipoProyecto = "WEB" | "APP";

export type Proyecto = {
    id: string;
    nombre: string;
    descripcion: string | null;
    tipo: TipoProyecto;

    empresaId: string;

    aprobado: boolean;
    aprobadoEn: string | null;
    aprobadoPorId: string | null;

    creadoEn: string;
    actualizadoEn: string;
};

export type CreateProyectoInput = {
    nombre: string;
    descripcion?: string;
    tipo: TipoProyecto;
};

export type ProyectoResponse = { proyecto: Proyecto };
export type ProyectosResponse = { proyectos: Proyecto[] };


export const proyectoApi = {
    // POST /proyectos (USUARIO o SUPER_ADMIN)
    create: async (input: CreateProyectoInput) => {
        const { data } = await api.post<ProyectoResponse>("/proyectos", input);
        return data;
    },

    // GET /proyectos (SUPER_ADMIN ve todo, USUARIO ve los suyos)
    list: async () => {
        const { data } = await api.get<ProyectosResponse>("/proyectos");
        return data;
    },

    // GET /proyectos/:id (detalle con requisitos/presupuesto/fases si lo implementaste)
    getById: async (id: string) => {
        const { data } = await api.get<{ proyecto: any }>(`/proyectos/${id}`);
        return data;
    },

    // PATCH /proyectos/:id/aprobar (solo SUPER_ADMIN)
    approve: async (id: string) => {
        const { data } = await api.patch<ProyectoResponse>(`/proyectos/${id}/aprobar`);
        return data;
    },

    // DELETE /proyectos/:id (USUARIO o SUPER_ADMIN, solo si no tiene facturas)
    delete: async (id: string) => {
        await api.delete(`/proyectos/${id}`);
        return;
    },
    createForEmpresa: async (empresaId: string, input: CreateProyectoInput) => {
        const { data } = await api.post<ProyectoResponse>(`/empresa/${empresaId}/proyectos`, input);
        return data;
    },
};
