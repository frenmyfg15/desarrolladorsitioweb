import { api } from "../axios";

/**
 * ===== Tipos base =====
 * Nota: Decimal del backend llega como string (importe, etc.)
 */
export type Factura = {
    id: string;
    empresaId: string;
    faseId: string;

    numero: string | null;
    moneda: string;
    importe: string;

    emitidaEn: string;
    venceEn: string | null;
    pagadaEn: string | null;
    pdfUrl: string | null;

    creadoEn: string;
    actualizadoEn: string;

    // si incluyes fase en el backend:
    fase?: {
        id: string;
        nombre: string;
        proyectoId: string;
    };
};

/**
 * ===== Tipos ADMIN/SUPER_ADMIN (incluye relaciones) =====
 * Para la página de superadmin necesitamos empresa + proyecto
 */
export type FacturaEmpresaItem = {
    id: string;
    nombre: string;
    correo?: string | null;
    telefono?: string | null;
};

export type FacturaProyectoItem = {
    id: string;
    nombre: string;
    tipo?: "WEB" | "APP";
    aprobado?: boolean;
};

export type FacturaFaseItem = {
    id: string;
    nombre: string;
    proyectoId: string;
    proyecto?: FacturaProyectoItem | null;
};

export type FacturaAdmin = Factura & {
    empresa?: FacturaEmpresaItem;
    fase?: FacturaFaseItem;
    // si usas proyectoId en Factura (opcional en tu schema)
    proyecto?: FacturaProyectoItem | null;
};

export type FacturasMeta = {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

/**
 * ===== Inputs =====
 */
export type CreateFacturaInput = {
    importe: string;
    moneda?: string;
    numero?: string;
    venceEn?: string; // ISO string
    pdfUrl?: string;
};

export type MarcarPagadaInput = { pagada: boolean };

/**
 * ===== Responses =====
 */
export type FacturasResponse = { facturas: Factura[] };
export type FacturaResponse = { factura: Factura };

export type FacturasAdminResponse = {
    facturas: FacturaAdmin[];
    meta: FacturasMeta;
};

export type FacturaAdminResponse = { factura: FacturaAdmin };

/**
 * ===== API =====
 * - USUARIO: /facturas/me
 * - SUPER_ADMIN/ADMIN: /facturas (listado global) y /facturas/:id (detalle)
 */
export const facturaApi = {
    /**
     * ===== USUARIO =====
     */

    // GET /facturas/me (cliente ve las suyas)
    listMine: async () => {
        const { data } = await api.get<FacturasResponse>("/facturas/me");
        return data.facturas;
    },

    /**
     * ===== SUPER_ADMIN / ADMIN =====
     */

    // GET /facturas → listado global con filtros + paginación
    // Filtros soportados por backend recomendado:
    // - empresaId, estado("pagadas"|"pendientes"), q, desde, hasta, page, pageSize
    listAdmin: async (params?: {
        empresaId?: string;
        estado?: "pagadas" | "pendientes";
        q?: string;
        desde?: string; // ISO date
        hasta?: string; // ISO date
        page?: number;
        pageSize?: number;
    }) => {
        const { data } = await api.get<FacturasAdminResponse>("/facturas", { params });
        return data;
    },

    // GET /facturas/:facturaId → detalle (empresa + fase + proyecto)
    getByIdAdmin: async (facturaId: string) => {
        const { data } = await api.get<FacturaAdminResponse>(`/facturas/${facturaId}`);
        return data.factura;
    },

    /**
     * ===== SUPER_ADMIN =====
     */

    // POST /facturas/fase/:faseId (solo SUPER_ADMIN)
    createForFase: async (faseId: string, input: CreateFacturaInput) => {
        const { data } = await api.post<FacturaResponse>(`/facturas/fase/${faseId}`, input);
        return data.factura;
    },

    // PATCH /facturas/:facturaId/pagada (solo SUPER_ADMIN)
    marcarPagada: async (facturaId: string, input: MarcarPagadaInput) => {
        const { data } = await api.patch<FacturaResponse>(`/facturas/${facturaId}/pagada`, input);
        return data.factura;
    },
};
