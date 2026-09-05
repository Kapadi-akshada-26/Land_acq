// src/components/layout/AppShell.tsx
// Wraps every page: sidebar + header + main content area

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      <Sidebar />
      {/* Main area — offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col lg:ml-[250px] min-w-0">
        <Header />
        <main className="flex-1 p-5 sm:p-6 lg:p-7 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
