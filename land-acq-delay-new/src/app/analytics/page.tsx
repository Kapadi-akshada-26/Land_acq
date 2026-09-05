// src/app/analytics/page.tsx
// Analytics page — 5 charts: state risk, district risk, project type, top drivers, trend

import DemoDataBadge from "@/components/ui/DemoDataBadge";
import TopDelayDrivers from "@/components/dashboard/TopDelayDrivers";
import RiskDistributionChart from "@/components/dashboard/RiskDistributionChart";
import StateTrendChart from "@/components/dashboard/StateTrendChart";
import ProjectTypeChart from "@/components/analytics/ProjectTypeChart";
import RiskTrendChart from "@/components/analytics/RiskTrendChart";

import {
  getDelayDrivers,
  getRiskDistribution,
  getStateTrends,
  getDistrictTrends,
  getProjectTypeTrends,
  getRiskTrendOverTime,
} from "@/services/analyticsService";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [drivers, riskDist, stateTrends, districtTrends, typeTrends, trendData] =
    await Promise.all([
      getDelayDrivers(),
      getRiskDistribution(),
      getStateTrends(),
      getDistrictTrends(),
      getProjectTypeTrends(),
      getRiskTrendOverTime(),
    ]);

  return (
    <div className="max-w-[1400px] space-y-6">
      {/* Heading */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#172033] leading-tight">Analytics</h1>
          <p className="text-[13px] text-[#687386] mt-1">
            Detailed delay risk analysis across states, districts, project types, and time
          </p>
        </div>
        <DemoDataBadge />
      </div>

      {/* Row 1 — State / District toggle trend */}
      <StateTrendChart stateTrends={stateTrends} districtTrends={districtTrends} />

      {/* Row 2 — Top drivers (wider) + Risk distribution (narrower) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <TopDelayDrivers drivers={drivers} />
        </div>
        <div className="lg:col-span-2">
          <RiskDistributionChart data={riskDist} />
        </div>
      </div>

      {/* Row 3 — Project type comparison */}
      <ProjectTypeChart data={typeTrends} />

      {/* Row 4 — Risk trend over time */}
      <RiskTrendChart data={trendData} />
    </div>
  );
}
