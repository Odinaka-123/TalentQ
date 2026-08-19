import Image from "next/image";

export default function TalentBanner() {
  return (
    <section className="w-full flex justify-center px-4 pb-16 sm:pb-20">
      <div className="relative w-full max-w-5xl rounded-4xl border border-[#E8A47E] overflow-hidden">
        <Image
          src="/Images/talent-banner.jpeg"
          alt="Freelancers collaborating"
          width={1200}
          height={400}
          className="w-full h-65 sm:h-75 object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white max-w-xl">
            Talent is ranked by track record, not by who pays the most.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-md">
            No paid placements. No boosted listings. What you see is who&apos;s
            actually delivering.
          </p>
        </div>
      </div>
    </section>
  );
}
