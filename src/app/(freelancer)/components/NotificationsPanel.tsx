"use client";

import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import type { Notification } from "@/lib/queries/notifications";

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  loading: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelect: (notification: Notification) => void;
}

export default function NotificationsPanel({
  notifications,
  loading,
  onClose,
  onMarkAllRead,
  onSelect,
}: NotificationsPanelProps) {
  const router = useRouter();
  const hasUnread = notifications.some((n) => !n.read);

  const handleSelect = (notification: Notification) => {
    onSelect(notification);
    if (notification.link) {
      router.push(notification.link);
      onClose();
    }
  };

  return (
    <>
      {/* Invisible overlay to catch outside clicks and close the panel */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute right-0 top-full mt-2 z-50 w-80 max-w-[90vw] bg-white rounded-2xl shadow-lg border border-[#F0ECE3] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0ECE3]">
          <p className="text-sm font-semibold text-[#1B3A2F]">Notifications</p>
          {hasUnread && (
            <button
              onClick={onMarkAllRead}
              className="text-xs font-medium text-[#C6543A] hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ?
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-[#F5F1E9] rounded-lg animate-pulse"
                />
              ))}
            </div>
          : notifications.length === 0 ?
            <div className="flex flex-col items-center text-center py-10 px-4">
              <Bell size={22} className="text-[#B9B4A6] mb-2" />
              <p className="text-sm text-[#6B7A73]">No notifications yet.</p>
            </div>
          : <ul className="flex flex-col divide-y divide-[#F5F1E9]">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => handleSelect(n)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-2.5 hover:bg-[#F5F1E9] transition-colors ${
                      !n.read ? "bg-[#FCEFE3]/40" : ""
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        n.read ? "bg-transparent" : "bg-[#C6543A]"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-[#1B3A2F]">
                        {n.title}
                      </span>
                      {n.body && (
                        <span className="block text-xs text-[#6B7A73] mt-0.5 line-clamp-2">
                          {n.body}
                        </span>
                      )}
                      <span className="block text-[11px] text-[#9AA79F] mt-1">
                        {timeAgo(n.created_at)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          }
        </div>
      </div>
    </>
  );
}
