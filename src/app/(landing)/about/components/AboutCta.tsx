export default function AboutCta() {
  return (
    <section className="w-full flex justify-center px-4 pb-16">
      <div className="w-full max-w-5xl rounded-[32px] border border-[#DE814A] bg-[#1B3A2F] px-6 sm:px-10 py-12 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-[#DE814A] mb-3">
          Ready to build your next opportunity?
        </h2>
        <p className="text-sm sm:text-base text-white/90 mb-8 max-w-xl mx-auto">
          Whether you&apos;re hiring exceptional professionals or looking for
          your next project, TalentQ helps you connect with confidence.
        </p>
        <button
          type="button"
          className="rounded-full bg-[#A8531E] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          Join Us
        </button>
      </div>
    </section>
  );
}
