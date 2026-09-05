"use client";
// src/components/dashboard/TopDelayDrivers.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { DelayDriver } from "@/types";
import DemoDataBadge from "@/components/ui/DemoDataBadge";

interface Props {
  drivers: DelayDriver[];
}

const GRADIENT_COLORS = [
  "#dc3e4d", "#d97706", "#e09200", "#2457d6",
  "#3b82f6", "#16a673", "#22c55e",
];

export default function TopDelayDrivers({ drivers }: Props) {
  return (
    <div className="bg-white border border-[#e6eaf0] rounded-2xl p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-[#172033]">Top Delay Drivers</h3>
          <p className="text-[11px] text-[#687386] mt-0.5">
            % of projects affected by each risk factor
          </p>
        </div>
        <DemoDataBadge />
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={drivers}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
          barCategoryGap="30%"
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#687386" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={180}
            tick={{ fontSize: 11, fill: "#172033" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [`${Number(value)}%`, "Affected Projects"]}
            contentStyle={{
              fontSize: 12,
              border: "1px solid #e6eaf0",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          />
          <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
            {drivers.map((_, idx) => (
              <Cell
                key={idx}
                fill={GRADIENT_COLORS[idx % GRADIENT_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
