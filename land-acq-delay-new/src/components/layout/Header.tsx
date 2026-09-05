"use client";
// src/components/layout/Header.tsx
// Top header: title, filters, notifications, admin profile

import { Bell, ChevronDown, User } from "lucide-react";
import { useState } from "react";

const STATES = [
  "All States", "Maharashtra", "Gujarat", "Rajasthan", "Karnataka",
  "Uttar Pradesh", "Madhya Pradesh", "Andhra Pradesh", "Tamil Nadu",
];
const DISTRICTS = ["All Districts", "Nashik", "Pune", "Nagpur", "Thane", "Aurangabad"];
const PROJECT_TYPES = [
  "All Types", "Highway", "Industrial Corridor", "Metro Rail",
  "Airport", "Irrigation", "Railway", "Power Plant",
];

function FilterSelect({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  const [value, setValue] = useState(options[0]);
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="appearance-none bg-white border border-[#e6eaf0] rounded-lg pl-3 pr-7 py-1.5 text-xs text-[#172033] font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2457d6]/30"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#687386] pointer-events-none"
      />
    </div>
  );
}

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-[#e6eaf0] flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Title — hidden on mobile (hamburger takes space) */}
      <div className="hidden lg:block min-w-0">
        <h1 className="text-[15px] font-bold text-[#172033] leading-tight truncate">
          Land Acquisition Delay Prediction
        </h1>
        <p className="text-[11px] text-[#687386] truncate">
          AI-Powered Early Warning &amp; Decision Support
        </p>
      </div>

      {/* Spacer on mobile */}
      <div className="flex-1 lg:hidden" />

      {/* Filters */}
      <div className="hidden sm:flex items-center gap-2 ml-auto">
        <FilterSelect label="State" options={STATES} />
        <FilterSelect label="District" options={DISTRICTS} />
        <FilterSelect label="Type" options={PROJECT_TYPES} />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto lg:ml-4">
        {/* Notification bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f7fb] transition-colors">
          <Bell size={16} className="text-[#687386]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Admin profile */}
        <div className="flex items-center gap-2 bg-[#f5f7fb] border border-[#e6eaf0] rounded-lg px-3 py-1.5 cursor-default">
          <div className="w-6 h-6 rounded-full bg-[#2457d6] flex items-center justify-center">
            <User size={12} className="text-white" />
          </div>
          <div className="hidden md:block">

            <p className="text-[11px] font-semibold text-[#172033] leading-tight">Admin Officer</p>
            <p className="text-[10px] text-[#687386] leading-tight">State Administrator</p>

          </div>
          <ChevronDown size={12} className="text-[#687386] hidden md:block" />
        </div>
      </div>
    </header>
  );
}
