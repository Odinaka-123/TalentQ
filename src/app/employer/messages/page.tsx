"use client";

import { useState } from "react";
import ConversationList from "./components/ConversationList";
import ChatThread from "./components/ChatThread";

export default function MessagesPage() {
  const [activeId, setActiveId] = useState("henrieta");

  return (
    <div className="flex flex-col sm:flex-row gap-4 h-[calc(100vh-160px)]">
      <ConversationList activeId={activeId} onSelect={setActiveId} />
      <ChatThread activeId={activeId} />
    </div>
  );
}
