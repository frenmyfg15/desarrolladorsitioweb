import { api } from "../axios";

/**
 * ===== Tipos base =====
 */
export type Empresa = {
    id: string;
    nombre: string;
    cif: string | null;
    correo: string | null;
    telefono: string | null;
    usuarioId: string;
    creadoEn: string;
    actualizadoEn: string;
};

export type CreateEmpresaInput = {
    nombre: string;
    cif?: string;
    correo?: string;
    telefono?: string;
};

export type UpdateEmpresaInput = {
    nombre?: string;
    cif?: string;
    correo?: string;
    telefono?: string;
};

/**
 * ===== Tipos ADMIN/SUPER_ADMIN (incluye relaciones) =====
 */
export type EmpresaUsuarioItem = {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string | null;
    rolGlobal: "SUPER_ADMIN" | "ADMIN" | "USUARIO";
    creadoEn?: string; // por si lo incluyes en el backend
};

export type EmpresaProyectoItem = {
    id: string;
    nombre: string;
    descripcion: string | null;
    tipo: "WEB" | "APP";
    aprobado: boolean;
    creadoEn: string;
    actualizadoEn: string;
};

export type EmpresaWithUsuario = Empresa & {
    usuario: EmpresaUsuarioItem;
};

export type EmpresaDetail = EmpresaWithUsuario & {
    proyectos: EmpresaProyectoItem[];
};

/**
 * ===== Responses =====
 */
export type EmpresaResponse = { empresa: Empresa };
export type EmpresasResponse = { empresas: EmpresaWithUsuario[] };
export type EmpresaDetailResponse = { empresa: EmpresaDetail };

/**
 * ===== API =====
 * - USUARIO: /empresa/me (su propia empresa)
 * - SUPER_ADMIN/ADMIN: /empresa (listado) y /empresa/:id (detalle)
 */
export const empresaApi = {
    /**
     * ===== USUARIO =====
     */

    // POST /empresa  (solo USUARIO)
    create: async (input: CreateEmpresaInput) => {
        const { data } = await api.post<EmpresaResponse>("/empresa", input);
        return data;
    },

    // GET /empresa/me
    me: async () => {
        const { data } = await api.get<EmpresaResponse>("/empresa/me");
        return data;
    },

    // PUT /empresa/me
    updateMe: async (input: UpdateEmpresaInput) => {
        const { data } = await api.put<EmpresaResponse>("/empresa/me", input);
        return data;
    },

    // DELETE /empresa/me
    deleteMe: async () => {
        await api.delete("/empresa/me");
        return;
    },

    /**
     * ===== SUPER_ADMIN / ADMIN =====
     */

    // GET /empresa → listar todas las empresas
    list: async () => {
        const { data } = await api.get<EmpresasResponse>("/empresa");
        return data.empresas;
    },

    // GET /empresa/:empresaId → detalle con usuario + proyectos
    getById: async (empresaId: string) => {
        const { data } = await api.get<EmpresaDetailResponse>(`/empresa/${empresaId}`);
        return data.empresa;
    },
};
