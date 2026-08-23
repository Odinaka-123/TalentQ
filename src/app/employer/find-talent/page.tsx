"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import AlertBanner from "./components/AlertBanner";
import FirstHireBanner from "./components/FirstHireBanner";
import TalentList from "./components/TalentList";

export default function FindTalentPage() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A7E]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, skill, or role..."
          className="w-full rounded-full border border-[#E5E0D6] bg-white pl-11 pr-4 py-3 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
        />
      </div>

      <AlertBanner />
      <FirstHireBanner />
      <TalentList search={search} />
    </div>
  );
}
