// src/app/about/page.tsx
import { Info } from "lucide-react";

const TECH = [
  { title: "Frontend", value: "React / Next.js 15", sub: "TypeScript · Tailwind CSS · Recharts" },
  { title: "Backend", value: "FastAPI", sub: "Python · Pydantic · Uvicorn" },
  { title: "ML Model", value: "XGBoost", sub: "Trained on land acquisition dataset" },
  { title: "Explainability", value: "SHAP", sub: "Feature impact visualization" },
  { title: "Database", value: "PostgreSQL", sub: "Structured project data storage" },
  { title: "GIS", value: "Leaflet", sub: "Interactive India map with risk markers" },
  { title: "Charts", value: "Recharts", sub: "Responsive React chart library" },
];

const ARCH = [
  "External Data Sources (CSV / API)",
  "FastAPI Backend (Python)",
  "Preprocessing Pipeline",
  "XGBoost ML Model",
  "SHAP Explainability",
  "REST API Response",
  "Next.js Dashboard UI",
];

export default function AboutPage() {
  return (
    <div className="max-w-[900px] space-y-8">
      <div>
        <h1 className="text-[22px] font-extrabold text-[#172033] leading-tight">
          About / Technology
        </h1>
        <p className="text-[13px] text-[#687386] mt-1">
          System architecture and technology stack for SIH 2026 — Problem Statement SIH26017
        </p>
      </div>

      {/* Hero */}
      <div className="rounded-2xl p-7 bg-gradient-to-br from-[#132b5c] to-[#2457d6] text-white">
        <h2 className="text-[18px] font-bold mb-2">
          Predictive Analytics System for Early Detection of Land Acquisition Delays
        </h2>
        <p className="text-[13px] text-[#dce7ff] leading-relaxed max-w-2xl">
          LandGuard AI analyses land acquisition, approvals, compensation, displaced families,
          legal disputes, and R&amp;R status to predict delay risk before it impacts project
          execution — giving administrators the earliest possible warning.
        </p>
      </div>

      {/* Architecture */}
      <div className="bg-white border border-[#e6eaf0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-[14px] font-bold text-[#172033] mb-5">System Architecture</h3>
        <div className="flex flex-col items-start gap-0">
          {ARCH.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#eef3ff] border-2 border-[#2457d6] flex items-center justify-center text-[11px] font-bold text-[#2457d6]">
                  {i + 1}
                </div>
                {i < ARCH.length - 1 && (
                  <div className="w-0.5 h-6 bg-[#c7d7f5]" />
                )}
              </div>
              <span className="text-[13px] text-[#172033] font-medium py-1">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div>
        <h3 className="text-[14px] font-bold text-[#172033] mb-4">Technology Stack</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH.map((t) => (
            <div
              key={t.title}
              className="bg-white border border-[#e6eaf0] rounded-2xl p-5 shadow-sm"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#687386] mb-1">
                {t.title}
              </p>
              <p className="text-[15px] font-bold text-[#172033]">{t.value}</p>
              <p className="text-[11px] text-[#687386] mt-0.5">{t.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Problem statement info */}
      <div className="bg-[#f8fafc] border border-[#e6eaf0] rounded-2xl p-5 text-[12px] text-[#687386] leading-relaxed">
        <p className="font-semibold text-[#172033] mb-1">
          Smart India Hackathon 2026 — Problem Statement SIH26017
        </p>
        Build an AI-enabled predictive analytics system that identifies land acquisition projects
        at risk of delay. The system should provide early warnings, explain the root causes of risk,
        and suggest corrective actions for government administrators — while being simple enough for
        non-technical officers to use.
      </div>
    </div>
  );
}
