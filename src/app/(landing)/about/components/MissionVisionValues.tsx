"use client";

import { motion, type Variants } from "framer-motion";

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

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const column: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const pill: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 },
  },
};

export default function MissionVisionValues() {
  return (
    <section className="w-full flex justify-center px-4 pb-6">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {cards.map((card) => (
          <motion.div key={card.label} variants={column} className="flex flex-col gap-3">
            <motion.div
              variants={pill}
              className="rounded-full border border-[#DE814A] bg-white px-4 py-3"
            >
              <h3 className="text-base sm:text-lg font-bold text-[#C6543A] text-center">
                {card.label}
              </h3>
            </motion.div>

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
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}