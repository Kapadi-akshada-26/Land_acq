"use client";
// src/components/map/MapClient.tsx
// Leaflet map with Project Markers and Dynamic Risk Heatmap Layers.

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from "react-leaflet";
import Link from "next/link";
import { Building2, Calendar, FileText, Scale, ShieldAlert } from "lucide-react";
import type { Project } from "@/types";
import { riskColor } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

interface Props {
  projects: Project[];
  viewMode?: "markers" | "heatmap";
}

const INDIA_CENTER: [number, number] = [21.5, 78.9629];

export default function MapClient({ projects, viewMode = "markers" }: Props) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);

  const geoProjects = useMemo(() => projects.filter((p) => p.lat && p.lng), [projects]);

  return (
    <MapContainer
      center={INDIA_CENTER}
      zoom={5}
      style={{ height: "100%", width: "100%", borderRadius: "16px" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* ── HEATMAP VIEW MODE ──────────────────────────────────────────────── */}
      {viewMode === "heatmap" &&
        geoProjects.map((project) => {
          const isHighRisk = project.riskLevel === "Critical" || project.riskLevel === "High";
          const delayWeight = Math.min(project.expectedDelayDays || 100, 800);
          const outerRadius = isHighRisk ? Math.max(28000, delayWeight * 80) : 18000;
          const heatColor =
            project.riskLevel === "Critical"
              ? "#dc2626"
              : project.riskLevel === "High"
              ? "#ea580c"
              : project.riskLevel === "Medium"
              ? "#3b82f6"
              : "#10b981";

          return (
            <span key={`heat-${project.id}`}>
              {/* Outer Heat Glow */}
              <Circle
                center={[project.lat!, project.lng!]}
                radius={outerRadius}
                pathOptions={{
                  stroke: false,
                  fillColor: heatColor,
                  fillOpacity: isHighRisk ? 0.35 : 0.2,
                }}
              />
              {/* Core Hotspot Pin */}
              <CircleMarker
                center={[project.lat!, project.lng!]}
                radius={isHighRisk ? 9 : 6}
                pathOptions={{
                  color: "#ffffff",
                  weight: 1.5,
                  fillColor: heatColor,
                  fillOpacity: 0.95,
                }}
              >
                <Popup maxWidth={280}>
                  <div className="text-[12px] space-y-2 py-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-[#172033]">{project.id}</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                        style={{ background: heatColor }}
                      >
                        {project.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-bold text-[#172033] leading-snug">{project.name}</p>
                    <p className="text-[#687386] text-[11px]">
                      {project.district}, {project.state} ({project.projectType})
                    </p>
                    <div className="bg-[#f8fafc] p-2 rounded-lg border border-[#e6eaf0] text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#687386]">Expected Delay:</span>
                        <span className="font-bold text-[#dc2626]">{project.expectedDelayDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#687386]">Delay Probability:</span>
                        <span className="font-bold text-[#172033]">{project.delayProbability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#687386]">Primary Trigger:</span>
                        <span className="font-medium text-[#172033] truncate max-w-[120px]">{project.topDelayDriver}</span>
                      </div>
                    </div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="block text-center mt-2 py-1.5 bg-[#2457d6] text-white rounded-lg text-[11px] font-bold hover:bg-[#173f9f] transition-colors"
                    >
                      View Project Record →
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            </span>
          );
        })}

      {/* ── PINPOINTS / MARKERS VIEW MODE ─────────────────────────────────── */}
      {viewMode === "markers" &&
        geoProjects.map((project) => {
          const color = riskColor(project.riskLevel);
          const radius = project.delayProbability >= 80 ? 12 : project.delayProbability >= 50 ? 9 : 7;

          return (
            <CircleMarker
              key={project.id}
              center={[project.lat!, project.lng!]}
              radius={radius}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: color,
                fillOpacity: 0.9,
              }}
            >
              <Popup maxWidth={300}>
                <div className="text-[12px] space-y-2 py-1">
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5">
                    <span className="font-mono font-bold text-[#172033]">{project.id}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: color }}
                    >
                      {project.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#172033] leading-snug">{project.name}</h4>
                    <p className="text-[11px] text-[#687386] mt-0.5">
                      📍 {project.district}, {project.state}
                    </p>
                  </div>

                  {project.ministry && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#475569] bg-[#f1f5f9] px-2 py-1 rounded">
                      <Building2 size={11} className="text-[#64748b] shrink-0" />
                      <span className="truncate">{project.ministry}</span>
                    </div>
                  )}

                  <div className="bg-[#f8fafc] border border-[#e6eaf0] rounded-lg p-2.5 space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#687386]">Delay Probability</span>
                      <span className="font-black text-[13px]" style={{ color }}>
                        {project.delayProbability}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#687386]">Expected Delay</span>
                      <span className="font-bold text-[#172033]">{project.expectedDelayDays} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#687386]">Land Acquired</span>
                      <span className="font-medium text-[#172033]">{project.landAcquiredPct}%</span>
                    </div>
                    {project.legalDisputes > 0 && (
                      <div className="flex justify-between items-center text-red-600 font-semibold">
                        <span className="flex items-center gap-1"><Scale size={11} /> Legal Disputes</span>
                        <span>{project.legalDisputes} active cases</span>
                      </div>
                    )}
                    {project.keyEvent && (
                      <div className="flex justify-between items-center text-[#d97706] font-medium">
                        <span className="flex items-center gap-1"><ShieldAlert size={11} /> Key Event</span>
                        <span className="truncate max-w-[130px]">{project.keyEvent}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/projects/${project.id}`}
                    className="block text-center mt-2 py-1.5 bg-[#2457d6] text-white rounded-lg text-[11px] font-bold hover:bg-[#173f9f] transition-colors"
                  >
                    View Project Details →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
    </MapContainer>
  );
}

