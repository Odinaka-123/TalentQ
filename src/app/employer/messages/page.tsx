import { Suspense } from "react";
import MessagesContent from "./messages-content";

export default function EmployerMessagesPage() {
  return (
    <Suspense fallback={<MessagesLoadingSkeleton />}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesLoadingSkeleton() {
  return (
    <div className="flex h-[calc(100vh-140px)] min-h-130 bg-white rounded-2xl border border-black/5 overflow-hidden">
      {/* Conversation list skeleton */}
      <div className="w-full sm:w-72 shrink-0 border-r border-black/5 flex flex-col">
        <div className="px-4 py-4 border-b border-black/5">
          <div className="h-6 w-28 rounded-md bg-[#EDEAE1] animate-pulse" />
        </div>

        <div className="flex-1 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 border-b border-black/5"
            >
              <div
                className="w-10 h-10 rounded-full bg-[#EDEAE1] animate-pulse shrink-0"
                style={{ animationDelay: `${i * 60}ms` }}
              />
              <div className="min-w-0 flex-1 py-0.5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className="h-3.5 rounded bg-[#EDEAE1] animate-pulse"
                    style={{ width: `${55 + (i % 3) * 15}%`, animationDelay: `${i * 60}ms` }}
                  />
                  <div
                    className="h-2.5 w-8 rounded bg-[#EDEAE1] animate-pulse shrink-0"
                    style={{ animationDelay: `${i * 60}ms` }}
                  />
                </div>
                <div
                  className="h-3 rounded bg-[#F0ECE3] animate-pulse"
                  style={{ width: `${70 + (i % 2) * 20}%`, animationDelay: `${i * 60}ms` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active conversation skeleton */}
      <div className="hidden sm:flex flex-1 min-w-0 flex-col">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
          <div className="w-10 h-10 rounded-full bg-[#EDEAE1] animate-pulse" />
          <div className="h-4 w-32 rounded bg-[#EDEAE1] animate-pulse" />
        </div>

        <div className="flex-1 px-5 py-4 flex flex-col gap-3 bg-[#F5F1E9]/40">
          <div className="h-10 w-2/5 rounded-2xl rounded-bl-md bg-white border border-black/5 animate-pulse self-start" />
          <div className="h-14 w-1/2 rounded-2xl rounded-br-md bg-[#EDEAE1] animate-pulse self-end" />
          <div className="h-10 w-3/5 rounded-2xl rounded-bl-md bg-white border border-black/5 animate-pulse self-start" />
          <div className="h-10 w-1/3 rounded-2xl rounded-br-md bg-[#EDEAE1] animate-pulse self-end" />
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-black/5">
          <div className="flex-1 h-10 rounded-full bg-[#F5F1E9] animate-pulse" />
          <div className="w-10 h-10 rounded-full bg-[#EDEAE1] animate-pulse shrink-0" />
        </div>
      </div>
    </div>
  );
}