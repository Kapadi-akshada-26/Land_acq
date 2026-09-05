"use client";
// src/components/analytics/RiskTrendChart.tsx
// Line chart showing monthly risk escalation over 12 months
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer, ReferenceLine,
} from "recharts";
import type { RiskTrendPoint } from "@/mock/mockAnalytics";
import DemoDataBadge from "@/components/ui/DemoDataBadge";

interface Props {
  data: RiskTrendPoint[];
}

export default function RiskTrendChart({ data }: Props) {
  return (
    <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-[#172033]">Risk Trend Over Time</h3>
          <p className="text-[11px] text-[#687386] mt-0.5">
            Monthly count of projects by risk category — last 12 months
          </p>
        </div>
        <DemoDataBadge />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f6" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "#687386" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#687386" }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, border: "1px solid #e6eaf0", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="critical" name="Critical" stroke="#dc3e4d" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="high"     name="High"     stroke="#d97706" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="medium"   name="Medium"   stroke="#2457d6" strokeWidth={2} dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
