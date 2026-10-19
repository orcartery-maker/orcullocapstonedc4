import axios from "axios";

// The API address comes from VITE_API_URL (see .env.example) so the same
// build can run locally, on a phone, or on a hosted server.
export const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Where uploaded place images are served from.
export const STORAGE_URL =
    import.meta.env.VITE_STORAGE_URL ||
    `${API_URL.replace(/\/api\/?$/, "")}/storage`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Routes use the URL hash (HashRouter), so redirect via the hash.
            window.location.hash = "#/login";
        }

        return Promise.reject(error);
    }
);

export default api;