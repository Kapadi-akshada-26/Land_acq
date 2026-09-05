// src/components/dashboard/KpiCards.tsx
import { TrendingUp, AlertTriangle, AlertCircle, CheckCircle2, Activity } from "lucide-react";
import DemoDataBadge from "@/components/ui/DemoDataBadge";
import type { DashboardStats } from "@/types";

interface CardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent?: string; // Tailwind color class for value text
}

function KpiCard({ label, value, sub, icon, accent }: CardProps) {
  return (
    <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#687386]">
          {label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#f5f7fb] flex items-center justify-center text-[#687386]">
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-extrabold leading-none ${accent ?? "text-[#172033]"}`}>
          {value}
        </p>
        <p className="text-[12px] text-[#687386] mt-1">{sub}</p>
      </div>
    </div>
  );
}

export default function KpiCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-[#687386] uppercase tracking-wider">
          Overview
        </h2>
        <DemoDataBadge />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <KpiCard
          label="Total Projects"
          value={stats.totalProjects.toLocaleString()}
          sub="Across all states"
          icon={<Activity size={16} />}
        />
        <KpiCard
          label="Critical / High Risk"
          value={stats.criticalHighRisk.toLocaleString()}
          sub="Require immediate attention"
          icon={<AlertCircle size={16} />}
          accent="text-red-600"
        />
        <KpiCard
          label="Medium Risk"
          value={stats.mediumRisk.toLocaleString()}
          sub="Monitor closely"
          icon={<AlertTriangle size={16} />}
          accent="text-orange-500"
        />
        <KpiCard
          label="On Track"
          value={stats.onTrack.toLocaleString()}
          sub="Low risk / no delays"
          icon={<CheckCircle2 size={16} />}
          accent="text-green-600"
        />
        <KpiCard
          label="Avg Delay Probability"
          value={`${stats.avgDelayProbability.toFixed(1)}%`}
          sub="System-wide average"
          icon={<TrendingUp size={16} />}
          accent="text-[#2457d6]"
        />
      </div>
    </div>
  );
}
