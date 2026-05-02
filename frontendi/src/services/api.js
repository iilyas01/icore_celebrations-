import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: false
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Format API error detail
export const formatApiErrorDetail = (detail) => {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
};

// Themes
export const getThemes = () => api.get('/themes');
export const getTheme = (id) => api.get(`/themes/${id}`);

// Venues
export const getVenues = () => api.get('/venues');
export const getVenue = (id) => api.get(`/venues/${id}`);

// Services
export const getServices = () => api.get('/services');
export const getService = (id) => api.get(`/services/${id}`);

// Packages
export const getPackages = () => api.get('/packages');
export const getPackage = (id) => api.get(`/packages/${id}`);

// Plans
export const getPlans = () => api.get('/plans/my');
export const getPlan = (id) => api.get('/plans/my');
export const createPlan = (data) => api.post('/plans/theme', data);
export const addPackageToPlan = (planId, data) => api.post('/plans/packages', data);
export const addServiceToPlan = (planId, data) => api.post('/plans/services', data);
export const removePackageFromPlan = (planId, packageId) => api.delete(`/plans/packages/${packageId}`);
export const removeServiceFromPlan = (planId, serviceId) => api.delete(`/plans/services/${serviceId}`);
export const deletePlan = () => api.delete('/plans/my');

// Orders
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);

// Checkout
export const createCheckoutSession = (data) => api.post('/checkout/create-session', data);
export const getCheckoutStatus = (sessionId) => api.get(`/checkout/status/${sessionId}`);

// Admin
export const adminGetOrders = () => api.get('/admin/orders');
export const adminApproveOrder = (orderId, data) => api.post(`/admin/orders/${orderId}/approve`, data);
export const adminGetStats = () => api.get('/admin/stats');

export default api;