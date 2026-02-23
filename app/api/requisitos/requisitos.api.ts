import { api } from "../axios";

export type RequisitosProyecto = {
    id: string;
    proyectoId: string;

    necesitaLogo: boolean;
    tieneManualMarca: boolean;
    tieneDiseno: boolean;
    disenoPorNosotros: boolean;
    necesitaCopy: boolean;
    tieneDominio: boolean;
    tieneHosting: boolean;
    necesitaSeo: boolean;
    necesitaAnalitica: boolean;
    necesitaMantenimiento: boolean;

    notas: string | null;
    websReferencia: string | null;

    creadoEn: string;
    actualizadoEn: string;
};

export type RequisitosInput = Partial<
    Omit<RequisitosProyecto, "id" | "proyectoId" | "creadoEn" | "actualizadoEn">
>;

export type RequisitosResponse = { requisitos: RequisitosProyecto | null };
export type RequisitosWriteResponse = { requisitos: RequisitosProyecto };


export const requisitosApi = {
    // GET /proyectos/:id/requisitos
    get: async (proyectoId: string) => {
        const { data } = await api.get<RequisitosResponse>(`/proyectos/${proyectoId}/requisitos`);
        return data;
    },

    // POST /proyectos/:id/requisitos (bloqueado si hay presupuesto)
    create: async (proyectoId: string, input: RequisitosInput) => {
        const { data } = await api.post<RequisitosWriteResponse>(`/proyectos/${proyectoId}/requisitos`, input);
        return data;
    },

    // PUT /proyectos/:id/requisitos (bloqueado si hay presupuesto)
    update: async (proyectoId: string, input: RequisitosInput) => {
        const { data } = await api.put<RequisitosWriteResponse>(`/proyectos/${proyectoId}/requisitos`, input);
        return data;
    },
};
