"use client";

import { useEffect, useState } from "react";
import {
  getAvailableTalent,
  type TalentListing,
} from "@/lib/queries/talent-directory";
import TalentCard from "./TalentCard";

export default function TalentList({ search }: { search: string }) {
  const [loading, setLoading] = useState(true);
  const [talent, setTalent] = useState<TalentListing[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await getAvailableTalent();
      setTalent(result);
      setLoading(false);
    };
    load();
  }, []);

  const filtered =
    search.trim() === "" ?
      talent
    : talent.filter((t) => {
        const q = search.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.headline.toLowerCase().includes(q) ||
          t.skills.some((s) => s.toLowerCase().includes(q))
        );
      });

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-white animate-pulse" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
        No talent found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {filtered.map((t) => (
        <TalentCard key={t.freelancerId} {...t} />
      ))}
    </div>
  );
}
