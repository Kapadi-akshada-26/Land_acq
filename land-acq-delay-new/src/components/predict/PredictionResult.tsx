"use client";
// src/components/predict/PredictionResult.tsx
// Displays prediction result: delay probability, risk level, expected delay,
// SHAP explanation bars, and recommended actions.

import { RotateCcw } from "lucide-react";
import RiskBadge from "@/components/ui/RiskBadge";
import type { PredictionResponse } from "@/types";
import { riskColor } from "@/lib/utils";

interface Props {
  result: PredictionResponse;
  onReset: () => void;
}

const RECOMMENDATIONS: Record<string, string> = {
  "Legal Disputes": "Review and expedite resolution of unresolved legal disputes. Engage district-level legal counsel.",
  "Compensation Pending": "Prioritise outstanding compensation cases. Schedule beneficiary review camps.",
  "Pending Approvals": "Follow up with approving authorities on long-pending clearances. Escalate if delayed beyond 30 days.",
  "Incomplete Documentation": "Conduct a documentation audit. Assign a nodal officer to resolve gaps within 15 days.",
  "R&R Incomplete": "Fast-track rehabilitation and resettlement for displaced families. Coordinate with district collector.",
  "Forest / Env. Clearance": "Engage with Forest Department and Environment Ministry for priority clearance.",
  "Ownership Disputes": "Initiate mediation proceedings for contested ownership claims.",
};

export default function PredictionResult({ result, onReset }: Props) {
  const pct = Math.round(result.delayProbability * 100);
  const color = riskColor(result.riskLevel);

  // SHAP values normalised to max-bar widths (0–100)
  const shapEntries = result.shapValues
    ? Object.entries(result.shapValues).sort((a, b) => b[1] - a[1])
    : result.topRiskFactors.map((f, i) => [f, 0.4 - i * 0.08] as [string, number]);
  const maxShap = Math.max(...shapEntries.map(([, v]) => v), 0.01);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Top result card ───────────────────────────────────────────────── */}
      <div className="bg-white border border-[#e6eaf0] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e6eaf0] bg-[#f8fafc] flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-[#172033]">Prediction Result</h3>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-[11px] text-[#687386] hover:text-[#172033] transition-colors"
          >
            <RotateCcw size={12} /> Predict Another
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-6 items-center">
            {/* Circular probability indicator */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="relative w-28 h-28 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(${color} ${pct * 3.6}deg, #f0f2f6 0deg)`,
                }}
              >
                <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="text-2xl font-black" style={{ color }}>{pct}%</span>
                  <span className="text-[9px] font-bold text-[#687386] uppercase tracking-wide">Delay Risk</span>
                </div>
              </div>
            </div>

            {/* Key metrics */}
            <div className="flex flex-wrap gap-5 flex-1">
              <div className="bg-[#f8fafc] border border-[#e6eaf0] rounded-xl px-5 py-4">
                <p className="text-[11px] text-[#687386] font-semibold uppercase tracking-wide mb-1">Risk Level</p>
                <RiskBadge level={result.riskLevel} className="text-[13px] px-3 py-1" />
              </div>
              <div className="bg-[#f8fafc] border border-[#e6eaf0] rounded-xl px-5 py-4">
                <p className="text-[11px] text-[#687386] font-semibold uppercase tracking-wide mb-1">Expected Delay</p>
                <p className="text-[22px] font-extrabold text-[#172033]">
                  {result.expectedDelayDays}
                  <span className="text-[13px] font-normal text-[#687386] ml-1">days</span>
                </p>
              </div>
              <div className="bg-[#f8fafc] border border-[#e6eaf0] rounded-xl px-5 py-4 flex-1">
                <p className="text-[11px] text-[#687386] font-semibold uppercase tracking-wide mb-1">Top Risk Factors</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.topRiskFactors.map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[11px] font-semibold">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {result.aiSummary && (
            <div className="mt-4 pt-4 border-t border-[#e6eaf0] text-[12px] text-[#475569] leading-relaxed flex items-start gap-2">
              <span className="font-bold text-[#2457d6] shrink-0">AI Summary:</span>
              <span>{result.aiSummary}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── SHAP Explainability ───────────────────────────────────────────── */}
      <div className="bg-white border border-[#e6eaf0] rounded-2xl shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-[14px] font-bold text-[#172033]">Why Is This Project at Risk?</h3>
          <p className="text-[11px] text-[#687386] mt-0.5">
            SHAP feature contributions from the XGBoost model — values indicate each factor&apos;s impact on delay probability.
          </p>
        </div>

        <div className="space-y-3">
          {shapEntries.map(([factor, value]) => {
            const barPct = Math.round((value / maxShap) * 100);
            const impact = barPct >= 70 ? "High Impact" : barPct >= 40 ? "Medium Impact" : "Low Impact";
            const barColor = barPct >= 70 ? "#dc3e4d" : barPct >= 40 ? "#d97706" : "#2457d6";
            return (
              <div key={factor} className="flex items-center gap-3">
                <span className="w-[180px] text-[12px] font-medium text-[#172033] shrink-0">{factor}</span>
                <div className="flex-1 h-2.5 bg-[#f0f2f6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${barPct}%`, background: barColor }}
                  />
                </div>
                <span className="w-[100px] text-[11px] font-semibold shrink-0" style={{ color: barColor }}>
                  {impact}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recommended Actions ───────────────────────────────────────────── */}
      <div className="bg-white border border-[#e6eaf0] rounded-2xl shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-[14px] font-bold text-[#172033]">Recommended for Officer Review</h3>
          <p className="text-[11px] text-[#687386] mt-0.5">
            Suggested interventions based on identified risk factors. These are recommendations, not automatic orders.
          </p>
        </div>

        <ol className="space-y-3">
          {(result.recommendedActions && result.recommendedActions.length > 0
            ? result.recommendedActions.map((r) => ({
                factor: r.factor,
                text: `${r.action} (${r.responsible_team})`
              }))
            : result.topRiskFactors.map((factor) => ({
                factor,
                text: RECOMMENDATIONS[factor] ?? `Review the status of "${factor}" and take corrective action.`
              }))
          ).map((item, idx) => (
            <li key={item.factor + idx} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#eef3ff] text-[#2457d6] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-[13px] text-[#172033] leading-relaxed">{item.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-5 px-4 py-3 bg-[#eef3ff] border border-[#bfdbfe] rounded-xl text-[11px] text-[#1e40af] leading-relaxed">
          <strong>Note:</strong> These recommendations are AI-assisted suggestions for officer review.
          All decisions and interventions are subject to the officer&apos;s discretion and applicable
          government regulations.
        </div>
      </div>
    </div>
  );
}
