"use client";
// src/components/analytics/ProjectTypeChart.tsx
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ResponsiveContainer, Legend,
} from "recharts";
import type { ProjectTypeTrend } from "@/mock/mockAnalytics";
import DemoDataBadge from "@/components/ui/DemoDataBadge";

interface Props {
  data: ProjectTypeTrend[];
}

const COLORS = ["#dc3e4d", "#d97706", "#e09200", "#2457d6", "#16a673", "#3b82f6", "#8b5cf6"];

export default function ProjectTypeChart({ data }: Props) {
  return (
    <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-[#172033]">Project Type Comparison</h3>
          <p className="text-[11px] text-[#687386] mt-0.5">
            Average delay probability by infrastructure type
          </p>
        </div>
        <DemoDataBadge />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="type"
            tick={{ fontSize: 11, fill: "#687386" }}
            axisLine={false}
            tickLine={false}
            angle={-20}
            textAnchor="end"
            height={48}
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
            formatter={(value, name) => [`${Number(value)}%`, String(name)]}
            contentStyle={{ fontSize: 12, border: "1px solid #e6eaf0", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
          />
          <Bar dataKey="avgDelayProbability" name="Avg Delay Probability" radius={[4, 4, 0, 0]}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
