"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import PageHeader from "./PageHeader";

const DASHBOARD_ROUTE = "/employer/dashboard";
const MESSAGES_ROUTE = "/employer/messages";

export default function EmployerShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const PAGE_TITLES: Record<string, string> = {
    "/employer/post-job": t("app_employer_components_employer_shell.post_a_job"),
    "/employer/find-talent": t("app_employer_components_employer_shell.find_talent"),
    "/employer/candidates": t("app_employer_components_employer_shell.candidates"),
    "/employer/profile": t("app_employer_components_employer_shell.profile"),
    "/employer/analytics": t("app_employer_components_employer_shell.analytics"),
    "/employer/payments": t("app_employer_components_employer_shell.payments"),
    "/employer/verification": t("app_employer_components_employer_shell.verification"),
    "/employer/settings": t("app_employer_components_employer_shell.settings"),
    "/employer/help-support": t("app_employer_components_employer_shell.help_support"),
  };

  const isDashboard = pathname === DASHBOARD_ROUTE;
  const isMessages = pathname === MESSAGES_ROUTE;
  const pageTitle = PAGE_TITLES[pathname];

  return (
    <div className="flex min-h-screen bg-[#F5F1E9]">
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        {isDashboard ?
          <TopBar onMenuClick={() => setMobileNavOpen(true)} />
          : isMessages ?
            <PageHeader
              title={t("app_employer_components_employer_shell.messages")}
              statusLabel={t("app_employer_components_employer_shell.active")}
              onMenuClick={() => setMobileNavOpen(true)}
            />
            : <PageHeader
              title={pageTitle ?? ""}
              verified
              onMenuClick={() => setMobileNavOpen(true)}
            />}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}