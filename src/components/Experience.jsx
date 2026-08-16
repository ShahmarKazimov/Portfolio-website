import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { experience, education } from "../data/content";

export default function Experience() {
  return (
    <section id="experience" className="border-b border-line px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Experience" title="A path from Finance to Development to AI." index="00 / 03" />

        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ol className="flex flex-col">
              {experience.map((role, i) => (
                <motion.li
                  key={role.role + role.period}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="group grid grid-cols-1 gap-2 border-t border-line py-7 sm:grid-cols-12 sm:gap-6"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-ink-faint sm:col-span-3">
                    {role.period}
                  </span>
                  <div className="sm:col-span-9">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-xl font-medium text-ink">{role.role}</h3>
                      {role.current && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mb-2 font-mono text-sm text-ink-faint">
                      {role.org}
                      {role.location && <span className="text-ink-faint/70"> · {role.location}</span>}
                    </p>
                    <p className="max-w-2xl text-sm leading-relaxed text-ink-dim">
                      {role.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-4">
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-faint">
              Education
            </p>
            <ol className="flex flex-col gap-6">
              {education.map((ed, i) => (
                <motion.li
                  key={ed.program}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="border-l-2 border-line pl-4"
                >
                  <p className="font-mono text-xs text-ink-faint">{ed.period}</p>
                  <p className="mt-1 font-display text-base font-medium text-ink">{ed.program}</p>
                  <p className="text-sm text-ink-dim">{ed.org}</p>
                  {ed.detail && (
                    <p className="mt-1 text-xs leading-relaxed text-ink-faint">{ed.detail}</p>
                  )}
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
