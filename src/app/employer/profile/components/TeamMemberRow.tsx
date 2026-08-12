type TeamMemberRowProps = {
  initials: string;
  avatarColor: string;
  name: string;
  role: string;
  status: "Active" | "Inactive";
};

export default function TeamMemberRow({
  initials,
  avatarColor,
  name,
  role,
  status,
}: TeamMemberRowProps) {
  const isActive = status === "Active";

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-full text-white text-xs font-semibold shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-[#1F2A22]">{name}</p>
          <p className="text-xs text-[#8A8A7E]">{role}</p>
        </div>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          isActive ?
            "bg-[#D8E7DE] text-[#3E8E5A]"
          : "bg-[#F2DFC8] text-[#8A8A7E]"
        }`}
      >
        {status}
      </span>
    </div>
  );
}
