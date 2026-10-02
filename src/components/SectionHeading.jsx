import { motion } from "motion/react";

export default function SectionHeading({ eyebrow, title, index }) {
  return (
    <div className="mb-12 sm:mb-24 flex items-end justify-between gap-6 border-b border-line pb-6">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent"
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl"
        >
          {title}
        </motion.h2>
      </div>
      {index && (
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="hidden font-mono text-sm text-ink-faint md:block"
        >
          {index}
        </motion.span>
      )}
    </div>
  );
}
