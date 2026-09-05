// src/components/alerts/AlertsTable.tsx
"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import RiskBadge from "@/components/ui/RiskBadge";
import { formatRelativeTime } from "@/lib/utils";
import type { Alert, RiskLevel } from "@/types";

interface Props {
  alerts: Alert[];
}

const SEVERITY_OPTIONS: (RiskLevel | "All")[] = [
  "All", "Critical", "High", "Medium", "Low",
];

const STATUS_OPTIONS = ["All", "Open", "Under Review", "Resolved"];

export default function AlertsTable({ alerts }: Props) {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<RiskLevel | "All">("All");
  const [status, setStatus] = useState("All");

  const filtered = alerts.filter((a) => {
    const matchSearch =
      !search ||
      a.projectId.toLowerCase().includes(search.toLowerCase()) ||
      a.projectName.toLowerCase().includes(search.toLowerCase()) ||
      a.district.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severity === "All" || a.severity === severity;
    const matchStatus = status === "All" || a.status === status;
    return matchSearch && matchSeverity && matchStatus;
  });

  return (
    <div className="bg-white border border-[#e6eaf0] rounded-2xl shadow-sm">
      {/* Filters */}
      <div className="p-4 border-b border-[#e6eaf0] flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#687386]" />
          <input
            type="text"
            placeholder="Search project, district…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#e6eaf0] rounded-lg bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#2457d6]/30"
          />
        </div>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as RiskLevel | "All")}
          className="text-[12px] border border-[#e6eaf0] rounded-lg px-3 py-2 bg-white focus:outline-none"
        >
          {SEVERITY_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-[12px] border border-[#e6eaf0] rounded-lg px-3 py-2 bg-white focus:outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <span className="text-[12px] text-[#687386]">
          {filtered.length} alert{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] min-w-[700px]">
          <thead>
            <tr className="border-b border-[#e6eaf0] bg-[#f8fafc]">
              {[
                "Project",
                "District",
                "Alert Description",
                "Severity",
                "Date",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left font-semibold text-[#687386] py-3 px-4 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-[#687386] text-[13px]"
                >
                  No alerts match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b border-[#f0f2f6] hover:bg-[#f8fafc] transition-colors"
                >
                  <td className="py-3 px-4">
                    <p className="font-mono font-bold text-[#172033]">
                      {alert.projectId}
                    </p>
                    <p className="text-[#687386] text-[11px] truncate max-w-[120px]">
                      {alert.projectName}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-[#687386]">{alert.district}</td>
                  <td className="py-3 px-4 text-[#172033] max-w-[260px]">
                    {alert.description}
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={alert.severity} />
                  </td>
                  <td className="py-3 px-4 text-[#687386] whitespace-nowrap">
                    {formatRelativeTime(alert.date)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        alert.status === "Open"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : alert.status === "Under Review"
                          ? "bg-orange-50 text-orange-600 border border-orange-200"
                          : "bg-green-50 text-green-600 border border-green-200"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="px-2.5 py-1 text-[11px] font-semibold text-[#2457d6] border border-[#2457d6]/30 rounded-lg hover:bg-[#eef3ff] transition-colors">
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
