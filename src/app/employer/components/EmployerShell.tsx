"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import PageHeader from "./PageHeader";

const PAGE_HEADER_ROUTES: Record<string, string> = {
  "/employer/profile": "Profile",
  "/employer/settings": "Settings",
  "/employer/analytics": "Analytics",
  "/employer/verification": "Verification",
};

export default function EmployerShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const pageHeaderTitle = PAGE_HEADER_ROUTES[pathname];

  return (
    <div className="flex min-h-screen bg-[#F5F1E9]">
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        {pageHeaderTitle ?
          <PageHeader title={pageHeaderTitle} verified />
        : <TopBar onMenuClick={() => setMobileNavOpen(true)} />}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
