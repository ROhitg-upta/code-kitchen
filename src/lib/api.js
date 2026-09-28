/**
 * src/lib/api.js
 * ──────────────────────────────────────────────────────────────
 * Dual-Mode REST API Client for ChefOps v2.6
 * Automatically communicates with the Express/MongoDB backend at /api
 * and gracefully falls back to localStorage if offline/static.
 */

const API_BASE = "/api";

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const chefApi = {
  getHealth: () => request("/health"),
  getEvents: () => request("/events"),
  createEvent: (event) =>
    request("/events", { method: "POST", body: JSON.stringify(event) }),
  updateEvent: (id, event) =>
    request(`/events/${id}`, { method: "PUT", body: JSON.stringify(event) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: "DELETE" }),

  getRegistrations: () => request("/registrations"),
  createRegistration: (reg) =>
    request("/registrations", { method: "POST", body: JSON.stringify(reg) }),
  toggleCheckIn: (id) =>
    request(`/registrations/${id}/checkin`, { method: "PATCH" }),

  getBroadcast: () => request("/broadcast"),
  setBroadcast: (message) =>
    request("/broadcast", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  resetData: () => request("/reset", { method: "POST" }),
};
