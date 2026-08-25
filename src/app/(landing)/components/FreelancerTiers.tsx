"use client";

import { motion, type Variants } from "framer-motion";

const tiers = [
  {
    label: "Beginner",
    title: "Just starting out",
    description:
      "New freelancers get real visibility — not buried under years-old profiles.",
  },
  {
    label: "Intermediate",
    title: "Build a Track Record",
    description:
      "Your completed jobs and response rate start doing the talking for you.",
  },
  {
    label: "Expert",
    title: "Established Talent",
    description:
      "Filtered straight to clients who are specifically searching for senior talent.",
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

export default function FreelancerTiers() {
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
          For freelancers
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={heading}
          transition={{ delay: 0.05 }}
          className="text-2xl sm:text-3xl font-bold text-[#1F2A22] mb-10 max-w-sm"
        >
          There&apos;s a lane for wherever you are
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              variants={item}
              className="rounded-2xl border border-[#E5E0D6] bg-white px-5 sm:px-6 py-6 shadow-[0px_2px_8px_0px_#00000014] transition-all hover:bg-[#FFCA8F] hover:border-[#1F2A22] hover:shadow-[0px_4px_10px_3px_#DE814A]"
            >
              <p className="text-xs font-semibold tracking-wide text-[#C6543A] uppercase mb-2">
                {tier.label}
              </p>
              <h3 className="text-lg font-semibold text-[#1F2A22] mb-2">
                {tier.title}
              </h3>
              <p className="text-sm text-[#4A4A42]">{tier.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}