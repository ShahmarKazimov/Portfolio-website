import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { profile, skills, languages } from "../data/content";
import useReducedMotion from "../hooks/useReducedMotion";
import Bucket from "./ui/bucket";

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
        <SectionHeading eyebrow="Skills" title="Technical Skills • AI Expertise • Languages" index="00 / 01" />

        <motion.div style={{ y: fgY }} className="grid gap-12 md:grid-cols-12 items-start">
          {/* Sol hisse: Bio + Categorized Skills List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-6 flex flex-col gap-6"
          >
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-faint">
                Skills & Technologies
              </p>
              <div className="flex max-h-full flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
                {skills.map((group) => (
                  <div key={group.category}>
                    <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-line bg-ground-raised/40 px-2 py-0.5 font-mono text-[11px] text-ink-dim transition-colors hover:border-accent hover:text-accent"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sağ hisse: Animated Skill Glass Bucket + Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-6 flex flex-col gap-6"
          >
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-faint">
                Skills in Action
              </p>

              {/* Animated Skill Glass Bucket */}
              <div className="mb-6 rounded-3xl border border-line bg-ground-raised/30 pb-8 pt-28 backdrop-blur-sm overflow-hidden">
                <Bucket />
              </div>
            </div>

            <div className="border-t border-line pt-6">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-faint">
                Languages
              </p>
              <ul className="flex flex-col gap-2">
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
