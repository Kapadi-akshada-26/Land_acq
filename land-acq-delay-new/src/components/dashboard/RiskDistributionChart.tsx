"use client";
// src/components/dashboard/RiskDistributionChart.tsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { RiskDistribution } from "@/types";
import DemoDataBadge from "@/components/ui/DemoDataBadge";
import { riskColor } from "@/lib/utils";

interface Props {
  data: RiskDistribution[];
}

export default function RiskDistributionChart({ data }: Props) {
  return (
    <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-[#172033]">Risk Distribution</h3>
          <p className="text-[11px] text-[#687386] mt-0.5">
            Projects by risk category
          </p>
        </div>
        <DemoDataBadge />
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="count"
            nameKey="level"
            label={({ name, value }) => {
              const d = data.find((x) => x.level === name);
              return `${name} ${d?.percentage.toFixed(0) ?? ""}%`;
            }}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell
                key={entry.level}
                fill={riskColor(entry.level)}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${Number(value)} projects`,
              String(name),
            ]}
            contentStyle={{
              fontSize: 12,
              border: "1px solid #e6eaf0",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value, entry) => {
              const d = data.find((x) => x.level === value);
              return (
                <span style={{ fontSize: 12, color: "#172033" }}>
                  {value}{" "}
                  <span style={{ color: "#687386" }}>
                    ({d?.count ?? 0} · {d?.percentage.toFixed(1)}%)
                  </span>
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
