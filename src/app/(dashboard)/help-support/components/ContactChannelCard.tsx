import { LucideIcon } from "lucide-react";

type ContactChannelCardProps = {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export default function ContactChannelCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  description,
  actionLabel,
  onAction,
}: ContactChannelCardProps) {
  return (
    <div className="rounded-2xl border border-[#E8A47E] bg-white px-5 py-6 flex flex-col items-center text-center">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={18} style={{ color: iconColor }} />
      </div>
      <p className="text-sm font-semibold text-[#1F2A22] mb-1">{title}</p>
      <p className="text-xs text-[#8A8A7E] mb-4">{description}</p>
      <button
        type="button"
        onClick={onAction}
        className="w-full rounded-full bg-[#FBEADB] py-2 text-sm font-medium text-[#DE814A] hover:bg-[#F2DFC8] transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
}
