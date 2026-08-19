type Action = {
  title: string;
  subtitle: string;
  points: number;
};

const actions: Action[] = [
  { title: "Post assessment brief", subtitle: "Matching", points: 12 },
  { title: "Get first talent review", subtitle: "Trust", points: 10 },
  { title: "Complete your company profile", subtitle: "Profile", points: 8 },
  { title: "Improve response time", subtitle: "", points: 4 },
];

export default function ScoreImprovement() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
        Score Improvement
      </h3>

      <div className="space-y-4">
        {actions.map((a, i) => (
          <div key={a.title} className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#732700] text-white text-[11px] font-semibold shrink-0">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-xs font-medium text-[#1F2A22]">{a.title}</p>
              {a.subtitle && (
                <p className="text-[11px] text-[#8A8A7E]">{a.subtitle}</p>
              )}
            </div>
            <span className="text-xs font-semibold text-[#3E8E5A]">
              +{a.points}pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
