import axios from "axios";

const PROD_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const LOCAL_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "/api";

const API_BASE = PROD_BASE || LOCAL_BASE;

const API = axios.create({
  baseURL: API_BASE,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers["x-auth-token"] = token;
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
