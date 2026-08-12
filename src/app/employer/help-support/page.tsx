"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import HelpTabs from "./components/HelpTabs";
import GuidesFaqs from "./components/GuidesFaqs";
import ContactSupport from "./components/ContactSupport";

type Tab = "guides" | "contact";

export default function EmployerHelpSupportPage() {
  const [activeTab, setActiveTab] = useState<Tab>("guides");

  return (
    <div>
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-5 sm:px-6 py-5 mb-6">
        <h2 className="text-sm font-semibold text-[#1F2A22] mb-1">
          How can we help?
        </h2>
        <p className="text-xs text-[#8A8A7E] mb-3">
          Search our guides or contact support — we respond within 4 hours.
        </p>
        <div className="flex items-center gap-2 rounded-full border border-[#E5E0D6] bg-[#F5F1E9] px-4 py-2 max-w-md">
          <Search size={16} className="text-[#8A8A7E] shrink-0" />
          <input
            type="text"
            placeholder="Search guides, FAQs, or topics..."
            className="flex-1 bg-transparent text-sm text-[#1F2A22] placeholder:text-[#8A8A7E] outline-none"
          />
        </div>
      </div>

      <HelpTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "guides" ?
        <GuidesFaqs />
      : <ContactSupport />}
    </div>
  );
}
