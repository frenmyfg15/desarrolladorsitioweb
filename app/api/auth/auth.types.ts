import { RolGlobal } from "./rolGlobal.types";


export type LoginInput = {
    correo: string;
    contrasena: string;
};

export type PublicUser = {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string | null;
    imagenUrl: string | null;
    rolGlobal: RolGlobal;
    creadoEn: string;       // ISO
    actualizadoEn: string;  // ISO
};

export type LoginResponse = {
    user: PublicUser;
};

export type MeResponse = {
    user: PublicUser;
};

export type LogoutResponse = {
    message: string;
};
