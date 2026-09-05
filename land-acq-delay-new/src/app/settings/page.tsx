// src/app/settings/page.tsx
"use client";
import { useState } from "react";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const [mockMode, setMockMode] = useState(true);
  const [apiUrl, setApiUrl] = useState("http://localhost:8000");

  return (
    <div className="max-w-[600px] space-y-6">
      <div>
        <h1 className="text-[22px] font-extrabold text-[#172033] leading-tight">Settings</h1>
        <p className="text-[13px] text-[#687386] mt-1">
          Application preferences and API configuration
        </p>
      </div>

      {/* Profile */}
      <div className="bg-white border border-[#e6eaf0] rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-[13px] font-bold text-[#172033]">Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#687386] mb-1">Name</label>
            <input
              type="text"
              defaultValue="Admin Officer"
              className="w-full px-3 py-2 text-[13px] border border-[#e6eaf0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2457d6]/30"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#687386] mb-1">Role</label>
            <input
              type="text"
              defaultValue="State Administrator"
              className="w-full px-3 py-2 text-[13px] border border-[#e6eaf0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2457d6]/30"
            />
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white border border-[#e6eaf0] rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-[13px] font-bold text-[#172033]">API Configuration</h3>

        <div>
          <label className="block text-[11px] font-semibold text-[#687386] mb-1">
            FastAPI Base URL
          </label>
          <input
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full px-3 py-2 text-[13px] border border-[#e6eaf0] rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#2457d6]/30"
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-[13px] font-semibold text-[#172033]">Mock Data Mode</p>
            <p className="text-[11px] text-[#687386]">
              Use demo data instead of calling the real FastAPI backend
            </p>
          </div>
          <button
            onClick={() => setMockMode(!mockMode)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              mockMode ? "bg-[#2457d6]" : "bg-[#e6eaf0]"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                mockMode ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {mockMode && (
          <div className="text-[11px] bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-700">
            ⚠ Mock mode is active. All data shown is demo data. Set{" "}
            <code className="font-mono">NEXT_PUBLIC_USE_MOCK_API=false</code> in{" "}
            <code className="font-mono">.env.local</code> to connect the real backend.
          </div>
        )}
      </div>

      {/* Theme */}
      <div className="bg-white border border-[#e6eaf0] rounded-2xl p-6 shadow-sm space-y-3">
        <h3 className="text-[13px] font-bold text-[#172033]">Theme</h3>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-[12px] font-semibold bg-[#2457d6] text-white rounded-lg">
            Light (Default)
          </button>
          <button className="px-4 py-2 text-[12px] font-semibold text-[#687386] border border-[#e6eaf0] rounded-lg hover:bg-[#f5f7fb] transition-colors">
            Dark (Coming Soon)
          </button>
        </div>
      </div>

      <button className="px-5 py-2.5 bg-[#2457d6] text-white text-[13px] font-semibold rounded-xl hover:bg-[#173f9f] transition-colors">
        Save Settings
      </button>
    </div>
  );
}
