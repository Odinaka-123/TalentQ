import { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
};

export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-5 py-4 flex items-center gap-3">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={18} style={{ color: iconColor }} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-semibold text-[#1F2A22] truncate">{value}</p>
        <p className="text-xs text-[#8A8A7E] truncate">{label}</p>
      </div>
    </div>
  );
}
