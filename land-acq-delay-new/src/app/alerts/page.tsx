// src/app/alerts/page.tsx
import { AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";
import AlertsTable from "@/components/alerts/AlertsTable";
import DemoDataBadge from "@/components/ui/DemoDataBadge";
import { getAlerts } from "@/services/alertService";

export const dynamic = "force-dynamic";

function AlertKpiCard({
  label,
  count,
  color,
  icon: Icon,
}: {
  label: string;
  count: number;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#687386]">
          {label}
        </span>
        <Icon size={16} style={{ color }} />
      </div>
      <p className="text-3xl font-extrabold" style={{ color }}>
        {count}
      </p>
    </div>
  );
}

export default async function AlertsPage() {
  const alerts = await getAlerts();

  const critical = alerts.filter((a) => a.severity === "Critical").length;
  const high = alerts.filter((a) => a.severity === "High").length;
  const medium = alerts.filter((a) => a.severity === "Medium").length;

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Heading */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#172033] leading-tight">
            Risk Alerts
          </h1>
          <p className="text-[13px] text-[#687386] mt-1">
            Automated early-warning alerts for projects at risk of significant delay
          </p>
        </div>
        <DemoDataBadge />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AlertKpiCard
          label="Critical Alerts"
          count={critical}
          color="#dc3e4d"
          icon={AlertCircle}
        />
        <AlertKpiCard
          label="High Alerts"
          count={high}
          color="#d97706"
          icon={AlertTriangle}
        />
        <AlertKpiCard
          label="Medium Alerts"
          count={medium}
          color="#2457d6"
          icon={Info}
        />
        <AlertKpiCard
          label="Total Alerts"
          count={alerts.length}
          color="#172033"
          icon={Bell}
        />
      </div>

      {/* Alerts table */}
      <AlertsTable alerts={alerts} />
    </div>
  );
}
