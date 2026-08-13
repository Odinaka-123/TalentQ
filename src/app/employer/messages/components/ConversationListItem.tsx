type ConversationListItemProps = {
  initials: string;
  avatarColor: string;
  name: string;
  lastMessage: string;
  unreadCount?: number;
  active: boolean;
  onClick: () => void;
};

export default function ConversationListItem({
  initials,
  avatarColor,
  name,
  lastMessage,
  unreadCount,
  active,
  onClick,
}: ConversationListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
        active ?
          "border border-[#DE814A] bg-[#FBF0E4]"
        : "border border-transparent hover:bg-[#F5F1E9]"
      }`}
    >
      <span
        className="flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-semibold shrink-0"
        style={{ backgroundColor: avatarColor }}
      >
        {initials}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#1F2A22] truncate">{name}</p>
        <p className="text-xs text-[#8A8A7E] truncate">{lastMessage}</p>
      </div>

      {unreadCount ?
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#A8531E] text-white text-xs font-medium shrink-0">
          {unreadCount}
        </span>
      : null}
    </button>
  );
}
