"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search, Bell, Briefcase, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  subscribeToNotifications,
  type Notification,
} from "@/lib/queries/notifications";
import { getNotificationPreferences } from "@/lib/queries/notification-preferences";
import { playNotificationSound } from "@/lib/utils/notification-sound";
import NotificationsPanel from "./NotificationsPanel";

interface TopbarProps {
  onMenuClick: () => void;
}

// Routes whose own page header already covers the greeting/search — Topbar
// still renders on these (so the icons/hamburger/Find-a-job button stay
// consistent everywhere), it just shows a plain page title instead of the
// dashboard greeting + search bar.
const ROUTE_TITLES: Record<string, string> = {
  "/messages": "Messages",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/payments": "Payments",
  "/verification": "Verification",
  "/help-support": "Help & Support",
  "/profile": "Profile",
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [greetingName, setGreetingName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isFindJobsActive = pathname.startsWith("/find-jobs");
  const isMessagesActive = pathname.startsWith("/messages");

  const pageTitleEntry = Object.entries(ROUTE_TITLES).find(([route]) =>
    pathname.startsWith(route),
  );
  const pageTitle = pageTitleEntry?.[1] ?? null;
  const hideGreeting = pageTitle !== null;

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      setGreetingName(profile?.full_name ?? "there");

      const notifs = await getNotifications(user.id);
      setNotifications(notifs);
      setNotifLoading(false);

      const prefs = await getNotificationPreferences(user.id);
      setSoundEnabled(prefs.notification_sounds);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToNotifications(userId, (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      if (soundEnabled) playNotificationSound();
    });

    return () => {
      unsubscribe();
    };
  }, [userId, soundEnabled]);

  const handleMarkAllRead = async () => {
    if (!userId) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead(userId);
  };

  const handleSelectNotification = async (notification: Notification) => {
    if (notification.read) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
    await markNotificationRead(notification.id);
  };

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
          {pageTitle ?
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B3A2F]">
              {pageTitle}
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

          <div className="relative hidden sm:block">
            <button
              onClick={() => setPanelOpen((open) => !open)}
              aria-label="Notifications"
              aria-expanded={panelOpen}
              className="relative flex w-9 h-9 items-center justify-center rounded-full bg-white text-[#1B3A2F] hover:bg-black/5"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#C6543A] text-white text-[10px] font-medium flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {panelOpen && (
              <NotificationsPanel
                notifications={notifications}
                loading={notifLoading}
                onClose={() => setPanelOpen(false)}
                onMarkAllRead={handleMarkAllRead}
                onSelect={handleSelectNotification}
              />
            )}
          </div>

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

      {!hideGreeting && (
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
