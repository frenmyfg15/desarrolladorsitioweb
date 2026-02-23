import type { AxiosError } from "axios";
import { api } from "./axios";

api.interceptors.response.use(
    (res) => res,
    (err: AxiosError<any>) => {
        // backend devuelve { message }
        const message = (err.response?.data as any)?.message ?? "Error de red";
        return Promise.reject(new Error(message));
    }
);
