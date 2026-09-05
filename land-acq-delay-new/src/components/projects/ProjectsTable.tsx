"use client";
// src/components/projects/ProjectsTable.tsx
import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import RiskBadge from "@/components/ui/RiskBadge";
import type { Project, RiskLevel } from "@/types";

interface Props {
  projects: Project[];
}

const RISK_LEVELS: (RiskLevel | "All")[] = ["All", "Critical", "High", "Medium", "Low"];

export default function ProjectsTable({ projects }: Props) {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "All">("All");
  const [sortKey, setSortKey] = useState<"delayProbability" | "name" | "id">("delayProbability");

  const allStates = ["All", ...Array.from(new Set(projects.map((p) => p.state))).sort()];

  const filtered = projects
    .filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.district.toLowerCase().includes(q);
      const matchState = stateFilter === "All" || p.state === stateFilter;
      const matchRisk = riskFilter === "All" || p.riskLevel === riskFilter;
      return matchSearch && matchState && matchRisk;
    })
    .sort((a, b) => {
      if (sortKey === "delayProbability") return b.delayProbability - a.delayProbability;
      if (sortKey === "name") return a.name.localeCompare(b.name);
      return a.id.localeCompare(b.id);
    });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#687386]" />
          <input
            type="text"
            placeholder="Search by ID, name, or district…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#e6eaf0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2457d6]/30"
          />
        </div>

        <div className="relative">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="appearance-none text-[12px] border border-[#e6eaf0] rounded-lg px-3 pr-7 py-2 bg-white focus:outline-none"
          >
            {allStates.map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#687386] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskLevel | "All")}
            className="appearance-none text-[12px] border border-[#e6eaf0] rounded-lg px-3 pr-7 py-2 bg-white focus:outline-none"
          >
            {RISK_LEVELS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#687386] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
            className="appearance-none text-[12px] border border-[#e6eaf0] rounded-lg px-3 pr-7 py-2 bg-white focus:outline-none"
          >
            <option value="delayProbability">Sort: Highest Risk</option>
            <option value="name">Sort: Name A–Z</option>
            <option value="id">Sort: Project ID</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#687386] pointer-events-none" />
        </div>

        <span className="text-[12px] text-[#687386] ml-auto">
          {filtered.length} of {projects.length} projects
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e6eaf0] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] min-w-[800px]">
            <thead>
              <tr className="border-b border-[#e6eaf0] bg-[#f8fafc]">
                {["Project ID", "Project Name", "State", "District", "Type", "Stage", "Delay Prob.", "Risk", "Top Driver", "Action"].map((h) => (
                  <th key={h} className="text-left font-semibold text-[#687386] py-3 px-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-[#687386] text-[13px]">
                    No projects match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-[#f0f2f6] hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#172033]">{p.id}</td>
                    <td className="py-3 px-4 text-[#172033] max-w-[180px]">
                      <span className="block truncate" title={p.name}>{p.name}</span>
                    </td>
                    <td className="py-3 px-4 text-[#687386]">{p.state}</td>
                    <td className="py-3 px-4 text-[#687386]">{p.district}</td>
                    <td className="py-3 px-4 text-[#687386]">{p.projectType}</td>
                    <td className="py-3 px-4 text-[#687386]">{p.currentStage}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold" style={{ color: p.delayProbability >= 75 ? "#dc3e4d" : p.delayProbability >= 50 ? "#d97706" : "#16a673" }}>
                        {p.delayProbability}%
                      </span>
                    </td>
                    <td className="py-3 px-4"><RiskBadge level={p.riskLevel} /></td>
                    <td className="py-3 px-4 text-[#687386] max-w-[120px]">
                      <span className="block truncate">{p.topDelayDriver}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/projects/${p.id}`}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#2457d6] border border-[#2457d6]/30 rounded-lg hover:bg-[#eef3ff] transition-colors whitespace-nowrap"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
