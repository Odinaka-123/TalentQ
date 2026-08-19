"use client";

import ConversationListItem from "./ConversationListItem";

export type Conversation = {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  lastMessage: string;
  unreadCount?: number;
};

export const conversations: Conversation[] = [
  {
    id: "henrieta",
    initials: "HE",
    avatarColor: "#DE814A",
    name: "Henrieta Ebiuwa",
    lastMessage: "Deploying to staging now, will sh...",
    unreadCount: 2,
  },
  {
    id: "chidi",
    initials: "CO",
    avatarColor: "#DE814A",
    name: "Chidi Okonkwo",
    lastMessage: "Looks great! Ready to approv?...",
    unreadCount: 2,
  },
  {
    id: "koffi",
    initials: "KN",
    avatarColor: "#DE814A",
    name: "Koffi Nassan",
    lastMessage: "Thanks for the proposal!",
  },
];

const THIN_SCROLL_CLASSES =
  "overflow-y-auto -mx-1 px-1 " +
  "[scrollbar-width:thin] [scrollbar-color:#DE814A_transparent] " +
  "[&::-webkit-scrollbar]:w-1.5 " +
  "[&::-webkit-scrollbar-track]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:bg-[#DE814A] " +
  "[&::-webkit-scrollbar-thumb]:rounded-full";

type ConversationListProps = {
  activeId: string;
  onSelect: (id: string) => void;
};

export default function ConversationList({
  activeId,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="w-full sm:w-72 shrink-0 rounded-2xl border border-[#E5E0D6] bg-white px-4 py-4 flex flex-col">
      <h2 className="text-sm font-semibold text-[#1F2A22] mb-3 shrink-0">
        Messages
      </h2>

      <div className={`flex flex-col gap-2 ${THIN_SCROLL_CLASSES}`}>
        {conversations.map((c) => (
          <ConversationListItem
            key={c.id}
            initials={c.initials}
            avatarColor={c.avatarColor}
            name={c.name}
            lastMessage={c.lastMessage}
            unreadCount={c.unreadCount}
            active={c.id === activeId}
            onClick={() => onSelect(c.id)}
          />
        ))}
      </div>
    </div>
  );
}
