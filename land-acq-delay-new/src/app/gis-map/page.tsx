// src/app/gis-map/page.tsx
// Server component: fetches data, passes to client GisMapShell.

import { getGISProjects } from "@/services/projectService";
import { getDashboardStats, getDelayDrivers } from "@/services/analyticsService";
import DemoDataBadge from "@/components/ui/DemoDataBadge";
import GisMapShell from "@/components/map/GisMapShell";
import type { Project } from "@/types";

export const dynamic = "force-dynamic";

export default async function GisMapPage() {
  const [projects, stats, drivers] = await Promise.all([
    getGISProjects(),
    getDashboardStats(),
    getDelayDrivers(),
  ]);

  const critical = projects.filter((p: Project) => p.riskLevel === "Critical").length;
  const high     = projects.filter((p: Project) => p.riskLevel === "High").length;
  const medium   = projects.filter((p: Project) => p.riskLevel === "Medium").length;
  const low      = projects.filter((p: Project) => p.riskLevel === "Low").length;
  const topDriver = drivers[0]?.name ?? "—";

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Heading */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#172033] leading-tight">GIS Risk Map</h1>
          <p className="text-[13px] text-[#687386] mt-1">
            Land acquisition project locations color-coded by delay risk level
          </p>
        </div>
        <DemoDataBadge />
      </div>

      {/* Client shell (holds Leaflet dynamic import) */}
      <GisMapShell
        projects={projects}
        critical={critical}
        high={high}
        medium={medium}
        low={low}
        avgDelayProbability={stats.avgDelayProbability}
        topDriver={topDriver}
      />
    </div>
  );
}
