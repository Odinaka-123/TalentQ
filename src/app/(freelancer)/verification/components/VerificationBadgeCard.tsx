import { LucideIcon, CheckCircle2, Clock } from "lucide-react";

type Status = "verified" | "pending";

type VerificationBadgeCardProps = {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  note: string;
  noteColor: string;
  status: Status;
};

export default function VerificationBadgeCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  note,
  noteColor,
  status,
}: VerificationBadgeCardProps) {
  const isVerified = status === "verified";

  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-full"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={16} style={{ color: iconColor }} />
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
            isVerified ?
              "bg-[#D8E7DE] text-[#3E8E5A]"
            : "bg-[#FBEADB] text-[#DE814A]"
          }`}
        >
          {isVerified ?
            <CheckCircle2 size={12} />
          : <Clock size={12} />}
          {isVerified ? "Verified" : "Pending"}
        </span>
      </div>

      <p className="text-sm font-semibold text-[#1F2A22] mb-1">{title}</p>
      <p className="text-xs font-medium" style={{ color: noteColor }}>
        {note}
      </p>
    </div>
  );
}
