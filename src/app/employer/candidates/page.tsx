"use client";

import { useState } from "react";
import { pipelineCandidates } from "./pipelineData";
import PipelineStats from "./components/PipelineStats";
import StatusFilterTabs from "./components/StatusFilterTabs";
import CandidatesTable from "./components/CandidatesTable";

type FilterKey = "all" | "Applied" | "Invited" | "Interviewing" | "Offer Sent" | "Hired";

export default function CandidatesPage() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered =
    filter === "all"
      ? pipelineCandidates
      : pipelineCandidates.filter((c) => c.status === filter);

  return (
    <div>
      <PipelineStats />
      <StatusFilterTabs active={filter} onChange={setFilter} />
      <CandidatesTable candidates={filtered} />
    </div>
  );
}