const configuredApiUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const API_URL = configuredApiUrl.endsWith("/api") ? configuredApiUrl : `${configuredApiUrl}/api`;

export function saveAuth(auth) {
  localStorage.setItem("authToken", auth.token);
  localStorage.setItem("userId", auth.user.id);
}

export function clearAuth() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
}

export function getStoredToken() {
  return localStorage.getItem("authToken");
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith("/auth/login")) {
      clearAuth();
      window.dispatchEvent(new Event("auth-expired"));
    }
    throw new Error(body.message || "The server could not complete your request.");
  }
  return body;
}

export const api = {
  getProducts: () => request("/products"),
  register: (details) => request("/auth/register", { method: "POST", body: JSON.stringify(details) }),
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  getMe: () => request("/auth/me"),
  updateProfile: (profile) => request("/auth/profile", { method: "PATCH", body: JSON.stringify(profile) }),
  createOrder: (order) => request("/orders", { method: "POST", body: JSON.stringify(order) }),
  getMyOrders: () => request("/orders/mine"),
  getAllOrders: () => request("/orders"),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  getAdminSummary: () => request("/admin/summary"),
  getAdminProducts: () => request("/admin/products"),
  addProductStock: (id, quantity) => request(`/admin/products/${id}/stock`, { method: "POST", body: JSON.stringify({ quantity }) }),
  updateProductInventory: (id, inventory) => request(`/admin/products/${id}/inventory`, { method: "PATCH", body: JSON.stringify(inventory) }),
  createProduct: (product) => request("/admin/products", { method: "POST", body: JSON.stringify(product) }),
};
