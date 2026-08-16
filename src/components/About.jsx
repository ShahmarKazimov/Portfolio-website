import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { profile, skills, languages } from "../data/content";
import useReducedMotion from "../hooks/useReducedMotion";

export default function About() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const fgY = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -90, reduced ? 0 : 90]);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden border-b border-line px-6 py-24 md:px-10">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading eyebrow="About" title="A teacher's clarity, a builder's discipline." index="00 / 01" />

        <motion.div style={{ y: fgY }} className="grid gap-14 md:grid-cols-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-7 font-display text-2xl leading-relaxed text-ink-dim sm:text-3xl"
          >
            {profile.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-5"
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-faint">
              Core Toolkit
            </p>
            <div className="flex max-h-80 flex-col gap-4 overflow-y-auto pr-1">
              {skills.map((group) => (
                <div key={group.category}>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint/70">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-dim transition-colors hover:border-accent hover:text-accent"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-line pt-6">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-faint">
                Languages
              </p>
              <ul className="flex flex-col gap-1.5">
                {languages.map((l) => (
                  <li key={l.name} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-ink-dim">{l.name}</span>
                    <span className="font-mono text-xs text-ink-faint">{l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
