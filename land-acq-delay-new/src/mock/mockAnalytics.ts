// src/mock/mockAnalytics.ts
import type { StateTrend } from "@/types";

export interface ProjectTypeTrend {
  type: string;
  avgDelayProbability: number;
  totalProjects: number;
  highRisk: number;
  avgDelayDays: number;
}

export interface RiskTrendPoint {
  month: string;       // "Jan 2025"
  critical: number;
  high: number;
  medium: number;
  low: number;
  avgProbability: number;
}

export const mockProjectTypeTrends: ProjectTypeTrend[] = [
  { type: "Highway",            avgDelayProbability: 72, totalProjects: 312, highRisk: 89, avgDelayDays: 118 },
  { type: "Industrial Corridor",avgDelayProbability: 68, totalProjects: 198, highRisk: 62, avgDelayDays: 104 },
  { type: "Metro Rail",         avgDelayProbability: 61, totalProjects: 143, highRisk: 41, avgDelayDays: 87  },
  { type: "Airport",            avgDelayProbability: 74, totalProjects: 87,  highRisk: 31, avgDelayDays: 126 },
  { type: "Irrigation",         avgDelayProbability: 44, totalProjects: 224, highRisk: 28, avgDelayDays: 61  },
  { type: "Railway",            avgDelayProbability: 58, totalProjects: 167, highRisk: 38, avgDelayDays: 82  },
  { type: "Power Plant",        avgDelayProbability: 51, totalProjects: 117, highRisk: 21, avgDelayDays: 73  },
];

export const mockRiskTrendOverTime: RiskTrendPoint[] = [
  { month: "Oct 2024", critical: 41, high: 62, medium: 298, low: 741, avgProbability: 52.1 },
  { month: "Nov 2024", critical: 48, high: 67, medium: 311, low: 718, avgProbability: 54.4 },
  { month: "Dec 2024", critical: 52, high: 71, medium: 324, low: 699, avgProbability: 56.2 },
  { month: "Jan 2025", critical: 58, high: 74, medium: 338, low: 676, avgProbability: 58.3 },
  { month: "Feb 2025", critical: 63, high: 78, medium: 349, low: 654, avgProbability: 59.8 },
  { month: "Mar 2025", critical: 69, high: 81, medium: 361, low: 631, avgProbability: 61.4 },
  { month: "Apr 2025", critical: 74, high: 83, medium: 372, low: 615, avgProbability: 63.0 },
  { month: "May 2025", critical: 79, high: 85, medium: 378, low: 602, avgProbability: 63.9 },
  { month: "Jun 2025", critical: 83, high: 86, medium: 381, low: 594, avgProbability: 64.5 },
  { month: "Jul 2025", critical: 87, high: 87, medium: 383, low: 589, avgProbability: 64.7 },
  { month: "Aug 2025", critical: 89, high: 87, medium: 385, low: 687, avgProbability: 64.8 },
  { month: "Sep 2025", critical: 89, high: 87, medium: 386, low: 686, avgProbability: 64.8 },
];
