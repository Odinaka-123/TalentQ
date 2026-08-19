import { LucideIcon } from "lucide-react";

type AnalyticsStatCardProps = {
  icon: LucideIcon;
  value: string;
  label: string;
  trend: string;
};

export default function AnalyticsStatCard({
  icon: Icon,
  value,
  label,
  trend,
}: AnalyticsStatCardProps) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FBEADB] mb-3">
        <Icon size={16} className="text-[#DE814A]" />
      </div>
      <p className="text-xl font-bold text-[#1F2A22]">{value}</p>
      <p className="text-xs text-[#8A8A7E]">{label}</p>
      <p className="text-xs text-[#3E8E5A] mt-1">{trend}</p>
    </div>
  );
}
