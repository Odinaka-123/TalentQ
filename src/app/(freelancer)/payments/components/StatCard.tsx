import { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  meta: string;
};

export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  meta,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={17} style={{ color: iconColor }} />
      </div>

      <div>
        <p className="text-xl sm:text-2xl font-semibold text-[#1B3A2F]">
          {value}
        </p>
        <p className="text-xs text-[#6B7A73] mt-0.5">{label}</p>
        <p className="text-xs text-[#8A8A7E] mt-2">{meta}</p>
      </div>
    </div>
  );
}
