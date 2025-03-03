import axios from "axios";

export const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token to Requests
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized Access (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || { error: "Network error" });
  }
);

/** 🔹🔹 AUTH API 🔹🔹 **/
export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (data) => api.post("/auth/register", data);
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });

/** 🔹🔹 EVENTS API 🔹🔹 **/
export const getEvents = () => api.get("/events");
export const getAllEvents = () => api.get("/events/all");
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post("/events", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateEvent = (id, data) => api.put(`/events/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteEvent = (id) => api.delete(`/events/${id}`);

/** 🔹🔹 BOOKINGS API 🔹🔹 **/
export const createBooking = (data) => api.post("/bookings", data);

/** 🔹🔹 PAYMENTS API 🔹🔹 **/
export const createPayment = (data) => api.post("/payments/checkout", data);
export const getUserPayments = () => api.get("/payments/user");

/** 🔹🔹 USERS API 🔹🔹 **/
export const getUserProfile = () => api.get("/users/profile");
export const getAllUsers = () => api.get("/users");  // ✅ Fetch all users
export const deleteUser = (id) => api.delete(`/users/${id}`);  // ✅ Delete user by ID

export default api;
