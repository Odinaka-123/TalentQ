import Image from "next/image";

const testimonials = [
  {
    quote:
      "Got my first contract 9 days after signing up. The escrow made my client comfortable paying upfront.",
    name: "Shola",
    role: "Graphic Designer, Lagos",
    avatar: "/images/testimonials/shola.png",
  },
  {
    quote:
      "I could finally tell who was real. Verified badges saved me from two listings that looked fake.",
    name: "Felicia Chidi",
    role: "Small business owner, Abuja",
    avatar: "/images/testimonials/felicia.png",
  },
  {
    quote:
      "Milestone payments meant I didn't have to chase anyone for money halfway through the project.",
    name: "Koffi Angela",
    role: "Full Stack Developer, Accra",
    avatar: "/images/testimonials/koffi.png",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full flex justify-center px-4 pb-16 sm:pb-20">
      <div className="w-full max-w-5xl">
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#C6543A] uppercase mb-3">
          From people using it
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2A22] mb-12 sm:mb-14">
          Real outcomes, not slogans
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-14">
          {testimonials.map((t, i) => (
            <div key={i} className="relative pt-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-[#DE814A] overflow-hidden bg-[#E5E0D6]">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl bg-[#DAD5C9] px-5 sm:px-6 pt-10 pb-6 text-center">
                <p className="text-sm text-[#8A4A2A] mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm font-semibold text-[#1F2A22]">{t.name}</p>
                <p className="text-xs text-[#C6543A]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
