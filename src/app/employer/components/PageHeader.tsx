"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Bell, Mail, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

type PageHeaderProps = {
  title: string;
  verified?: boolean;
  statusLabel?: string;
  statusColor?: string;
  onMenuClick?: () => void;
};

export default function PageHeader({
  title,
  verified = false,
  statusLabel,
  statusColor = "#3E8E5A",
  onMenuClick,
}: PageHeaderProps) {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <header className="bg-[#F5F1E9] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              aria-label="Open menu"
              className="md:hidden flex w-9 h-9 items-center justify-center rounded-full bg-white text-[#1B3A2F] hover:bg-black/5 shrink-0"
            >
              <Menu size={18} />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-[#000000] truncate">
            {title}
          </h1>
          {statusLabel && (
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium shrink-0"
              style={{
                backgroundColor: `${statusColor}20`,
                color: statusColor,
              }}
            >
              {statusLabel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {verified && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#3E8E5A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E8E5A]" />
              {t("app_employer_components_page_header.verified_employer")}</span>
          )}

          <button
            aria-label="Notifications"
            className="flex w-9 h-9 items-center justify-center rounded-full bg-white text-[#1B3A2F] hover:bg-black/5"
          >
            <Bell size={17} />
          </button>
          <button
            onClick={() => router.push("/employer/messages")}
            aria-label="Messages"
            className="flex w-9 h-9 items-center justify-center rounded-full bg-white text-[#1B3A2F] hover:bg-black/5"
          >
            <Mail size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}