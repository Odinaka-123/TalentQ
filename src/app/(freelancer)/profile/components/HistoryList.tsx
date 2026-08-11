import { Star } from "lucide-react";

type HistoryEntry = {
  client: string;
  role: string;
  date: string;
  rating: number;
  review: string;
};

const history: HistoryEntry[] = [
  {
    client: "Cloudscale Technologies",
    role: "React Developer",
    date: "Jun 2025",
    rating: 5,
    review: "Exceptional work. Delivered ahead of schedule.",
  },
  {
    client: "PocketFund",
    role: "UX Consultant",
    date: "Apr 2025",
    rating: 5,
    review: "Exceptional work. Delivered ahead of schedule.",
  },
  {
    client: "Kola Health",
    role: "Data Engineer",
    date: "Feb 2025",
    rating: 4.8,
    review: "Great communication. Clean, well-documented code.",
  },
];

export default function HistoryList() {
  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {history.map((entry, i) => (
          <div key={i} className={i === 0 ? "pb-5" : "py-5"}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#1F2A22]">
                  {entry.client}
                </p>
                <p className="text-xs text-[#8A8A7E] mt-0.5">
                  {entry.role} · {entry.date}
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-[#1F2A22] shrink-0">
                <Star size={14} className="fill-[#E8B33E] text-[#E8B33E]" />
                {entry.rating}
              </span>
            </div>
            <p className="text-sm text-[#5C5347] mt-2">{entry.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
