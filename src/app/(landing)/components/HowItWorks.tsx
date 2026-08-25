"use client";

import { motion, type Variants } from "framer-motion";

const steps = [
  {
    title: "Client funds the milestone",
    description:
      "Money is held safely in escrow the moment a job is agreed — not paid out yet.",
  },
  {
    title: "Freelancer delivers the work",
    description:
      "Work is submitted through the platform, tied to that specific milestone.",
  },
  {
    title: "Funds release on approval",
    description:
      "Once the client approves, payment reaches the freelancer — automatically.",
  },
];

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

export default function HowItWorks() {
  return (
    <section className="w-full flex justify-center px-4 py-16 sm:py-20">
      <div className="w-full max-w-5xl">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={heading}
          className="text-xs sm:text-sm font-semibold tracking-wide text-[#C6543A] uppercase mb-3"
        >
          How it works
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={heading}
          transition={{ delay: 0.05 }}
          className="text-2xl sm:text-3xl font-bold text-[#1F2A22] mb-10 sm:mb-12"
        >
          Your payment is protected at every step
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -4, borderColor: "#DE814A" }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-[#C36A34] px-5 sm:px-6 py-6"
            >
              <h3 className="text-sm sm:text-base font-semibold text-[#1F2A22] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#C6543A]">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}