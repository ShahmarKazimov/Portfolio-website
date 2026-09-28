import { motion } from "framer-motion";
import { EASE_OUT, VIEWPORT_ONCE } from "../hooks/motionConfig";

export default function SectionHeading({ eyebrow, title, index }) {
  return (
    <div className="mb-12 sm:mb-24 flex items-end justify-between gap-6 border-b border-line pb-6">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent"
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.38, delay: 0.04, ease: EASE_OUT }}
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
