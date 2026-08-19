import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="w-full flex justify-center px-4 pb-16 sm:pb-20">
      <div className="w-full max-w-5xl rounded-4xl border border-[#E8A47E] bg-[#1B3A2F] px-6 sm:px-10 py-12 sm:py-16 flex flex-col items-center text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white max-w-2xl">
          Start free — no card required to browse or post.
        </h2>

        <p className="mt-4 text-sm sm:text-base text-[#8CABA1] max-w-lg">
          No paid placements. No boosted listings. What you see is who&apos;s
          actually delivering.
        </p>

        <Link
          href="/join"
          className="mt-8 rounded-sm bg-[#A8531E] px-10 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
        >
          Join us
        </Link>
      </div>
    </section>
  );
}
