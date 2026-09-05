"use client";
// src/components/predict/PredictForm.tsx
// 17-field prediction form. Calls the API service — does NOT compute ML locally.

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { predictRisk } from "@/services/predictionService";
import { USE_MOCK } from "@/services/api";
import type { PredictionRequest, PredictionResponse, AcquisitionStage } from "@/types";
import PredictionResult from "./PredictionResult";

const STATES = [
  "Maharashtra", "Gujarat", "Rajasthan", "Karnataka", "Uttar Pradesh",
  "Madhya Pradesh", "Andhra Pradesh", "Tamil Nadu", "West Bengal",
  "Odisha", "Jharkhand", "Telangana", "Punjab", "Haryana",
];

const PROJECT_TYPES = [
  "Highway", "Industrial Corridor", "Metro Rail", "Airport",
  "Irrigation", "Railway", "Power Plant", "Smart City", "Port",
];

const STAGES: AcquisitionStage[] = [
  "SIA", "Notification", "Declaration", "Award", "Compensation", "Possession", "Completed",
];

const CLEARANCE_OPTIONS = ["Approved", "Pending", "Not Required"];

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

function Field({ label, required, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-[#687386] uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-[#687386]">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 text-[13px] border border-[#e6eaf0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2457d6]/30 text-[#172033]";

const selectCls =
  "w-full px-3 py-2.5 text-[13px] border border-[#e6eaf0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2457d6]/30 text-[#172033] cursor-pointer";

export default function PredictForm() {
  const [form, setForm] = useState<Partial<PredictionRequest>>({
    state: "",
    district: "",
    projectType: "",
    totalLandRequired: undefined,
    landAcquiredPercentage: undefined,
    landPossessionPercentage: undefined,
    pendingApprovals: undefined,
    compensationPendingPercentage: undefined,
    legalDisputes: undefined,
    ownershipDisputes: undefined,
    affectedFamilies: undefined,
    displacedFamilies: undefined,
    rrCompletionPercentage: undefined,
    environmentClearance: "",
    forestClearance: "",
    previousDelay: false,
    currentStage: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof PredictionRequest, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Basic validation
    const required: (keyof PredictionRequest)[] = [
      "state", "district", "projectType", "currentStage",
      "environmentClearance", "forestClearance",
    ];
    for (const k of required) {
      if (!form[k]) {
        setError(`Please fill in all required fields (${k} is missing).`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await predictRisk(form as PredictionRequest);
      setResult(res);
    } catch (err) {
      setError("Prediction failed. Check that the FastAPI backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white border border-[#e6eaf0] rounded-2xl shadow-sm overflow-hidden">
        {/* Form header */}
        <div className="px-6 py-4 border-b border-[#e6eaf0] bg-[#f8fafc] flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-[#172033]">Project Parameters</h2>
            <p className="text-[11px] text-[#687386] mt-0.5">
              Fill in current project status — prediction runs via FastAPI → XGBoost
            </p>
          </div>
          <span className={`text-[10px] rounded px-2 py-0.5 font-semibold border ${USE_MOCK
              ? "bg-amber-50 text-amber-600 border-amber-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
            {USE_MOCK ? "Mock Mode Active" : "FastAPI + ML Live"}
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Section: Location & Type */}
          <div>
            <p className="text-[11px] font-bold text-[#2457d6] uppercase tracking-widest mb-3">
              1 · Location &amp; Project Type
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="State" required>
                <select className={selectCls} value={form.state ?? ""} onChange={(e) => set("state", e.target.value)}>
                  <option value="">Select State</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="District" required>
                <input className={inputCls} placeholder="e.g. Nashik" value={form.district ?? ""} onChange={(e) => set("district", e.target.value)} />
              </Field>
              <Field label="Project Type" required>
                <select className={selectCls} value={form.projectType ?? ""} onChange={(e) => set("projectType", e.target.value)}>
                  <option value="">Select Type</option>
                  {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Section: Land Acquisition Status */}
          <div>
            <p className="text-[11px] font-bold text-[#2457d6] uppercase tracking-widest mb-3">
              2 · Land Acquisition Status
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Total Land Required (ha)" hint="Total hectares required for the project">
                <input type="number" min={0} className={inputCls} placeholder="e.g. 75"
                  value={form.totalLandRequired ?? ""}
                  onChange={(e) => set("totalLandRequired", parseFloat(e.target.value))} />
              </Field>
              <Field label="Land Acquired (%)" hint="0 – 100">
                <input type="number" min={0} max={100} className={inputCls} placeholder="e.g. 42"
                  value={form.landAcquiredPercentage ?? ""}
                  onChange={(e) => set("landAcquiredPercentage", parseFloat(e.target.value))} />
              </Field>
              <Field label="Land Possession (%)" hint="Physical possession taken">
                <input type="number" min={0} max={100} className={inputCls} placeholder="e.g. 38"
                  value={form.landPossessionPercentage ?? ""}
                  onChange={(e) => set("landPossessionPercentage", parseFloat(e.target.value))} />
              </Field>
            </div>
          </div>

          {/* Section: Approvals & Legal */}
          <div>
            <p className="text-[11px] font-bold text-[#2457d6] uppercase tracking-widest mb-3">
              3 · Approvals &amp; Legal Status
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Pending Approvals" hint="No. of outstanding approvals">
                <input type="number" min={0} className={inputCls} placeholder="e.g. 5"
                  value={form.pendingApprovals ?? ""}
                  onChange={(e) => set("pendingApprovals", parseInt(e.target.value))} />
              </Field>
              <Field label="Legal Disputes / Court Stays" hint="Active cases">
                <input type="number" min={0} className={inputCls} placeholder="e.g. 17"
                  value={form.legalDisputes ?? ""}
                  onChange={(e) => set("legalDisputes", parseInt(e.target.value))} />
              </Field>
              <Field label="Ownership Disputes" hint="No. of ownership conflicts">
                <input type="number" min={0} className={inputCls} placeholder="e.g. 4"
                  value={form.ownershipDisputes ?? ""}
                  onChange={(e) => set("ownershipDisputes", parseInt(e.target.value))} />
              </Field>
              <Field label="Compensation Pending (%)" hint="% of owners not yet compensated">
                <input type="number" min={0} max={100} className={inputCls} placeholder="e.g. 62"
                  value={form.compensationPendingPercentage ?? ""}
                  onChange={(e) => set("compensationPendingPercentage", parseFloat(e.target.value))} />
              </Field>
            </div>
          </div>

          {/* Section: Families & R&R */}
          <div>
            <p className="text-[11px] font-bold text-[#2457d6] uppercase tracking-widest mb-3">
              4 · Families &amp; R&amp;R
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Affected Families">
                <input type="number" min={0} className={inputCls} placeholder="e.g. 65"
                  value={form.affectedFamilies ?? ""}
                  onChange={(e) => set("affectedFamilies", parseInt(e.target.value))} />
              </Field>
              <Field label="Displaced Families">
                <input type="number" min={0} className={inputCls} placeholder="e.g. 20"
                  value={form.displacedFamilies ?? ""}
                  onChange={(e) => set("displacedFamilies", parseInt(e.target.value))} />
              </Field>
              <Field label="R&R Completion (%)" hint="Rehabilitation & Resettlement">
                <input type="number" min={0} max={100} className={inputCls} placeholder="e.g. 60"
                  value={form.rrCompletionPercentage ?? ""}
                  onChange={(e) => set("rrCompletionPercentage", parseFloat(e.target.value))} />
              </Field>
            </div>
          </div>

          {/* Section: Clearances & Stage */}
          <div>
            <p className="text-[11px] font-bold text-[#2457d6] uppercase tracking-widest mb-3">
              5 · Clearances &amp; Current Stage
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Environment Clearance" required>
                <select className={selectCls} value={form.environmentClearance ?? ""} onChange={(e) => set("environmentClearance", e.target.value)}>
                  <option value="">Select</option>
                  {CLEARANCE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Forest Clearance" required>
                <select className={selectCls} value={form.forestClearance ?? ""} onChange={(e) => set("forestClearance", e.target.value)}>
                  <option value="">Select</option>
                  {CLEARANCE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Previous Delay Record" hint="Did this project have prior delays?">
                <select className={selectCls}
                  value={form.previousDelay ? "yes" : "no"}
                  onChange={(e) => set("previousDelay", e.target.value === "yes")}>
                  <option value="no">No Previous Delay</option>
                  <option value="yes">Yes — Previous Delay</option>
                </select>
              </Field>
              <Field label="Current Acquisition Stage" required>
                <select className={selectCls} value={form.currentStage ?? ""} onChange={(e) => set("currentStage", e.target.value as AcquisitionStage)}>
                  <option value="">Select Stage</option>
                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
          </div>
        </div>

        {/* Footer */}
        {error && (
          <div className="mx-6 mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-[12px] text-red-700">
            {error}
          </div>
        )}

        <div className="px-6 py-4 border-t border-[#e6eaf0] bg-[#f8fafc] flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#2457d6] text-white text-[13px] font-bold rounded-xl hover:bg-[#173f9f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "🔍"}
            {loading ? "Predicting…" : "Predict Delay Risk"}
          </button>
          <button
            type="reset"
            onClick={handleReset}
            className="px-4 py-2.5 text-[13px] font-semibold text-[#687386] hover:text-[#172033] transition-colors"
          >
            Clear
          </button>
          <p className="ml-auto text-[11px] text-[#687386]">
            Prediction via FastAPI → XGBoost model
          </p>
        </div>
      </form>

      {/* Result */}
      {result && <PredictionResult result={result} onReset={handleReset} />}
    </div>
  );
}
