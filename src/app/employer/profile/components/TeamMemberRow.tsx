import { MoreVertical } from "lucide-react";

type TeamMemberRowProps = {
  initials: string;
  avatarColor: string;
  name: string;
  role: string;
  status: "Active" | "Pending" | "Inactive";
};

const statusStyles: Record<TeamMemberRowProps["status"], string> = {
  Active: "bg-[#DDEEE2] text-[#3E8E5A]",
  Pending: "bg-[#FBEADB] text-[#DE814A]",
  Inactive: "bg-[#F0ECE3] text-[#8A8A7E]",
};

export default function TeamMemberRow({
  initials,
  avatarColor,
  name,
  role,
  status,
}: TeamMemberRowProps) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
        style={{ backgroundColor: avatarColor }}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1F2A22] truncate">{name}</p>
        <p className="text-xs text-[#8A8A7E]">{role}</p>
      </div>

      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusStyles[status]}`}
      >
        {status}
      </span>

      <button
        type="button"
        aria-label={`Options for ${name}`}
        className="text-[#8A8A7E] hover:text-[#1F2A22] p-1 shrink-0"
      >
        <MoreVertical size={16} />
      </button>
    </div>
  );
}
