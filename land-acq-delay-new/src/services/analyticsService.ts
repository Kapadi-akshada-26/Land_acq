// src/services/analyticsService.ts
import { USE_MOCK, apiFetch } from "./api";
import dataset from "@/data/processedProjects.json";
import { mockRiskTrendOverTime } from "@/mock/mockAnalytics";
import type {
  DashboardStats,
  DelayDriver,
  RiskDistribution,
  StateTrend,
  DistrictTrend,
} from "@/types";
import type { ProjectTypeTrend, RiskTrendPoint } from "@/mock/mockAnalytics";

export async function getDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK) return dataset.stats as DashboardStats;
  try {
    return await apiFetch<DashboardStats>("/api/dashboard/stats");
  } catch {
    return dataset.stats as DashboardStats;
  }
}

export async function getDelayDrivers(): Promise<DelayDriver[]> {
  if (USE_MOCK) return dataset.delayDrivers as DelayDriver[];
  try {
    return await apiFetch<DelayDriver[]>("/api/analytics/delay-drivers");
  } catch {
    return dataset.delayDrivers as DelayDriver[];
  }
}

export async function getRiskDistribution(): Promise<RiskDistribution[]> {
  if (USE_MOCK) return dataset.riskDistribution as RiskDistribution[];
  try {
    return await apiFetch<RiskDistribution[]>("/api/analytics/risk-distribution");
  } catch {
    return dataset.riskDistribution as RiskDistribution[];
  }
}

export async function getStateTrends(): Promise<StateTrend[]> {
  if (USE_MOCK) return dataset.stateTrends as StateTrend[];
  try {
    return await apiFetch<StateTrend[]>("/api/analytics/state-trends");
  } catch {
    return dataset.stateTrends as StateTrend[];
  }
}

export async function getDistrictTrends(): Promise<DistrictTrend[]> {
  if (USE_MOCK) return dataset.districtTrends as DistrictTrend[];
  try {
    return await apiFetch<DistrictTrend[]>("/api/analytics/district-trends");
  } catch {
    return dataset.districtTrends as DistrictTrend[];
  }
}

export async function getProjectTypeTrends(): Promise<ProjectTypeTrend[]> {
  if (USE_MOCK) return dataset.projectTypeTrends as ProjectTypeTrend[];
  try {
    return await apiFetch<ProjectTypeTrend[]>("/api/analytics/project-type-trends");
  } catch {
    return dataset.projectTypeTrends as ProjectTypeTrend[];
  }
}

export async function getRiskTrendOverTime(): Promise<RiskTrendPoint[]> {
  if (USE_MOCK) return mockRiskTrendOverTime;
  try {
    return await apiFetch<RiskTrendPoint[]>("/api/analytics/risk-trend");
  } catch {
    return mockRiskTrendOverTime;
  }
}

