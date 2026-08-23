type ProgressBarProps = {
  step: number;
  totalSteps: number;
};

export default function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-1.5 mb-1">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < step ? "bg-[#A8531E]" : "bg-[#F2DFC8]"
          }`}
        />
      ))}
    </div>
  );
}
