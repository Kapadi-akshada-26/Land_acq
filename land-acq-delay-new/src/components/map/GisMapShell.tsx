"use client";
// src/components/map/GisMapShell.tsx
// Interactive GIS Shell with Marker vs Heatmap Mode and Corridor Filters.

import { useState, useMemo } from "react";
import nextDynamic from "next/dynamic";
import { Flame, MapPin, Filter } from "lucide-react";
import type { Project } from "@/types";
import { riskColor } from "@/lib/utils";

const MapClient = nextDynamic(() => import("@/components/map/MapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-[#f0f4f8] rounded-2xl min-h-[500px]">
      <p className="text-[#687386] text-[13px] font-medium">Loading interactive GIS layer…</p>
    </div>
  ),
});

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-[#172033]">
      <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm inline-block" style={{ background: color }} />
      {label}
    </span>
  );
}

interface Props {
  projects: Project[];
  critical: number;
  high: number;
  medium: number;
  low: number;
  avgDelayProbability: number;
  topDriver: string;
}

export default function GisMapShell({
  projects,
  critical,
  high,
  medium,
  low,
  avgDelayProbability,
  topDriver,
}: Props) {
  const [viewMode, setViewMode] = useState<"markers" | "heatmap">("heatmap");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedRisk, setSelectedRisk] = useState<string>("All");

  const states = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.state))).sort()], [projects]);
  const projectTypes = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.projectType))).sort()], [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchState = selectedState === "All" || p.state === selectedState;
      const matchType = selectedType === "All" || p.projectType === selectedType;
      const matchRisk = selectedRisk === "All" || p.riskLevel === selectedRisk;
      return matchState && matchType && matchRisk;
    });
  }, [projects, selectedState, selectedType, selectedRisk]);

  const filteredCritical = filteredProjects.filter((p) => p.riskLevel === "Critical").length;
  const filteredHigh = filteredProjects.filter((p) => p.riskLevel === "High").length;
  const filteredMedium = filteredProjects.filter((p) => p.riskLevel === "Medium").length;
  const filteredLow = filteredProjects.filter((p) => p.riskLevel === "Low").length;

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-[620px]">
      {/* Map column */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Controls bar: Mode toggle + Filters */}
        <div className="bg-white border border-[#e6eaf0] rounded-2xl p-3 flex items-center justify-between gap-3 flex-wrap shadow-sm">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#f1f5f9] p-1 rounded-xl border border-[#e2e8f0]">
            <button
              onClick={() => setViewMode("heatmap")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                viewMode === "heatmap"
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-sm"
                  : "text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              <Flame size={14} />
              Risk Heatmap
            </button>
            <button
              onClick={() => setViewMode("markers")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                viewMode === "markers"
                  ? "bg-[#2457d6] text-white shadow-sm"
                  : "text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              <MapPin size={14} />
              Project Markers
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="text-[12px] border border-[#e6eaf0] rounded-lg px-2.5 py-1.5 bg-white text-[#172033] font-medium focus:outline-none"
            >
              <option value="All">All States ({states.length - 1})</option>
              {states.filter((s) => s !== "All").map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-[12px] border border-[#e6eaf0] rounded-lg px-2.5 py-1.5 bg-white text-[#172033] font-medium focus:outline-none"
            >
              <option value="All">All Project Types</option>
              {projectTypes.filter((t) => t !== "All").map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="text-[12px] border border-[#e6eaf0] rounded-lg px-2.5 py-1.5 bg-white text-[#172033] font-medium focus:outline-none"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Legend bar */}
        <div className="bg-white border border-[#e6eaf0] rounded-xl px-4 py-2 flex items-center gap-4 flex-wrap shadow-sm">
          <span className="text-[11px] font-bold text-[#687386] uppercase tracking-wider">Legend</span>
          <LegendDot color={riskColor("Critical")} label="Critical (Severe Delays / Stays)" />
          <LegendDot color={riskColor("High")} label="High Risk" />
          <LegendDot color={riskColor("Medium")} label="Medium Risk" />
          <LegendDot color={riskColor("Low")} label="Low / On Track" />
          <span className="ml-auto text-[11px] font-semibold text-[#2457d6]">
            Showing {filteredProjects.length} of {projects.length} mapped packages
          </span>
        </div>

        {/* Map container */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-[#e6eaf0] shadow-sm min-h-[520px]">
          <MapClient projects={filteredProjects} viewMode={viewMode} />
        </div>
      </div>

      {/* Right summary panel */}
      <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-3">
        <div className="bg-white border border-[#e6eaf0] rounded-2xl p-4 shadow-sm">
          <h3 className="text-[13px] font-bold text-[#172033] mb-3">Regional Corridor Summary</h3>
          {[
            { label: "Mapped Projects", value: `${filteredProjects.length}`, accent: "font-black" },
            { label: "Critical Risk", value: `${filteredCritical}`, accent: "text-red-600" },
            { label: "High Risk", value: `${filteredHigh}`, accent: "text-orange-500" },
            { label: "Medium Risk", value: `${filteredMedium}`, accent: "text-blue-600" },
            { label: "Low / On Track", value: `${filteredLow}`, accent: "text-green-600" },
            {
              label: "Avg Delay Prob.",
              value: `${(
                filteredProjects.reduce((acc, p) => acc + p.delayProbability, 0) /
                (filteredProjects.length || 1)
              ).toFixed(1)}%`,
              accent: "text-[#2457d6]",
            },
            { label: "Top Trigger", value: topDriver.split("/")[0].trim(), accent: "" },
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              className="flex items-center justify-between py-2 border-b border-[#f0f2f6] last:border-0"
            >
              <span className="text-[12px] text-[#687386]">{label}</span>
              <span className={`text-[13px] font-bold ${accent || "text-[#172033]"}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Risk breakdown bars */}
        <div className="bg-white border border-[#e6eaf0] rounded-2xl p-4 shadow-sm">
          <h3 className="text-[13px] font-bold text-[#172033] mb-3">Risk Distribution</h3>
          {[
            { level: "Critical", count: filteredCritical, color: riskColor("Critical") },
            { level: "High", count: filteredHigh, color: riskColor("High") },
            { level: "Medium", count: filteredMedium, color: riskColor("Medium") },
            { level: "Low", count: filteredLow, color: riskColor("Low") },
          ].map(({ level, count, color }) => {
            const pct = filteredProjects.length > 0 ? Math.round((count / filteredProjects.length) * 100) : 0;
            return (
              <div key={level} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] font-medium" style={{ color }}>
                    {level}
                  </span>
                  <span className="text-[11px] text-[#687386]">
                    {count} ({pct}%)
                  </span>
                </div>
                <div className="h-1.5 bg-[#f0f2f6] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#eef3ff] border border-[#bfdbfe] rounded-xl p-3.5 text-[11px] text-[#1e40af] leading-relaxed space-y-1">
          <p className="font-bold flex items-center gap-1">🔥 Hotspot Detection</p>
          <p>
            Switch to <strong>Risk Heatmap</strong> to view concentrated bottlenecks across state corridors (like High Speed Rail packages in Vapi &amp; Palghar).
          </p>
        </div>
      </div>
    </div>
  );
}

