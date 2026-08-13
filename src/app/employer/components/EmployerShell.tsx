"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import PageHeader from "./PageHeader";

const PAGE_TITLES: Record<string, string> = {
  "/employer/post-job": "Post a Job",
  "/employer/find-talent": "Find Talent",
  "/employer/candidates": "Candidates",
  "/employer/profile": "Profile",
  "/employer/analytics": "Analytics",
  "/employer/payments": "Payments",
  "/employer/verification": "Verification",
  "/employer/settings": "Settings",
  "/employer/help-support": "Help & Support",
};

const DASHBOARD_ROUTE = "/employer/dashboard";

export default function EmployerShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname === DASHBOARD_ROUTE;
  const pageTitle = PAGE_TITLES[pathname];

  return (
    <div className="flex min-h-screen bg-[#F5F1E9]">
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        {isDashboard ?
          <TopBar onMenuClick={() => setMobileNavOpen(true)} />
        : <PageHeader title={pageTitle ?? ""} verified />}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
