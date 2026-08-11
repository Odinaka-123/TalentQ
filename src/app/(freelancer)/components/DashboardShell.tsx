"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";

const HIDE_TOPBAR_ROUTES = ["/analytics", "/settings","/messages", "/payments", "/verification", "/help-support"];

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
        {showTopbar && <Topbar onMenuClick={() => setMobileNavOpen(true)} />}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
