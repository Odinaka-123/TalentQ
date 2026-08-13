import { Bell, Sparkles } from "lucide-react";

export default function AlertBanner() {
  return (
    <div className="rounded-2xl border border-[#B9D9C4] bg-[#DDEEE2] px-5 py-4 flex items-center justify-between gap-4 flex-wrap mb-4">
      <div className="flex items-center gap-2.5">
        <Bell size={16} className="text-[#3E8E5A] shrink-0" />
        <p className="text-sm text-[#2E6B44]">
          Get Notified when new Talents match your requirements
        </p>
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-[#3E8E5A] hover:bg-[#F5F1E9] transition-colors shrink-0"
      >
        <Sparkles size={12} />
        Create Alert
      </button>
    </div>
  );
}
