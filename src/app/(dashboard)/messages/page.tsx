"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;
  verified?: boolean;
  lastMessage: string;
  time: string;
  unread?: boolean;
  messages: Message[];
}

/**
 * TalentQ Team is always the first conversation a user sees — seeded in on
 * signup as a welcome message. It's pinned first regardless of activity on
 * the other threads, and carries a LinkedIn-style verified badge since it's
 * an official TalentQ account rather than a client.
 */
const conversations: Conversation[] = [
  {
    id: "talentq-team",
    name: "TalentQ Team",
    avatarInitials: "TQ",
    avatarColor: "#0F2A20",
    verified: true,
    lastMessage: "Welcome to TalentQ! We're glad you're here 👋",
    time: "Just now",
    unread: true,
    messages: [
      {
        id: "tq-1",
        sender: "them",
        text: "Welcome to TalentQ, Ebiuwa! 🎉 We're glad you're here.",
        time: "Just now",
      },
      {
        id: "tq-2",
        sender: "them",
        text: "Complete your profile and verification to start getting matched with clients. If you ever need help, just reply here — our team reads every message.",
        time: "Just now",
      },
    ],
  },
  {
    id: "cloudscale",
    name: "Cloudscale Technologies",
    avatarInitials: "CT",
    avatarColor: "#C6543A",
    lastMessage: "Can you share the updated build?",
    time: "10m",
    unread: true,
    messages: [
      {
        id: "c-1",
        sender: "them",
        text: "Hey! Can you share the updated build?",
        time: "10:42",
      },
      {
        id: "c-2",
        sender: "me",
        text: "Sure, deploying to staging now. Will share the link shortly.",
        time: "10:44",
      },
      {
        id: "c-3",
        sender: "them",
        text: "Great. Also, the client wants a dark mode toggle added.",
        time: "10:52",
      },
      {
        id: "c-4",
        sender: "me",
        text: "Noted. I can add that in the current milestone — no extra charge.",
        time: "10:58",
      },
    ],
  },
  {
    id: "pocketfund",
    name: "PocketFund",
    avatarInitials: "PF",
    avatarColor: "#3E5C50",
    lastMessage: "Looks great! Ready to approve?",
    time: "10m",
    messages: [
      {
        id: "p-1",
        sender: "them",
        text: "Looks great! Ready to approve?",
        time: "09:30",
      },
    ],
  },
  {
    id: "kola-health",
    name: "Kola Health",
    avatarInitials: "KH",
    avatarColor: "#A8531E",
    lastMessage: "Thanks for the proposal!",
    time: "10m",
    messages: [
      {
        id: "k-1",
        sender: "them",
        text: "Thanks for the proposal!",
        time: "08:15",
      },
    ],
  },
];

function VerifiedBadge() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className="shrink-0"
      aria-label="Verified"
    >
      <circle cx="7" cy="7" r="7" fill="#0A66C2" />
      <path
        d="M4.4 7.3L6.1 9L9.7 5.2"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState(conversations);

  const active = threads.find((c) => c.id === activeId) ?? threads[0];

  function handleSelect(id: string) {
    setActiveId(id);
    setThreads((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    );
  }

  function handleSend() {
    const text = draft.trim();
    if (!text) return;

    setThreads((prev) =>
      prev.map((c) =>
        c.id === activeId ?
          {
            ...c,
            lastMessage: text,
            time: "Just now",
            messages: [
              ...c.messages,
              {
                id: `${c.id}-${c.messages.length + 1}`,
                sender: "me",
                text,
                time: "Just now",
              },
            ],
          }
        : c,
      ),
    );
    setDraft("");
  }

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-130 bg-white rounded-2xl border border-black/5 overflow-hidden">
      {/* Conversation list */}
      <div className="w-full sm:w-72 shrink-0 border-r border-black/5 flex flex-col">
        <div className="px-4 py-4 border-b border-black/5">
          <h2 className="text-2xl font-bold text-[#1B3A2F]">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-black/5 transition-colors ${
                  isActive ? "bg-[#FCEFE3]" : "hover:bg-[#F5F1E9]"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                  style={{ backgroundColor: c.avatarColor }}
                >
                  {c.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 min-w-0">
                      <span className="text-sm font-semibold text-[#1B3A2F] truncate">
                        {c.name}
                      </span>
                      {c.verified && <VerifiedBadge />}
                    </span>
                    <span className="text-[11px] text-[#9AA79F] shrink-0">
                      {c.time}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-0.5 truncate ${
                      c.unread ? "text-[#1B3A2F] font-medium" : "text-[#6B7A73]"
                    }`}
                  >
                    {c.lastMessage}
                  </p>
                </div>
                {c.unread && (
                  <span className="w-2 h-2 rounded-full bg-[#C6543A] mt-1.5 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active conversation */}
      <div className="hidden sm:flex flex-1 min-w-0 flex-col">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            style={{ backgroundColor: active.avatarColor }}
          >
            {active.avatarInitials}
          </div>
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-[#1B3A2F]">{active.name}</span>
            {active.verified && <VerifiedBadge />}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 bg-[#F5F1E9]/40">
          {active.messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                m.sender === "me" ?
                  "bg-[#A8531E] text-white self-end rounded-br-md"
                : "bg-white text-[#1B3A2F] border border-black/5 self-start rounded-bl-md"
              }`}
            >
              <p>{m.text}</p>
              <p
                className={`text-[10px] mt-1 ${
                  m.sender === "me" ? "text-white/70" : "text-[#9AA79F]"
                }`}
              >
                {m.time}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-black/5">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-[#F5F1E9] rounded-full px-4 py-2.5 text-sm text-[#1B3A2F] placeholder:text-[#9AA79F] focus:outline-none focus:ring-2 focus:ring-[#C6543A]/40"
          />
          <button
            onClick={handleSend}
            aria-label="Send message"
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-[#A8531E] text-white hover:bg-[#732700] transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
