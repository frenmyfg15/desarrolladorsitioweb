import { api } from "../axios";

export type EstadoFase = "EN_PROCESO" | "LISTO_PENDIENTE_PAGO" | "LISTO_PAGADO";

export type Fase = {
    id: string;
    proyectoId: string;
    nombre: string;
    descripcion: string | null;
    estado: EstadoFase;

    urlEntrega: string | null;
    entregadoEn: string | null;
    orden: number | null;

    creadoEn: string;
    actualizadoEn: string;
};

export type CreateFaseInput = {
    nombre: string;
    descripcion?: string;
    orden?: number;
};

export type UpdateFaseInput = {
    nombre?: string;
    descripcion?: string;
    estado?: EstadoFase;
    urlEntrega?: string;
    entregadoEn?: string | null;
    orden?: number | null;
};

export type FasesResponse = { fases: Fase[] };
export type FaseResponse = { fase: Fase };


export const faseApi = {
    // GET /proyectos/:id/fases
    listByProyecto: async (proyectoId: string) => {
        const { data } = await api.get<FasesResponse>(`/proyectos/${proyectoId}/fases`);
        return data;
    },

    // POST /proyectos/:id/fases (solo SUPER_ADMIN)
    create: async (proyectoId: string, input: CreateFaseInput) => {
        const { data } = await api.post<FaseResponse>(`/proyectos/${proyectoId}/fases`, input);
        return data;
    },

    // PUT /proyectos/fases/:faseId (solo SUPER_ADMIN)
    update: async (faseId: string, input: UpdateFaseInput) => {
        const { data } = await api.put<FaseResponse>(`/proyectos/fases/${faseId}`, input);
        return data;
    },

    // DELETE /proyectos/fases/:faseId (solo SUPER_ADMIN)
    delete: async (faseId: string) => {
        await api.delete(`/proyectos/fases/${faseId}`);
        return;
    },
};
