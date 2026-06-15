
import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});



// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authToken");

            // Optional: clear other user data
            localStorage.removeItem("role");

            window.location.href = "/"; // Redirect to login page
        }

        return Promise.reject(error);
    }
);

export default api;