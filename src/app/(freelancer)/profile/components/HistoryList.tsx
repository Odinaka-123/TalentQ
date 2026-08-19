import { Star } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  contracts: {
    employer_id: string;
    jobs: { title: string }[];
    profiles: { full_name: string | null }[];
  }[];
};

type HistoryListProps = {
  reviews: Review[];
};

export default function HistoryList({ reviews }: HistoryListProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
        No reviews yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {reviews.map((review, i) => {
          const contract = review.contracts?.[0];
          const job = contract?.jobs?.[0];
          const employer = contract?.profiles?.[0];

          return (
            <div key={review.id} className={i === 0 ? "pb-5" : "py-5"}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#1F2A22]">
                    {employer?.full_name ?? "Client"}
                  </p>
                  <p className="text-xs text-[#8A8A7E] mt-0.5">
                    {job?.title ?? "Contract"} ·{" "}
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-[#1F2A22] shrink-0">
                  <Star size={14} className="fill-[#E8B33E] text-[#E8B33E]" />
                  {review.rating}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-[#5C5347] mt-2">{review.comment}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
