// src/services/alertService.ts
import { USE_MOCK, apiFetch } from "./api";
import dataset from "@/data/processedProjects.json";
import type { Alert } from "@/types";

const alertsList = dataset.alerts as Alert[];

export async function getAlerts(): Promise<Alert[]> {
  if (USE_MOCK) return alertsList;
  try {
    return await apiFetch<Alert[]>("/api/alerts");
  } catch {
    return alertsList;
  }
}

export async function getRecentAlerts(limit = 5): Promise<Alert[]> {
  const recent = alertsList.slice(0, limit);
  if (USE_MOCK) return recent;
  try {
    return await apiFetch<Alert[]>(`/api/alerts/recent?limit=${limit}`);
  } catch {
    return recent;
  }
}

