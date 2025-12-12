// Helper to build API URLs. Defaults to same-origin; can override with VITE_API_BASE.
// During development we want to talk to the Express API on port 5000 so we fall back there.
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.MODE === "development" ? "http://localhost:5000" : "");

export const apiUrl = (path = "") => `${API_BASE}${path}`;
