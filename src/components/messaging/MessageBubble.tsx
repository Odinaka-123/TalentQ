"use client";

import { useState } from "react";
import { Reply, Smile, Trash2, Check, CheckCheck } from "lucide-react";
import type { ChatMessage } from "@/lib/queries/messages";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

interface ReactionGroup {
  count: number;
  reactedByMe: boolean;
}

type MessageBubbleProps = {
  message: ChatMessage;
  isMe: boolean;
  currentUserId: string;
  replyToMessage: ChatMessage | null;
  seen: boolean;
  onReply: (message: ChatMessage) => void;
  onDelete: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
};

export default function MessageBubble({
  message,
  isMe,
  currentUserId,
  replyToMessage,
  seen,
  onReply,
  onDelete,
  onReact,
}: MessageBubbleProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const isDeleted = Boolean(message.deletedAt);

  const reactionGroups = message.reactions.reduce<Record<string, ReactionGroup>>(
    (acc, r) => {
    const entry = acc[r.emoji] ?? { count: 0, reactedByMe: false };
    entry.count += 1;
    if (r.userId === currentUserId) entry.reactedByMe = true;
    acc[r.emoji] = entry;
    return acc;
    },
    {},
  );

  return (
    <div
      className={`group flex flex-col max-w-[75%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
    >
      <div className="flex items-center gap-1.5">
        {isMe && !isDeleted && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onDelete(message.id)}
              aria-label="Delete message"
              className="p-1.5 rounded-full text-[#9AA79F] hover:text-[#C6543A] hover:bg-black/5"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}

        <div
          className={`relative px-4 py-2.5 rounded-2xl text-sm ${
            isDeleted ?
              "bg-transparent border border-dashed border-black/10 text-[#9AA79F] italic"
            : isMe ?
              "bg-[#A8531E] text-white rounded-br-md"
            : "bg-white text-[#1B3A2F] border border-black/5 rounded-bl-md"
          }`}
        >
          {!isDeleted && replyToMessage && (
            <div
              className={`mb-1.5 pl-2 border-l-2 text-xs opacity-80 truncate max-w-60 ${
                isMe ? "border-white/50" : "border-black/20"
              }`}
            >
              {replyToMessage.deletedAt ?
                "Original message deleted"
              : replyToMessage.content}
            </div>
          )}

          <p>{isDeleted ? "This message was deleted" : message.content}</p>

          <div
            className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : ""}`}
          >
            <p
              className={`text-[10px] ${isMe ? "text-white/70" : "text-[#9AA79F]"}`}
            >
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {isMe && !isDeleted && (
              seen ?
                <CheckCheck size={13} className="text-white/90" />
              : <Check size={13} className="text-white/70" />
            )}
          </div>
        </div>

        {!isDeleted && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative">
            <button
              type="button"
              onClick={() => onReply(message)}
              aria-label="Reply"
              className="p-1.5 rounded-full text-[#9AA79F] hover:text-[#1B3A2F] hover:bg-black/5"
            >
              <Reply size={13} />
            </button>
            <button
              type="button"
              onClick={() => setPickerOpen((open) => !open)}
              aria-label="React"
              className="p-1.5 rounded-full text-[#9AA79F] hover:text-[#1B3A2F] hover:bg-black/5"
            >
              <Smile size={13} />
            </button>

            {pickerOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setPickerOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className={`absolute z-50 top-full mt-1 flex items-center gap-1 bg-white rounded-full shadow-lg border border-[#F0ECE3] px-2 py-1.5 ${
                    isMe ? "right-0" : "left-0"
                  }`}
                >
                  {QUICK_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        onReact(message.id, emoji);
                        setPickerOpen(false);
                      }}
                      className="text-base hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {!isDeleted && Object.keys(reactionGroups).length > 0 && (
        <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? "justify-end" : ""}`}>
          {Object.entries(reactionGroups).map(([emoji, { count, reactedByMe }]) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onReact(message.id, emoji)}
              className={`flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border transition-colors ${
                reactedByMe ?
                  "bg-[#FCEFE3] border-[#DE814A]"
                : "bg-white border-black/10 hover:bg-[#F5F1E9]"
              }`}
            >
              <span>{emoji}</span>
              {count > 1 && <span className="text-[#6B7A73]">{count}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
