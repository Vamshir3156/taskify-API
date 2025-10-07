import axios from "axios";

const API = axios.create({ baseURL: "/api" }); // The proxy will handle the domain

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers["x-auth-token"] = localStorage.getItem("token");
  }
  return req;
});

export const register = (formData) => API.post("/auth/register", formData);
export const login = (formData) => API.post("/auth/login", formData);

export const getTasks = () => API.get("/tasks");
export const createTask = (taskData) => API.post("/tasks", taskData);
export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
