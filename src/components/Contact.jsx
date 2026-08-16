import { motion } from "framer-motion";
import { profile } from "../data/content";
import MagneticElement from "./ui/MagneticElement";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 md:px-10">
      <div className="absolute inset-0 grid-lines opacity-[0.25]" />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[420px] w-[420px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-signal), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent"
        >
          Contact
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl"
        >
          Let's build or teach<br />something worthwhile.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-12 flex flex-col gap-8 border-t border-line pt-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <MagneticElement
            as={motion.a}
            href={`mailto:${profile.email}`}
            strength={0.3}
            className="group inline-flex items-center gap-3 font-display text-2xl font-medium text-ink transition-colors hover:text-accent sm:text-3xl"
          >
            {profile.email}
            <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </MagneticElement>

          <div className="flex flex-col gap-4 font-mono text-sm text-ink-dim sm:items-end">
            <span>{profile.phone}</span>
            <span>{profile.location}</span>
            <div className="flex gap-4">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                LinkedIn
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                GitHub
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
