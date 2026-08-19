import { LucideIcon } from "lucide-react";

type ContactChannelCardProps = {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
};

export default function ContactChannelCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  description,
  actionLabel,
  onAction,
  disabled = false,
}: ContactChannelCardProps) {
  return (
    <div
      className={`rounded-2xl border border-[#E8A47E] bg-white px-5 py-6 flex flex-col items-center text-center ${
        disabled ? "opacity-60" : ""
      }`}
    >
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
        disabled={disabled}
        className="w-full rounded-full bg-[#FBEADB] py-2 text-sm font-medium text-[#DE814A] hover:bg-[#F2DFC8] transition-colors disabled:cursor-not-allowed disabled:hover:bg-[#FBEADB]"
      >
        {actionLabel}
      </button>
    </div>
  );
}
