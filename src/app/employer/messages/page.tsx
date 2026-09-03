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
        <div className="flex h-[calc(100vh-140px)] min-h-130 bg-white rounded-2xl border border-black/5 overflow-hidden animate-pulse">
            <div className="w-full sm:w-72 shrink-0 border-r border-black/5 flex flex-col">
                <div className="px-4 py-4 border-b border-black/5">
                    <div className="h-6 w-28 rounded bg-[#EDEAE1]" />
                </div>
            </div>
            <div className="hidden sm:block flex-1" />
        </div>
    );
}