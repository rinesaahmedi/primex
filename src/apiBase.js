// Helper to build API URLs. Defaults to same-origin; can override with VITE_API_BASE.
const API_BASE = import.meta.env.VITE_API_BASE || "";

export const apiUrl = (path = "") => `${API_BASE}${path}`;
