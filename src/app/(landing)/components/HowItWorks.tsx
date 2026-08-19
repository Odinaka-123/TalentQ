const steps = [
  {
    title: "Client funds the milestone",
    description:
      "Money is held safely in escrow the moment a job is agreed — not paid out yet.",
  },
  {
    title: "Freelancer delivers the work",
    description:
      "Work is submitted through the platform, tied to that specific milestone.",
  },
  {
    title: "Funds release on approval",
    description:
      "Once the client approves, payment reaches the freelancer — automatically.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full flex justify-center px-4 py-16 sm:py-20">
      <div className="w-full max-w-5xl">
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#C6543A] uppercase mb-3">
          How it works
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2A22] mb-10 sm:mb-12">
          Your payment is protected at every step
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-3xl border border-[#C36A34] px-5 sm:px-6 py-6"
            >
              <h3 className="text-sm sm:text-base font-semibold text-[#1F2A22] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#C6543A]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
