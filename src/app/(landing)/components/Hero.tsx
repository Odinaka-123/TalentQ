"use client";

import { motion, type Variants } from "framer-motion";
import { Search } from "lucide-react";
import TypingText from "./TypingText";

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
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  return (
    <section className="w-full flex justify-center px-4 pt-8 sm:pt-15 pb-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          boxShadow: [
            "0px 4px 10px 3px #DE814A",
            "0px 4px 18px 6px #DE814A",
            "0px 4px 10px 3px #DE814A",
          ],
        }}
        transition={{
          opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          boxShadow: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7,
          },
        }}
        className="w-full max-w-6xl rounded-4xl border border-[#C36A34] bg-[#1B3A2F] px-5 sm:px-6 py-12 sm:py-16 md:py-20 flex flex-col items-center text-center"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.span
            variants={item}
            className="rounded-full border border-[#749389] bg-[#48655C] px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-[#C36A34] mb-6 sm:mb-8"
          >
            <TypingText text="Built for African freelancers and businesses" />
          </motion.span>

          <motion.h1
            variants={item}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-2xl"
          >
            Find work you can trust.
            <br />
            Hire talent you can verify.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 sm:mt-6 text-[#8CABA1] text-sm sm:text-base md:text-lg max-w-xl"
          >
            No fake listings. No pay-to-win visibility. Your money stays
            protected until the work is done.
          </motion.p>

          <motion.form
            variants={item}
            className="mt-8 sm:mt-10 w-full max-w-lg flex items-center rounded-full border-2 border-[#DE814A] bg-[#FFF] pl-4 sm:pl-6 pr-2 py-2"
          >
            <input
              type="text"
              placeholder="Search for any services"
              className="flex-1 min-w-0 bg-transparent text-sm text-[#3F4A44] placeholder:text-[#7A8580] outline-none"
            />
            <motion.button
              type="submit"
              aria-label="Search"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center rounded-full border-[#DE814A] bg-[#A8531E] w-9 h-9 shrink-0 hover:bg-[#B04A32] transition-colors"
            >
              <Search size={16} className="text-white" />
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </section>
  );
}