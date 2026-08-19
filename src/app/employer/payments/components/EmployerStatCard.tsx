import { LucideIcon } from "lucide-react";

type EmployerStatCardProps = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
};

export default function EmployerStatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
}: EmployerStatCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-[#DE814A] px-5 py-4">
      <div
        className="flex items-center justify-center w-9 h-9 rounded-full mb-3"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={16} style={{ color: iconColor }} />
      </div>
      <p className="text-xl font-bold text-[#1F2A22]">{value}</p>
      <p className="text-xs text-[#8A8A7E]">{label}</p>
    </div>
  );
}
