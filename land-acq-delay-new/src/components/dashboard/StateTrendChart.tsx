"use client";
// src/components/dashboard/StateTrendChart.tsx
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { StateTrend, DistrictTrend } from "@/types";
import DemoDataBadge from "@/components/ui/DemoDataBadge";

interface Props {
  stateTrends: StateTrend[];
  districtTrends: DistrictTrend[];
}

function barColor(val: number): string {
  if (val >= 75) return "#dc3e4d";
  if (val >= 60) return "#d97706";
  if (val >= 45) return "#2457d6";
  return "#16a673";
}

export default function StateTrendChart({ stateTrends, districtTrends }: Props) {
  const [view, setView] = useState<"state" | "district">("state");

  const data =
    view === "state"
      ? stateTrends.map((s) => ({
          name: s.name,
          value: s.avgDelayProbability,
          projects: s.projectCount,
        }))
      : districtTrends.map((d) => ({
          name: d.name,
          value: d.avgDelayProbability,
          projects: d.projectCount,
        }));

  return (
    <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-[14px] font-bold text-[#172033]">
            {view === "state" ? "State" : "District"} Delay Risk Trend
          </h3>
          <p className="text-[11px] text-[#687386] mt-0.5">
            Average delay probability by {view}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <DemoDataBadge />
          <div className="ml-2 flex rounded-lg border border-[#e6eaf0] overflow-hidden text-[11px] font-semibold">
            <button
              onClick={() => setView("state")}
              className={`px-3 py-1.5 transition-colors ${
                view === "state"
                  ? "bg-[#2457d6] text-white"
                  : "bg-white text-[#687386] hover:bg-[#f5f7fb]"
              }`}
            >
              State
            </button>
            <button
              onClick={() => setView("district")}
              className={`px-3 py-1.5 transition-colors border-l border-[#e6eaf0] ${
                view === "district"
                  ? "bg-[#2457d6] text-white"
                  : "bg-white text-[#687386] hover:bg-[#f5f7fb]"
              }`}
            >
              District
            </button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#687386" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#687386" }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            formatter={(value) => [`${Number(value)}%`, "Avg Delay Probability"]}
            contentStyle={{
              fontSize: 12,
              border: "1px solid #e6eaf0",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          />
          <ReferenceLine
            y={60}
            stroke="#d97706"
            strokeDasharray="4 2"
            label={{ value: "Alert threshold", position: "right", fontSize: 10, fill: "#d97706" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={barColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
