type Card = {
  label: string;
  heading?: string;
  paragraph?: string;
  bullets?: string[];
};

const cards: Card[] = [
  {
    label: "Our Mission",
    heading: "Creating opportunities through trust.",
    paragraph:
      "Our mission is to empower African professionals by connecting them with global employers through intelligent matching, verified profiles, and secure collaboration.",
  },
  {
    label: "Our Vision",
    heading:
      "Building the world's most trusted marketplace for African talent.",
    paragraph:
      "We believe African professionals deserve equal access to the global digital economy. TalentQ exists to remove barriers and create a future where talent—not geography—determines opportunity.",
  },
  {
    label: "Our Values",
    heading: "Trust, Excellence, Inclusion, Innovation",
    bullets: [
      "Building confidence between freelancers and employers",
      "Promoting quality work and professional growth.",
      "Creating opportunities regardless of location.",
      "Using technology to simplify hiring and collaboration.",
    ],
  },
];

export default function MissionVisionValues() {
  return (
    <section className="w-full flex justify-center px-4 pb-6">
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="flex flex-col gap-3">
            <div className="rounded-full border border-[#DE814A] bg-white px-4 py-3">
              <h3 className="text-base sm:text-lg font-bold text-[#C6543A] text-center">
                {card.label}
              </h3>
            </div>

            <div className="flex-1 rounded-[28px] border border-[#DE814A] bg-[#1B3A2F] px-5 py-6">
              <p className="text-sm font-bold text-[#DE814A] mb-3">
                {card.heading}
              </p>
              {card.paragraph && (
                <p className="text-sm text-white/90">{card.paragraph}</p>
              )}
              {card.bullets && (
                <ul className="flex flex-col gap-1.5">
                  {card.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-sm text-white/90 flex gap-2"
                    >
                      <span className="shrink-0">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
