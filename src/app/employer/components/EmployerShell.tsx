"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function EmployerShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex bg-[#F5F1E9] min-h-screen">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onMenuClick={() => setIsOpen(true)} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
