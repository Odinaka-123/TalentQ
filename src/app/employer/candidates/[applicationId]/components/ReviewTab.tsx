import { Star } from "lucide-react";

type ReviewTabProps = {
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    employerName: string;
  }[];
};

export default function ReviewTab({ reviews }: ReviewTabProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
        No reviews yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-5"
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <p className="text-sm font-semibold text-[#1F2A22]">
              {review.employerName}
            </p>
            <p className="text-xs text-[#8A8A7E] shrink-0">
              {new Date(review.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < review.rating ?
                    "fill-[#DE814A] text-[#DE814A]"
                  : "fill-[#E5E0D6] text-[#E5E0D6]"
                }
              />
            ))}
          </div>

          {review.comment && (
            <p className="text-sm text-[#5C5347]">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
