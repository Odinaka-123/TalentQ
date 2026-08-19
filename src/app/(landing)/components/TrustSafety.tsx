const items = [
  {
    title: "LinkedIn-based\nidentity verification",
    description:
      "Every verified badge means a real person, checked against a real professional profile.",
  },
  {
    title: "Escrow on every job",
    description:
      "Your money is never sent directly — it's held until both sides agree the work is done.",
  },
  {
    title: "Report a fake listing\nin one tap",
    description:
      "Every profile and job post has a visible report button — reviewed by a real person, not ignored.",
  },
];

export default function TrustSafety() {
  return (
    <section className="w-full flex justify-center px-4 pb-16 sm:pb-20">
      <div className="w-full max-w-5xl rounded-4xl border border-[#E8A47E] bg-white px-6 sm:px-10 py-10 sm:py-12 shadow-[0px_4px_4px_0px_#E6AB86]">
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#C6543A] uppercase mb-3">
          Trust & safety
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2A22] mb-10">
          Built to stop the two things that ruin marketplaces
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E5E0D6] bg-white px-5 sm:px-6 py-6 shadow-[0px_2px_8px_0px_#00000014] transition-all hover:bg-[#FFCA8F] hover:border-[#1F2A22] hover:shadow-[0px_4px_10px_3px_#DE814A]"
            >
              <h3 className="text-base sm:text-lg font-semibold text-[#1F2A22] mb-2 whitespace-pre-line">
                {item.title}
              </h3>
              <p className="text-sm text-[#4A4A42]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
