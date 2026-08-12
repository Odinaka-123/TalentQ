type MonthData = {
  month: string;
  posted: number;
  hired: number;
};

const data: MonthData[] = [
  { month: "Mar", posted: 4, hired: 1 },
  { month: "Apr", posted: 6, hired: 3 },
  { month: "May", posted: 9, hired: 4 },
  { month: "Jun", posted: 6, hired: 3 },
  { month: "Jul", posted: 10, hired: 5 },
];

export default function HireConversion() {
  const max = Math.max(...data.map((d) => d.posted));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-[#1F2A22]">
          Hire Conversion
        </h3>
        <span className="text-xs font-semibold text-[#3E8E5A]">+40% rate</span>
      </div>
      <p className="text-xs text-[#8A8A7E] mb-4">
        Job posts vs. hires over 5 months
      </p>

      <div className="flex items-end justify-between gap-4 h-40 px-2">
        {data.map((d) => (
          <div
            key={d.month}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <div
              className="w-full max-w-9 rounded-t-md bg-[#FBEADB] flex flex-col justify-end overflow-hidden"
              style={{ height: `${(d.posted / max) * 100}%` }}
            >
              <div
                className="w-full bg-[#732700] rounded-t-md"
                style={{ height: `${(d.hired / d.posted) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-[#8A8A7E]">{d.month}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-3 text-[11px] text-[#8A8A7E]">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#FBEADB] inline-block" />
          Posted
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#732700] inline-block" />
          Hired
        </span>
      </div>
    </div>
  );
}
