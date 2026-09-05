// src/components/dashboard/RecentAlerts.tsx
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import RiskBadge from "@/components/ui/RiskBadge";
import { formatRelativeTime } from "@/lib/utils";
import type { Alert } from "@/types";

interface Props {
  alerts: Alert[];
}

export default function RecentAlerts({ alerts }: Props) {
  return (
    <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-[#172033]">Recent Risk Alerts</h3>
          <p className="text-[11px] text-[#687386] mt-0.5">
            Latest escalations requiring officer review
          </p>
        </div>
        <Link
          href="/alerts"
          className="text-[11px] font-semibold text-[#2457d6] hover:underline flex items-center gap-1"
        >
          View all <ExternalLink size={11} />
        </Link>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 rounded-xl border border-[#e6eaf0] hover:border-[#c7d2e8] transition-colors bg-[#f8fafc]"
          >
            {/* Severity dot */}
            <div className="pt-0.5 shrink-0">
              <RiskBadge level={alert.severity} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] font-bold text-[#172033]">
                  {alert.projectId}
                </span>
                <span className="text-[11px] text-[#687386]">·</span>
                <span className="text-[11px] text-[#687386]">{alert.district}</span>
                <span className="ml-auto text-[10px] text-[#687386]">
                  {formatRelativeTime(alert.date)}
                </span>
              </div>
              <p className="text-[12px] text-[#172033] mt-0.5 leading-snug">
                {alert.description}
              </p>
            </div>

            {/* Review link */}
            <Link
              href="/alerts"
              className="shrink-0 px-2.5 py-1 text-[11px] font-semibold text-[#2457d6] border border-[#2457d6]/30 rounded-lg hover:bg-[#eef3ff] transition-colors"
            >
              Review
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
