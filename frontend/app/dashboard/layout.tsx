"use client";

import Sidebar from "@/components/layout/Sidebar";
import QuickActionsButton from "@/components/ui/QuickActionsButton";
import KeyboardShortcutsTooltip from "@/components/ui/KeyboardShortcutsTooltip";
import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile, slides in when open */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-0 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full overflow-y-auto">
        {/* Mobile menu button - positioned at bottom left on mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={sidebarOpen}
          className="lg:hidden fixed bottom-6 left-4 z-30 w-14 h-14 bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition active:scale-95"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Quick Actions Button - positioned at bottom right */}
        <QuickActionsButton />

        {/* First-time keyboard shortcuts tooltip */}
        <KeyboardShortcutsTooltip />

        {children}
      </div>
    </div>
  );
}
