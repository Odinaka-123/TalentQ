"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const testimonials = [
  {
    quote:
      "Got my first contract 9 days after signing up. The escrow made my client comfortable paying upfront.",
    name: "Shola",
    role: "Graphic Designer, Lagos",
    avatar: "/Images/testimonials/shola.png",
  },
  {
    quote:
      "I could finally tell who was real. Verified badges saved me from two listings that looked fake.",
    name: "Felicia Chidi",
    role: "Small business owner, Abuja",
    avatar: "/Images/testimonials/felicia.png",
  },
  {
    quote:
      "Milestone payments meant I didn't have to chase anyone for money halfway through the project.",
    name: "Koffi Angela",
    role: "Full Stack Developer, Accra",
    avatar: "/Images/testimonials/koffi.png",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.15,
    },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const avatarPop: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 },
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

export default function Testimonials() {
  return (
    <section className="w-full flex justify-center px-4 pb-16 sm:pb-20">
      <div className="w-full max-w-5xl">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={heading}
          className="text-xs sm:text-sm font-semibold tracking-wide text-[#C6543A] uppercase mb-3"
        >
          From people using it
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={heading}
          transition={{ delay: 0.05 }}
          className="text-2xl sm:text-3xl font-bold text-[#1F2A22] mb-12 sm:mb-14"
        >
          Real outcomes, not slogans
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-14"
        >
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={card} className="relative pt-8">
              <motion.div
                variants={avatarPop}
                whileHover={{ scale: 1.08, rotate: -3 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-[#DE814A] overflow-hidden bg-[#E5E0D6]"
              >
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="rounded-2xl bg-[#DAD5C9] px-5 sm:px-6 pt-10 pb-6 text-center">
                <p className="text-sm text-[#8A4A2A] mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm font-semibold text-[#1F2A22]">{t.name}</p>
                <p className="text-xs text-[#C6543A]">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}