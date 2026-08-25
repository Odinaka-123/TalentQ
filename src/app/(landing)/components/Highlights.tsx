"use client";

import { Search, BadgeCheck, Sparkle, Shield, Wallet } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const highlights = [
  { icon: Search, label: "Discover Verified\nAfrican Talent" },
  { icon: BadgeCheck, label: "AI That Matches the\nRight Talent" },
  { icon: Sparkle, label: "Hire with\nConfidence" },
  { icon: Shield, label: "Hire with\nConfidence" },
  { icon: Wallet, label: "Hire with\nConfidence" },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.6,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export default function Highlights() {
  return (
    <section className="w-full flex justify-center px-4 -mt-10 sm:-mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="w-full max-w-5xl rounded-4xl border border-[#E8A47E] bg-white shadow-[0px_4px_10px_3px_#DE814A1A] px-6 sm:px-10 py-8 sm:py-10 flex flex-wrap justify-between gap-8"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="contents"
        >
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center text-center flex-1 min-w-30"
            >
              <h.icon size={28} className="text-[#1B3A2F] mb-3" />
              <p className="text-sm font-medium text-[#1F2A22] whitespace-pre-line">
                {h.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}