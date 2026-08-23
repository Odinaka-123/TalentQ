import { Star } from "lucide-react";

type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  contracts:
    | {
        freelancer_id: string;
        jobs: { title: string } | { title: string }[] | null;
        profiles: { full_name: string } | { full_name: string }[] | null;
      }
    | {
        freelancer_id: string;
        jobs: { title: string } | { title: string }[] | null;
        profiles: { full_name: string } | { full_name: string }[] | null;
      }[]
    | null;
};

type HistoryListProps = {
  reviews: ReviewRow[];
};

function firstOrSelf<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default function HistoryList({ reviews }: HistoryListProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-6 py-16 text-center text-sm text-[#8A8A7E] shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
        No reviews yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {reviews.map((entry, i) => {
          const contract = firstOrSelf(entry.contracts);
          const job = firstOrSelf(contract?.jobs ?? null);
          const freelancer = firstOrSelf(contract?.profiles ?? null);

          return (
            <div key={entry.id} className={i === 0 ? "pb-5" : "py-5"}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#1F2A22]">
                    {freelancer?.full_name ?? "Unknown freelancer"}
                  </p>
                  <p className="text-xs text-[#8A8A7E] mt-0.5">
                    {job?.title ?? "Untitled role"} ·{" "}
                    {new Date(entry.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-[#1F2A22] shrink-0">
                  <Star size={14} className="fill-[#DE814A] text-[#DE814A]" />
                  {entry.rating}
                </span>
              </div>
              {entry.comment && (
                <p className="text-sm text-[#5C5347] mt-2">{entry.comment}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
