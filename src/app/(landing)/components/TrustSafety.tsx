"use client";

import { motion, type Variants } from "framer-motion";

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

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const heading: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function TrustSafety() {
  return (
    <section className="w-full flex justify-center px-4 pb-16 sm:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl rounded-4xl border border-[#E8A47E] bg-white px-6 sm:px-10 py-10 sm:py-12 shadow-[0px_4px_4px_0px_#E6AB86]"
      >
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={heading}
          className="text-xs sm:text-sm font-semibold tracking-wide text-[#C6543A] uppercase mb-3"
        >
          Trust & safety
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={heading}
          transition={{ delay: 0.05 }}
          className="text-2xl sm:text-3xl font-bold text-[#1F2A22] mb-10"
        >
          Built to stop the two things that ruin marketplaces
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
        >
          {items.map((item2, i) => (
            <motion.div
              key={i}
              variants={item}
              className="rounded-2xl border border-[#E5E0D6] bg-white px-5 sm:px-6 py-6 shadow-[0px_2px_8px_0px_#00000014] transition-all hover:bg-[#FFCA8F] hover:border-[#1F2A22] hover:shadow-[0px_4px_10px_3px_#DE814A]"
            >
              <h3 className="text-base sm:text-lg font-semibold text-[#1F2A22] mb-2 whitespace-pre-line">
                {item2.title}
              </h3>
              <p className="text-sm text-[#4A4A42]">{item2.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}