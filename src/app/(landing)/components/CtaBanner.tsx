"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const MotionLink = motion.create(Link);

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

export default function CtaBanner() {
  return (
    <section className="w-full flex justify-center px-4 pb-16 sm:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl rounded-4xl border border-[#E8A47E] bg-[#1B3A2F] px-6 sm:px-10 py-12 sm:py-16 flex flex-col items-center text-center"
      >
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col items-center"
        >
          <motion.h2
            variants={item}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white max-w-2xl"
          >
            Start free — no card required to browse or post.
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-4 text-sm sm:text-base text-[#8CABA1] max-w-lg"
          >
            No paid placements. No boosted listings. What you see is who&apos;s
            actually delivering.
          </motion.p>

          <motion.div variants={button}>
            <MotionLink
              href="/join"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="mt-8 inline-block rounded-sm bg-[#A8531E] px-10 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
            >
              Join us
            </MotionLink>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
