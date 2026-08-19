"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search, Bell, Briefcase, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [greetingName, setGreetingName] = useState("");

  const isFindJobsActive = pathname.startsWith("/find-jobs");
  const isMessagesActive = pathname.startsWith("/messages");

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      setGreetingName(profile?.full_name ?? "there");
    };

    loadUser();
  }, [supabase]);

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
          {isMessagesActive ?
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B3A2F]">
              Messages
            </h1>
          : <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[#000000] truncate">
                Hello {greetingName}
              </h1>
              <p className="text-sm text-[#6B7A73] mt-0.5">
                What are we locking in today?
              </p>
            </div>
          }
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => router.push("/messages")}
            aria-label="Messages"
            aria-current={isMessagesActive ? "page" : undefined}
            className={`hidden sm:flex w-9 h-9 items-center justify-center rounded-full transition-colors ${
              isMessagesActive ?
                "bg-[#A8531E] text-white"
              : "bg-white text-[#1B3A2F] hover:bg-black/5"
            }`}
          >
            <Mail size={17} />
          </button>
          <button
            aria-label="Notifications"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-white text-[#1B3A2F] hover:bg-black/5"
          >
            <Bell size={17} />
          </button>
          <button
            onClick={() => router.push("/find-jobs")}
            aria-current={isFindJobsActive ? "page" : undefined}
            className={`flex items-center gap-2 text-white text-sm font-medium px-3.5 sm:px-4 py-2 rounded-md transition-colors ${
              isFindJobsActive ? "bg-[#732700]" : (
                "bg-[#A8531E] hover:bg-[#732700]"
              )
            }`}
          >
            <Briefcase size={15} />
            <span className="hidden xs:inline sm:inline">Find a job</span>
          </button>
        </div>
      </div>

      {!isMessagesActive && (
        <div className="relative mt-4 max-w-xl">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA79F]"
          />
          <input
            type="text"
            placeholder="Search jobs, skills, or clients..."
            className="w-full bg-white rounded-full pl-10 pr-4 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
        </div>
      )}
    </header>
  );
}
