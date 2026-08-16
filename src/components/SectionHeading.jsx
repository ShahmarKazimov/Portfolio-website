import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, index }) {
  return (
    <div className="mb-14 flex items-end justify-between gap-6 border-b border-line pb-6">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent"
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl"
        >
          {title}
        </motion.h2>
      </div>
      {index && (
        <span className="hidden font-mono text-sm text-ink-faint md:block">{index}</span>
      )}
    </div>
  );
}
