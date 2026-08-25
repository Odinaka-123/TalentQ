"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="w-full flex justify-center px-4 pt-8 sm:pt-12 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl rounded-full border border-[#DE814A] bg-white px-6 py-4"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-2xl sm:text-3xl font-bold text-[#C6543A] text-center"
        >
          About Us
        </motion.h1>
      </motion.div>
    </section>
  );
}