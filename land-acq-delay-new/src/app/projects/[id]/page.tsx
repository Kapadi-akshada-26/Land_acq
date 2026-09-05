// src/app/projects/[id]/page.tsx
// Project detail page — shows full metrics, risk, and stage timeline

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Building2, AlertTriangle } from "lucide-react";
import { getProject } from "@/services/projectService";
import RiskBadge from "@/components/ui/RiskBadge";
import StageTimeline from "@/components/projects/StageTimeline";
import { riskColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

function MetricCard({ label, value, sub, accent }: {
  label: string; value: string | number; sub?: string; accent?: string;
}) {
  return (
    <div className="bg-[#f8fafc] border border-[#e6eaf0] rounded-xl p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#687386] mb-1">{label}</p>
      <p className={`text-[18px] font-bold ${accent ?? "text-[#172033]"}`}>{value}</p>
      {sub && <p className="text-[11px] text-[#687386] mt-0.5">{sub}</p>}
    </div>
  );
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[12px] text-[#172033] font-medium">{label}</span>
        <span className="text-[12px] font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-[#f0f2f6] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  let project;
  try {
    project = await getProject(id);
  } catch {
    notFound();
  }

  const probColor = riskColor(project.riskLevel);
  // Approximate days in stage based on expected delay (demo: use expectedDelayDays / 2)
  const daysInStage = Math.round(project.expectedDelayDays * 0.6);

  return (
    <div className="max-w-[1100px] space-y-6">
      {/* Back nav */}
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-[12px] text-[#687386] hover:text-[#172033] transition-colors">
        <ArrowLeft size={14} /> Back to Projects
      </Link>

      {/* Header */}
      <div className="bg-white border border-[#e6eaf0] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[12px] font-bold text-[#687386] bg-[#f0f2f6] px-2 py-0.5 rounded">
                {project.id}
              </span>
              <RiskBadge level={project.riskLevel} />
            </div>
            <h1 className="text-[20px] font-extrabold text-[#172033] leading-tight">{project.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-[12px] text-[#687386]">
              <span className="flex items-center gap-1"><MapPin size={12} /> {project.district}, {project.state}</span>
              <span className="flex items-center gap-1"><Building2 size={12} /> {project.projectType}</span>
            </div>
          </div>

          {/* Top-line risk metrics */}
          <div className="flex gap-4 flex-wrap">
            <div className="text-center">
              <p className="text-[11px] text-[#687386] font-semibold uppercase tracking-wide mb-1">Delay Probability</p>
              <p className="text-[32px] font-extrabold" style={{ color: probColor }}>
                {project.delayProbability}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-[11px] text-[#687386] font-semibold uppercase tracking-wide mb-1">Expected Delay</p>
              <p className="text-[32px] font-extrabold text-[#172033]">
                {project.expectedDelayDays}
                <span className="text-[14px] font-normal text-[#687386] ml-1">days</span>
              </p>
            </div>
          </div>
        </div>

        {/* Top Driver alert */}
        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-[#fff8ec] border border-orange-200 text-[12px] text-orange-800">
          <AlertTriangle size={14} className="text-orange-500 shrink-0" />
          <strong>Primary Risk Driver:</strong> {project.topDelayDriver}
        </div>
      </div>

      {/* Key metrics grid */}
      <div>
        <h2 className="text-[13px] font-bold text-[#172033] mb-3">Project Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Pending Approvals" value={project.pendingApprovals} sub="Outstanding clearances" accent={project.pendingApprovals > 4 ? "text-red-600" : undefined} />
          <MetricCard label="Legal Disputes" value={project.legalDisputes} sub="Active court cases" accent={project.legalDisputes > 5 ? "text-red-600" : undefined} />
          <MetricCard label="Ownership Disputes" value={project.ownershipDisputes} sub="Contested parcels" />
          <MetricCard label="Affected Families" value={project.affectedFamilies.toLocaleString()} sub={`${project.displacedFamilies} displaced`} />
        </div>
      </div>

      {/* Progress bars */}
      <div className="bg-white border border-[#e6eaf0] rounded-2xl p-6 shadow-sm">
        <h2 className="text-[14px] font-bold text-[#172033] mb-5">Acquisition Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <ProgressBar label="Land Acquired" value={project.landAcquiredPct} color="#2457d6" />
          <ProgressBar label="Land Possession" value={project.landPossessionPct} color="#3b82f6" />
          <ProgressBar
            label="Compensation Pending"
            value={project.compensationPendingPct}
            color={project.compensationPendingPct > 50 ? "#dc3e4d" : "#d97706"}
          />
          <ProgressBar label="R&R Completion" value={project.rrCompletionPct} color="#16a673" />
        </div>
      </div>

      {/* Stage Timeline */}
      <StageTimeline currentStage={project.currentStage} daysInCurrentStage={daysInStage} />
    </div>
  );
}
