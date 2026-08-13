import { Star } from "lucide-react";

type Review = {
  company: string;
  date: string;
  rating: number;
  comment: string;
};

const reviews: Review[] = [
  {
    company: "TechVentures Inc.",
    date: "June 2026",
    rating: 5,
    comment:
      "Henrieta delivered a world class React dashboard on time and under budget. Exceptional communication.",
  },
  {
    company: "GlobalOps Limited",
    date: "March 2026",
    rating: 5,
    comment:
      "One of the best engineers we've hired remotely. Very thorough, proactive, and detail-oriented.",
  },
  {
    company: "Startup Hub",
    date: "January 2026",
    rating: 5,
    comment:
      "Solid work, great communicator. Would hire again without hesitation.",
  },
];

export default function ReviewTab() {
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <div
          key={review.company}
          className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-5"
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <p className="text-sm font-semibold text-[#1F2A22]">
              {review.company}
            </p>
            <p className="text-xs text-[#8A8A7E] shrink-0">{review.date}</p>
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

          <p className="text-sm text-[#5C5347]">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
