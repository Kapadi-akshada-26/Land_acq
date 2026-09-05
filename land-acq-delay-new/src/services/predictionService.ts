// src/services/predictionService.ts
import { USE_MOCK, apiFetch } from "./api";
import type { PredictionRequest, PredictionResponse, RiskLevel } from "@/types";

// Mock prediction fallback
const mockPrediction: PredictionResponse = {
  delayProbability: 0.92,
  riskLevel: "Critical",
  expectedDelayDays: 128,
  topRiskFactors: [
    "Legal Disputes",
    "Compensation Pending",
    "Pending Approvals",
  ],
  shapValues: {
    "Legal Disputes": 0.38,
    "Compensation Pending": 0.27,
    "Pending Approvals": 0.18,
    "Incomplete Documentation": 0.09,
    "R&R Incomplete": 0.05,
    "Forest Clearance": 0.03,
  },
};

function normalizeRiskLevel(level: string): RiskLevel {
  const norm = (level || "").toUpperCase();
  if (norm.includes("CRIT")) return "Critical";
  if (norm.includes("HIGH")) return "High";
  if (norm.includes("MED")) return "Medium";
  return "Low";
}

export async function predictRisk(
  data: PredictionRequest
): Promise<PredictionResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return mockPrediction;
  }

  const rawRes = await apiFetch<Record<string, any>>("/predict", {
    method: "POST",
    body: JSON.stringify(data),
  });

  // Calculate normalized probability (0 - 1)
  const rawProb = typeof rawRes.delayProbability === "number"
    ? rawRes.delayProbability
    : typeof rawRes.delay_probability === "number"
    ? rawRes.delay_probability
    : 0;
  const delayProb = rawProb > 1 ? rawProb / 100 : rawProb;

  // Normalized delay days
  const expectedDays = rawRes.expectedDelayDays ?? rawRes.predicted_delay_days ?? rawRes.expected_delay_days ?? 0;

  // Normalized risk level
  const riskLevel = normalizeRiskLevel(rawRes.riskLevel || rawRes.risk_level || "Medium");

  // Normalized top risk factors
  const topFactors: string[] = rawRes.topRiskFactors || rawRes.top_risk_factors || [];

  return {
    delayProbability: Number(delayProb.toFixed(4)),
    riskLevel,
    expectedDelayDays: Math.round(Number(expectedDays)),
    topRiskFactors: topFactors.length > 0 ? topFactors : ["Land Acquisition Progress"],
    shapValues: rawRes.shapValues || rawRes.shap_values,
    aiPriority: rawRes.aiPriority || rawRes.ai_priority,
    aiSummary: rawRes.aiSummary || rawRes.ai_summary,
    topContributingFactors: rawRes.topContributingFactors || rawRes.top_contributing_factors,
    recommendedActions: rawRes.recommendedActions || rawRes.recommended_actions,
    predictionSummary: rawRes.predictionSummary || rawRes.prediction_summary,
  };
}