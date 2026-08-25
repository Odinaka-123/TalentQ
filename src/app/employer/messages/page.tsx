"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getConversations,
  getMessages,
  sendMessage,
  markConversationRead,
  subscribeToMessages,
  type ConversationSummary,
  type ChatMessage,
} from "@/lib/queries/messages";
import Avatar from "@/components/Avatar";

export default function EmployerMessagesPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);
      const convos = await getConversations(user.id);
      setConversations(convos);
      if (convos.length > 0) setActiveId(convos[0].id);
      setLoading(false);
    };

    init();
  }, [supabase]);

  useEffect(() => {
    if (!activeId || !userId) return;

    let unsubscribe: (() => void) | undefined;

    const loadThread = async () => {
      const msgs = await getMessages(activeId);
      setMessages(msgs);
      await markConversationRead(activeId, userId);
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, unread: false } : c)),
      );

      unsubscribe = subscribeToMessages(activeId, (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });
    };

    loadThread();

    return () => {
      unsubscribe?.();
    };
  }, [activeId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !activeId || !userId) return;

    setDraft("");
    await sendMessage(activeId, userId, text);
    // Realtime subscription above will append it — no need to update state manually here
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-140px)] min-h-130 bg-white rounded-2xl border border-black/5 overflow-hidden animate-pulse">
        <div className="w-full sm:w-72 shrink-0 border-r border-black/5 flex flex-col">
          <div className="px-4 py-4 border-b border-black/5">
            <div className="h-6 w-28 rounded bg-[#EDEAE1]" />
          </div>
          <div className="flex-1 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 border-b border-black/5"
              >
                <div className="w-10 h-10 rounded-full bg-[#EDEAE1] shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="h-3.5 w-24 rounded bg-[#EDEAE1]" />
                    <div className="h-2.5 w-8 rounded bg-[#F0ECE3]" />
                  </div>
                  <div className="h-3 w-32 max-w-full rounded bg-[#F0ECE3]" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:block flex-1" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-16 text-sm text-[#6B7A73]">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-130 bg-white rounded-2xl border border-black/5 overflow-hidden">
      <div className="w-full sm:w-72 shrink-0 border-r border-black/5 flex flex-col">
        <div className="px-4 py-4 border-b border-black/5">
          <h2 className="text-2xl font-bold text-[#1B3A2F]">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-black/5 transition-colors ${isActive ? "bg-[#FCEFE3]" : "hover:bg-[#F5F1E9]"
                  }`}
              >
                <Avatar src={c.avatarUrl} name={c.name} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#1B3A2F] truncate">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-[#9AA79F] shrink-0">
                      {new Date(c.lastMessageAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-0.5 truncate ${c.unread ? "text-[#1B3A2F] font-medium" : "text-[#6B7A73]"
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

      <div className="hidden sm:flex flex-1 min-w-0 flex-col">
        {active && (
          <>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
              <Avatar src={active.avatarUrl} name={active.name} size={40} />
              <span className="font-semibold text-[#1B3A2F]">
                {active.name}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 bg-[#F5F1E9]/40">
              {messages.map((m) => {
                const isMe = m.senderId === userId;
                return (
                  <div
                    key={m.id}
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ?
                        "bg-[#A8531E] text-white self-end rounded-br-md"
                        : "bg-white text-[#1B3A2F] border border-black/5 self-start rounded-bl-md"
                      }`}
                  >
                    <p>{m.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${isMe ? "text-white/70" : "text-[#9AA79F]"}`}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
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
          </>
        )}
      </div>
    </div>
  );
}