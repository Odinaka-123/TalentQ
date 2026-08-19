type Step = {
  number: number;
  label: string;
};

const steps: Step[] = [
  { number: 1, label: "Job Details" },
  { number: 2, label: "Requirements" },
  { number: 3, label: "Compensation" },
  { number: 4, label: "Preview & Post" },
];

export default function PostJobStepper({ current }: { current: number }) {
  return (
    <div className="rounded-2xl bg-[#F2DFC8] px-4 py-4 mb-6">
      <div className="flex items-center">
        {steps.map((step, i) => {
          const isActive = step.number === current;
          const isComplete = step.number < current;
          return (
            <div
              key={step.number}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold shrink-0 ${
                    isActive ? "bg-[#A8531E] text-white"
                    : isComplete ? "bg-[#3E8E5A] text-white"
                    : "bg-white text-[#8A8A7E]"
                  }`}
                >
                  {step.number}
                </span>
                <span
                  className={`text-sm whitespace-nowrap ${
                    isActive ? "text-[#1F2A22] font-medium" : "text-[#8A8A7E]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-[#E8C9A8] mx-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
