"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  getApplicationPreview,
  type ApplicationPreview,
} from "@/lib/queries/application-preview";

type MilestoneRow = { title: string; amount: string; dueDate: string };

const emptyRow: MilestoneRow = { title: "", amount: "", dueDate: "" };

export default function SetupEscrow() {
  const router = useRouter();
  const params = useSearchParams();
  const applicationId = params.get("candidate");

  const [preview, setPreview] = useState<ApplicationPreview | null>(null);
  const [loading, setLoading] = useState(() => Boolean(applicationId));
  const [rows, setRows] = useState<MilestoneRow[]>([{ ...emptyRow }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) return;
    getApplicationPreview(applicationId).then((data) => {
      setPreview(data);
      setLoading(false);
    });
  }, [applicationId]);

  const updateRow = (index: number, patch: Partial<MilestoneRow>) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  };

  const addRow = () => setRows((prev) => [...prev, { ...emptyRow }]);
  const removeRow = (index: number) =>
    setRows((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );

  const isValid = rows.every((r) => r.title.trim() && Number(r.amount) > 0);

  const handleCreate = async () => {
    if (!applicationId || !isValid) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/employer/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          milestones: rows.map((r) => ({
            title: r.title.trim(),
            amount: Number(r.amount),
            dueDate: r.dueDate || null,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create contract");

      const firstMilestoneId = data.milestoneIds[0];
      router.push(
        `/employer/payments?tab=fund-milestone&milestone=${firstMilestoneId}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  if (!applicationId) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
        No candidate selected.
      </div>
    );
  }

  if (loading) {
    return <div className="rounded-2xl bg-white h-64 animate-pulse" />;
  }

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-1">
        Set Up Escrow
      </h3>
      <p className="text-xs text-[#8A8A7E] mb-6">
        {preview ?
          `${preview.jobTitle} · ${preview.freelancerName}`
        : "Define the milestones for this contract."}
      </p>

      <div className="flex flex-col gap-4 mb-5">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-3 items-start">
            <input
              type="text"
              value={row.title}
              onChange={(e) => updateRow(i, { title: e.target.value })}
              placeholder="Milestone title"
              className="flex-1 rounded-lg border border-[#E5E0D6] px-3 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            />
            <div className="relative w-full sm:w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#8A8A7E]">
                $
              </span>
              <input
                type="number"
                min="0"
                value={row.amount}
                onChange={(e) => updateRow(i, { amount: e.target.value })}
                placeholder="0.00"
                className="w-full rounded-lg border border-[#E5E0D6] pl-7 pr-3 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
              />
            </div>
            <input
              type="date"
              value={row.dueDate}
              onChange={(e) => updateRow(i, { dueDate: e.target.value })}
              className="w-full sm:w-40 rounded-lg border border-[#E5E0D6] px-3 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              disabled={rows.length === 1}
              aria-label="Remove milestone"
              className="shrink-0 p-2.5 text-[#8A8A7E] hover:text-[#C6543A] disabled:opacity-30"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1.5 text-xs font-medium text-[#C6543A] hover:underline mb-6"
      >
        <Plus size={14} /> Add another milestone
      </button>

      {error && <p className="text-xs text-[#C6543A] mb-4">{error}</p>}

      <button
        type="button"
        onClick={handleCreate}
        disabled={!isValid || submitting}
        className="w-full rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting && <Loader2 size={14} className="animate-spin" />}
        {submitting ?
          "Creating contract..."
        : "Create Contract & Continue to Fund"}
      </button>
    </div>
  );
}
