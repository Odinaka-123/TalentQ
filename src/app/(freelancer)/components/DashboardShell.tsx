"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";

const HIDE_TOPBAR_ROUTES = [
  "/analytics",
  "/settings",
  "/messages",
  "/payments",
  "/verification",
  "/help-support",
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const showTopbar = !HIDE_TOPBAR_ROUTES.includes(pathname);

  return (
    <div className="flex min-h-screen bg-[#F5F1E9]">
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        {showTopbar ?
          <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        : <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="md:hidden m-4 mb-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white text-[#1B3A2F] shadow-sm self-start shrink-0"
          >
            <Menu size={20} />
          </button>
        }
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
