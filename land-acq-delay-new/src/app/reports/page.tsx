"use client";
// src/app/reports/page.tsx
import { useState } from "react";
import { FileText, Download, RefreshCw, CheckCircle2 } from "lucide-react";
import DemoDataBadge from "@/components/ui/DemoDataBadge";

interface Report {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  lastGenerated?: string;
}

const REPORTS: Report[] = [
  {
    id: "state-risk",
    title: "State Risk Report",
    description: "Summary of delay risk levels and project counts across all states. Includes top risky districts per state.",
    icon: "🗺️",
    category: "Geographic",
    lastGenerated: "Today, 09:14 AM",
  },
  {
    id: "district-risk",
    title: "District Risk Report",
    description: "District-level breakdown of delay probability, pending approvals, and legal disputes.",
    icon: "📍",
    category: "Geographic",
    lastGenerated: "Today, 09:14 AM",
  },
  {
    id: "high-risk-projects",
    title: "High Risk Project Report",
    description: "All Critical and High risk projects sorted by delay probability. Includes top drivers and recommended actions.",
    icon: "🚨",
    category: "Project",
    lastGenerated: "Yesterday, 05:30 PM",
  },
  {
    id: "monthly-delay",
    title: "Monthly Delay Risk Report",
    description: "Month-on-month risk trend comparison. Shows escalation patterns and newly flagged projects.",
    icon: "📅",
    category: "Temporal",
    lastGenerated: "01 Sep 2025",
  },
  {
    id: "project-detail",
    title: "Project Detail Report",
    description: "Comprehensive per-project report with stage timeline, metrics, SHAP factors, and officer notes.",
    icon: "📄",
    category: "Project",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Geographic: "bg-blue-50 text-blue-700 border-blue-200",
  Project: "bg-purple-50 text-purple-700 border-purple-200",
  Temporal: "bg-green-50 text-green-700 border-green-200",
};

function ReportCard({ report }: { report: Report }) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setDone(false);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
    }, 1800);
  }

  return (
    <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0">{report.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-[14px] font-bold text-[#172033]">{report.title}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[report.category]}`}>
              {report.category}
            </span>
          </div>
          <p className="text-[12px] text-[#687386] leading-relaxed">{report.description}</p>
          {report.lastGenerated && (
            <p className="text-[10px] text-[#687386] mt-1.5">
              Last generated: <span className="font-medium">{report.lastGenerated}</span>
            </p>
          )}
        </div>
      </div>

      {/* Success message */}
      {done && (
        <div className="flex items-center gap-2 text-[12px] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle2 size={14} className="shrink-0" />
          Report generated successfully. Export below.
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#2457d6] text-white text-[12px] font-semibold rounded-lg hover:bg-[#173f9f] transition-colors disabled:opacity-60"
        >
          {generating ? <RefreshCw size={12} className="animate-spin" /> : <FileText size={12} />}
          {generating ? "Generating…" : "Generate Report"}
        </button>
        <button
          disabled={!done}
          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#687386] border border-[#e6eaf0] rounded-lg hover:bg-[#f5f7fb] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download size={12} />
          Export PDF
        </button>
        <button
          disabled={!done}
          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#687386] border border-[#e6eaf0] rounded-lg hover:bg-[#f5f7fb] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download size={12} />
          Export CSV
        </button>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="max-w-[900px] space-y-6">
      {/* Heading */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#172033] leading-tight">Reports</h1>
          <p className="text-[13px] text-[#687386] mt-1">
            Generate, preview, and export land acquisition monitoring reports
          </p>
        </div>
        <DemoDataBadge />
      </div>

      {/* Reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
      </div>

      {/* Note */}
      <div className="bg-[#f8fafc] border border-[#e6eaf0] rounded-xl p-4 text-[12px] text-[#687386] leading-relaxed">
        <strong className="text-[#172033]">Note:</strong> Report generation in mock mode produces a preview response only.
        PDF/CSV exports will become functional once the FastAPI backend is connected and the report endpoint is implemented.
      </div>
    </div>
  );
}
