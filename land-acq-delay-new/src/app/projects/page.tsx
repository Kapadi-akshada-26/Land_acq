// src/app/projects/page.tsx
import ProjectsTable from "@/components/projects/ProjectsTable";
import DemoDataBadge from "@/components/ui/DemoDataBadge";
import { getProjects } from "@/services/projectService";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  const critical = projects.filter((p) => p.riskLevel === "Critical").length;
  const high = projects.filter((p) => p.riskLevel === "High").length;
  const medium = projects.filter((p) => p.riskLevel === "Medium").length;
  const low = projects.filter((p) => p.riskLevel === "Low").length;

  return (
    <div className="max-w-[1400px] space-y-6">
      {/* Heading */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#172033] leading-tight">Projects</h1>
          <p className="text-[13px] text-[#687386] mt-1">
            Browse, filter, and review all land acquisition projects
          </p>
        </div>
        <DemoDataBadge />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Critical", count: critical, color: "text-red-600", bg: "bg-red-50 border-red-200" },
          { label: "High Risk", count: high, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
          { label: "Medium Risk", count: medium, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Low / On Track", count: low, color: "text-green-600", bg: "bg-green-50 border-green-200" },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#687386] mb-1">{label}</p>
            <p className={`text-2xl font-extrabold ${color}`}>{count}</p>
          </div>
        ))}
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}
