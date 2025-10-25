// src/lib/roles.ts
export type AppRole = "user" | "guest";
export const ROLE_STORAGE_KEY = "role";

export function getStoredRole(): AppRole | null {
  if (typeof window === "undefined") return null;
  const r = localStorage.getItem(ROLE_STORAGE_KEY);
  return r === "user" || r === "guest" ? r : null;
}

export function setStoredRole(role: AppRole) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_STORAGE_KEY, role);
  document.cookie = `role=${role}; Path=/; SameSite=Lax`;
}

export function clearStoredRole() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ROLE_STORAGE_KEY);
  document.cookie = "role=; Path=/; Max-Age=0; SameSite=Lax";
}

export const can = {
  view: (_role: AppRole) => true,              
  create:  (role: AppRole) => role === "user", 
  edit:    (role: AppRole) => role === "user",
  manage:  (role: AppRole) => role === "user",
};
