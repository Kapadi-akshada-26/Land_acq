// src/services/api.ts
// Base API layer — checks NEXT_PUBLIC_USE_MOCK_API to decide mock vs real FastAPI

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export { USE_MOCK, API_BASE };

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
