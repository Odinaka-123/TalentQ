"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const button: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export default function AboutCta() {
  return (
    <section className="w-full flex justify-center px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl rounded-4xl border border-[#DE814A] bg-[#1B3A2F] px-6 sm:px-10 py-12 text-center"
      >
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h2
            variants={item}
            className="text-xl sm:text-2xl font-bold text-[#DE814A] mb-3"
          >
            Ready to build your next opportunity?
          </motion.h2>
          <motion.p
            variants={item}
            className="text-sm sm:text-base text-white/90 mb-8 max-w-xl mx-auto"
          >
            Whether you&apos;re hiring exceptional professionals or looking
            for your next project, TalentQ helps you connect with confidence.
          </motion.p>
          <motion.button
            type="button"
            variants={button}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="rounded-full bg-[#A8531E] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
          >
            Join Us
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}