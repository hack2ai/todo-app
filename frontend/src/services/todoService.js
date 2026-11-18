import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "/api/todos";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Intercept responses to normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

const todoService = {
  // GET /api/todos  — supports query params: search, status, priority, page, limit
  getAll: (params = {}) => api.get("", { params }),

  // GET /api/todos/stats
  getStats: () => api.get("/stats"),

  // GET /api/todos/:id
  getById: (id) => api.get(`/${id}`),

  // POST /api/todos
  create: (data) => api.post("", data),

  // PUT /api/todos/:id
  update: (id, data) => api.put(`/${id}`, data),

  // PATCH /api/todos/:id/status
  updateStatus: (id, status) => api.patch(`/${id}/status`, { status }),

  // DELETE /api/todos/:id
  delete: (id) => api.delete(`/${id}`),
};

export default todoService;
