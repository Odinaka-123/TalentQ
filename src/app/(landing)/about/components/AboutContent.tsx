"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AboutContent() {
  return (
    <section className="w-full flex justify-center px-4 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl rounded-4xl border border-[#DE814A] bg-[#1B3A2F] px-6 sm:px-12 py-10 sm:py-14"
      >
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            variants={item}
            className="text-xl sm:text-2xl font-bold text-[#DE814A] mb-5"
          >
            Talent exists everywhere. Opportunity doesn&apos;t.
          </motion.h2>
          <div className="flex flex-col gap-4 text-sm sm:text-base text-white/90 max-w-2xl">
            <motion.p variants={item}>
              Africa is home to one of the world&apos;s fastest-growing
              communities of developers, designers, marketers, writers,
              researchers, consultants, and digital professionals. Yet many
              struggle to access global opportunities—not because they lack
              skills, but because they struggle to gain visibility and earn
              trust.
            </motion.p>
            <motion.p variants={item}>
              TalentQ was created to change that.
            </motion.p>
            <motion.p variants={item}>
              Instead of competing in crowded marketplaces driven by low
              prices and unverified profiles, TalentQ gives skilled African
              professionals a platform where credibility comes first.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}