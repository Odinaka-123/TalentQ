"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TalentBanner() {
  return (
    <section className="w-full flex justify-center px-4 pb-16 sm:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl rounded-4xl border border-[#E8A47E] overflow-hidden"
      >
        <motion.div
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/Images/talent-banner.jpeg"
            alt="Freelancers collaborating"
            width={1200}
            height={400}
            className="w-full h-65 sm:h-75 object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white max-w-xl"
          >
            Talent is ranked by track record, not by who pays the most.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="mt-4 text-sm sm:text-base text-white/80 max-w-md"
          >
            No paid placements. No boosted listings. What you see is who&apos;s
            actually delivering.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}