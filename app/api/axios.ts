import axios from "axios";

const local = false

const URL = local ? "http://localhost:4000" : "https://novaforge-serve-production.up.railway.app/"

export const api = axios.create({
    baseURL: URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});