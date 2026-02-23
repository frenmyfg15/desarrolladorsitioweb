import { api } from "../axios";

// ================================
// Types
// ================================
export type RolGlobal = "SUPER_ADMIN" | "ADMIN" | "USUARIO";

export type UsuarioEmpresaMini = {
    id: string;
    nombre: string;
};

export type UsuarioListItem = {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string | null;
    rolGlobal: RolGlobal;
    creadoEn: string;
    actualizadoEn: string;
    empresa: UsuarioEmpresaMini | null;
};

export type UsuarioDetail = {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string | null;
    rolGlobal: RolGlobal;

    googleId: string | null;
    imagenUrl: string | null;

    creadoEn: string;
    actualizadoEn: string;

    empresa: null | {
        id: string;
        nombre: string;
        cif: string | null;
        correo: string | null;
        telefono: string | null;
        creadoEn: string;
        actualizadoEn: string;
        _count: {
            proyectos: number;
            facturas: number;
            presupuestos: number;
        };
    };

    _count: {
        proyectos: number;
        presupuestos: number;
    };
};

// Query params para list
export type ListUsuariosParams = {
    page?: number;
    pageSize?: number;
    q?: string;
    rolGlobal?: RolGlobal;
    tieneEmpresa?: boolean;
};

export type ListUsuariosResponse = {
    usuarios: UsuarioListItem[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
};

export type UpdateRolInput = { rolGlobal: RolGlobal };

// ✅ NUEVO: crear usuario (SUPER_ADMIN) con password opcional
export type CreateUsuarioInput = {
    nombre: string;
    apellido: string;
    correo: string;
    telefono?: string;
    rolGlobal?: RolGlobal;

    // password opcional (si lo mandas, el backend crea hashContrasena)
    password?: string;
};

export type CreateUsuarioResponse = { usuario: UsuarioListItem };

// ✅ NUEVO: set/reset password
export type SetPasswordInput = { password: string };
export type SetPasswordResponse = { ok: true };

// Empresa para usuario (ya lo usas)
export type CreateEmpresaForUsuarioInput = {
    nombre: string;
    cif?: string;
    correo?: string;
    telefono?: string;
};

export type CreateEmpresaForUsuarioResponse = {
    empresa: {
        id: string;
        nombre: string;
        cif: string | null;
        correo: string | null;
        telefono: string | null;
        usuarioId: string;
        creadoEn: string;
        actualizadoEn: string;
    };
};

// ================================
// API
// ================================
export const usuarioApi = {
    // GET /usuarios?page=&pageSize=&q=&rolGlobal=&tieneEmpresa=
    list: async (params: ListUsuariosParams) => {
        const { data } = await api.get<ListUsuariosResponse>("/usuarios", { params });
        return data;
    },

    // GET /usuarios/:id
    getById: async (id: string) => {
        const { data } = await api.get<{ usuario: UsuarioDetail }>(`/usuarios/${id}`);
        return data.usuario;
    },

    // PATCH /usuarios/:id/rol  (solo SUPER_ADMIN en backend)
    updateRol: async (id: string, input: UpdateRolInput) => {
        const { data } = await api.patch<{ usuario: UsuarioListItem }>(`/usuarios/${id}/rol`, input);
        return data.usuario;
    },

    // POST /usuarios  (solo SUPER_ADMIN) ✅ NUEVO
    create: async (input: CreateUsuarioInput) => {
        const { data } = await api.post<CreateUsuarioResponse>("/usuarios", input);
        return data.usuario;
    },

    // PATCH /usuarios/:id/password  (solo SUPER_ADMIN) ✅ NUEVO
    setPassword: async (id: string, input: SetPasswordInput) => {
        const { data } = await api.patch<SetPasswordResponse>(`/usuarios/${id}/password`, input);
        return data;
    },

    // POST /usuarios/:id/empresa (solo SUPER_ADMIN) — si ya lo tenías así
    createEmpresaForUsuario: async (usuarioId: string, input: CreateEmpresaForUsuarioInput) => {
        const { data } = await api.post<CreateEmpresaForUsuarioResponse>(
            `/usuarios/${usuarioId}/empresa`,
            input
        );
        return data.empresa;
    },
};
