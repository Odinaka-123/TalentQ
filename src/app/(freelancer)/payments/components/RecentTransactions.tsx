type Transaction = {
  title: string;
  meta: string;
  amount: string;
  positive: boolean;
};

export default function RecentTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-5 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#1F2A22]">
          Recent Transactions
        </h3>
        <button className="text-xs text-[#C6543A] font-medium">View all</button>
      </div>

      <div className="flex flex-col divide-y divide-[#EFEBE2]">
        {transactions.map((t, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="min-w-0">
              <p className="text-sm text-[#1F2A22] truncate">{t.title}</p>
              <p className="text-xs text-[#8A8A7E]">{t.meta}</p>
            </div>
            <p
              className={`text-sm font-semibold shrink-0 ${
                t.positive ? "text-[#3E8E5A]" : "text-[#C6543A]"
              }`}
            >
              {t.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
