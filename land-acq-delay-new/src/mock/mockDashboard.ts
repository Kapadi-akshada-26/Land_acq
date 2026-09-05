// src/mock/mockDashboard.ts
import type { DashboardStats, DelayDriver, RiskDistribution, StateTrend, DistrictTrend } from "@/types";

export const mockDashboardStats: DashboardStats = {
  totalProjects: 1248,
  criticalHighRisk: 176,
  mediumRisk: 386,
  onTrack: 686,
  avgDelayProbability: 64.8,
};

export const mockDelayDrivers: DelayDriver[] = [
  { name: "Legal Disputes / Court Cases", percentage: 78, projectCount: 973 },
  { name: "Compensation Pending", percentage: 71, projectCount: 886 },
  { name: "Pending Approvals", percentage: 64, projectCount: 799 },
  { name: "Ownership Disputes", percentage: 52, projectCount: 649 },
  { name: "Incomplete Documentation", percentage: 44, projectCount: 549 },
  { name: "R&R Incomplete", percentage: 38, projectCount: 474 },
  { name: "Forest / Env. Clearance", percentage: 29, projectCount: 362 },
];

export const mockRiskDistribution: RiskDistribution[] = [
  { level: "Critical", count: 89, percentage: 7.1 },
  { level: "High", count: 87, percentage: 7.0 },
  { level: "Medium", count: 386, percentage: 30.9 },
  { level: "Low", count: 686, percentage: 55.0 },
];

export const mockStateTrends: StateTrend[] = [
  { name: "Nashik", avgDelayProbability: 74, projectCount: 142, highRiskCount: 38 },
  { name: "Pune", avgDelayProbability: 68, projectCount: 189, highRiskCount: 31 },
  { name: "Nagpur", avgDelayProbability: 55, projectCount: 97, highRiskCount: 18 },
  { name: "Thane", avgDelayProbability: 48, projectCount: 124, highRiskCount: 14 },
  { name: "Aurangabad", avgDelayProbability: 43, projectCount: 76, highRiskCount: 10 },
  { name: "Solapur", avgDelayProbability: 38, projectCount: 61, highRiskCount: 7 },
  { name: "Kolhapur", avgDelayProbability: 31, projectCount: 52, highRiskCount: 4 },
];

export const mockDistrictTrends: DistrictTrend[] = [
  { name: "Nashik Rural", state: "Maharashtra", avgDelayProbability: 82, projectCount: 34 },
  { name: "Bhiwandi", state: "Maharashtra", avgDelayProbability: 76, projectCount: 22 },
  { name: "Pune Urban", state: "Maharashtra", avgDelayProbability: 71, projectCount: 41 },
  { name: "Navi Mumbai", state: "Maharashtra", avgDelayProbability: 63, projectCount: 19 },
  { name: "Nagpur Rural", state: "Maharashtra", avgDelayProbability: 58, projectCount: 28 },
  { name: "Amravati", state: "Maharashtra", avgDelayProbability: 47, projectCount: 15 },
  { name: "Osmanabad", state: "Maharashtra", avgDelayProbability: 39, projectCount: 11 },
];
