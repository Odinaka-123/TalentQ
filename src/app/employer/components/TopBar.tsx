"use client";

import { Menu, Search, Bell, Mail, Plus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface TopBarProps {
  onMenuClick: () => void;
  greetingName?: string;
}

export default function TopBar({
  onMenuClick,
  greetingName = "Edgar John",
}: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isPostJobActive = pathname.startsWith("/employer/post-job");

  return (
    <header className="bg-[#F5F1E9] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="md:hidden mt-1 shrink-0 text-[#1B3A2F] p-1.5 -ml-1.5 rounded-lg hover:bg-black/5"
          >
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B3A2F] truncate">
              Hello {greetingName}
            </h1>
            <p className="text-sm text-[#6B7A73] mt-0.5">
              What are we doing today?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            aria-label="Notifications"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-white text-[#1B3A2F] hover:bg-black/5"
          >
            <Bell size={17} />
          </button>
          <button
            onClick={() => router.push("/employer/messages")}
            aria-label="Messages"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-white text-[#1B3A2F] hover:bg-black/5"
          >
            <Mail size={17} />
          </button>
          <button
            onClick={() => router.push("/employer/post-job")}
            aria-current={isPostJobActive ? "page" : undefined}
            className={`flex items-center gap-2 text-white text-sm font-medium px-3.5 sm:px-4 py-2 rounded-md transition-colors ${
              isPostJobActive ? "bg-[#732700]" : (
                "bg-[#A8531E] hover:bg-[#732700]"
              )
            }`}
          >
            <Plus size={15} />
            <span className="hidden xs:inline sm:inline">Post a job</span>
          </button>
        </div>
      </div>

      <div className="relative mt-4 max-w-xl">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA79F]"
        />
        <input
          type="text"
          placeholder="Search talent by skill, role, or name..."
          className="w-full bg-white rounded-full pl-10 pr-4 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
        />
      </div>
    </header>
  );
}
