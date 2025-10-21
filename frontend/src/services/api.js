// frontend/src/services/api.js
import axios from "axios";

// Prefer env var in prod, fall back to sensible local defaults in dev.
const PROD_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const LOCAL_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "/api"; // last-resort fallback if you do SSR/proxy

const API_BASE = PROD_BASE || LOCAL_BASE;

const API = axios.create({
  baseURL: API_BASE,
  // timeout: 15000, // optional
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers["x-auth-token"] = token; // matches your authMiddleware
  return req;
});

// Auth
export const register = (formData) => API.post("/auth/register", formData);
export const login = (formData) => API.post("/auth/login", formData);

// Tasks
export const getTasks = () => API.get("/tasks");
export const createTask = (taskData) => API.post("/tasks", taskData);
export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;
