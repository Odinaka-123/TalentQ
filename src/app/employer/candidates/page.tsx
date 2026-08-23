"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getEmployerPipeline,
  type PipelineCandidate,
  type PipelineStatus,
} from "@/lib/queries/candidates";
import PipelineStats from "./components/PipelineStats";
import StatusFilterTabs from "./components/StatusFilterTabs";
import CandidatesTable from "./components/CandidatesTable";

type FilterKey = "all" | PipelineStatus;

export default function CandidatesPage() {
  const supabase = createClient();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<PipelineCandidate[]>([]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const result = await getEmployerPipeline(user.id);
      setCandidates(result);
      setLoading(false);
    };

    load();
  }, [supabase]);

  const filtered =
    filter === "all" ? candidates : (
      candidates.filter((c) => c.status === filter)
    );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white h-20" />
          ))}
        </div>
        <div className="h-12 rounded-2xl bg-white mb-4" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PipelineStats candidates={candidates} />
      <StatusFilterTabs active={filter} onChange={setFilter} />
      <CandidatesTable candidates={filtered} />
    </div>
  );
}
