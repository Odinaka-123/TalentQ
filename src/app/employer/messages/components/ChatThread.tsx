"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import MessageBubble from "./MessageBubble";

type Message = {
  text: string;
  time: string;
  fromMe: boolean;
};

const messagesBySender: Record<string, { name: string; initials: string; avatarColor: string; messages: Message[] }> = {
  henrieta: {
    name: "Henrieta Ebiuwa",
    initials: "HE",
    avatarColor: "#DE814A",
    messages: [
      { text: "Hey! Can you share the updated build?", time: "10:42", fromMe: false },
      { text: "Sure, deploying to staging now. Will share the link shortly.", time: "10:44", fromMe: true },
      { text: "Great. Also, the client wants a dark mode toggle added.", time: "10:42", fromMe: false },
      { text: "Noted. I can add that in the current milestone — no extra charge.", time: "10:50", fromMe: true },
    ],
  },
  chidi: {
    name: "Chidi Okonkwo",
    initials: "CO",
    avatarColor: "#DE814A",
    messages: [{ text: "Looks great! Ready to approve?", time: "9:10", fromMe: false }],
  },
  koffi: {
    name: "Koffi Nassan",
    initials: "KN",
    avatarColor: "#DE814A",
    messages: [{ text: "Thanks for the proposal!", time: "Yesterday", fromMe: false }],
  },
};

const THIN_SCROLL_CLASSES =
  "overflow-y-auto " +
  "[scrollbar-width:thin] [scrollbar-color:#DE814A_transparent] " +
  "[&::-webkit-scrollbar]:w-1.5 " +
  "[&::-webkit-scrollbar-track]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:bg-[#DE814A] " +
  "[&::-webkit-scrollbar-thumb]:rounded-full";

export default function ChatThread({ activeId }: { activeId: string }) {
  const [draft, setDraft] = useState("");
  const conversation = messagesBySender[activeId];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    // TODO: send via Supabase Realtime once wired up
    setDraft("");
  };

  if (!conversation) return null;

  return (
    <div className="flex-1 min-w-0 flex flex-col rounded-2xl border border-[#E5E0D6] bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#EFEBE2]">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-full text-white text-sm font-semibold shrink-0"
          style={{ backgroundColor: conversation.avatarColor }}
        >
          {conversation.initials}
        </span>
        <h2 className="text-base font-semibold text-[#1F2A22]">
          {conversation.name}
        </h2>
      </div>

      <div className={`flex-1 px-6 py-5 ${THIN_SCROLL_CLASSES}`}>
        {conversation.messages.map((m, i) => (
          <MessageBubble key={i} text={m.text} time={m.time} fromMe={m.fromMe} />
        ))}
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-6 py-4 border-t border-[#EFEBE2]"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-[#DE814A] bg-[#FBF0E4] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#C6543A] placeholder:text-[#B9862F]"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#A8531E] text-white hover:bg-[#94481A] transition-colors shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}