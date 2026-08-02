import Image from "next/image";

export default function TalentBanner() {
  return (
    <section className="w-full flex justify-center px-4 pb-16 sm:pb-20">
      <div className="relative w-full max-w-5xl rounded-4xl border border-[#E8A47E] overflow-hidden">
        <Image
          src="/images/talent-banner.png"
          alt="Talent is ranked by track record, not by who pays the most."
          width={1200}
          height={400}
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
}
