// src/components/dashboard/ProjectsNeedingAttention.tsx
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import RiskBadge from "@/components/ui/RiskBadge";
import type { Project } from "@/types";

interface Props {
  projects: Project[];
}

export default function ProjectsNeedingAttention({ projects }: Props) {
  return (
    <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-[#172033]">
            Projects Needing Attention
          </h3>
          <p className="text-[11px] text-[#687386] mt-0.5">
            Sorted by highest delay risk
          </p>
        </div>
        <Link
          href="/projects"
          className="text-[11px] font-semibold text-[#2457d6] hover:underline flex items-center gap-1"
        >
          View all <ExternalLink size={11} />
        </Link>
      </div>

      <div className="overflow-x-auto -mx-5 px-5 flex-1">
        <table className="w-full text-[12px] min-w-[560px]">
          <thead>
            <tr className="border-b border-[#e6eaf0]">
              {["Project ID", "Project Name", "District", "Delay Prob.", "Risk", "Top Driver", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left font-semibold text-[#687386] py-2 pr-4 whitespace-nowrap first:pl-0"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                key={p.id}
                className="border-b border-[#f0f2f6] hover:bg-[#f8fafc] transition-colors"
              >
                <td className="py-3 pr-4 font-mono font-bold text-[#172033]">
                  {p.id}
                </td>
                <td className="py-3 pr-4 text-[#172033] max-w-[160px] truncate">
                  {p.name}
                </td>
                <td className="py-3 pr-4 text-[#687386]">{p.district}</td>
                <td className="py-3 pr-4">
                  <span
                    className="font-bold"
                    style={{
                      color:
                        p.delayProbability >= 85
                          ? "#dc3e4d"
                          : p.delayProbability >= 60
                          ? "#d97706"
                          : "#16a673",
                    }}
                  >
                    {p.delayProbability}%
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <RiskBadge level={p.riskLevel} />
                </td>
                <td className="py-3 pr-4 text-[#687386] max-w-[120px] truncate">
                  {p.topDelayDriver}
                </td>
                <td className="py-3">
                  <Link
                    href={`/projects/${p.id}`}
                    className="px-2.5 py-1 text-[11px] font-semibold text-[#2457d6] border border-[#2457d6]/30 rounded-lg hover:bg-[#eef3ff] transition-colors"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
