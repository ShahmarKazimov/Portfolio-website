import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { useLanguage } from "../context/LanguageContext";

export default function Education() {
  const { content } = useLanguage();
  const { sections, education } = content;
  const eduText = sections.education;

  return (
    <section id="education" className="border-b relative border-line px-6 py-12 sm:py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={eduText.eyebrow}
          title={eduText.title}
          index={eduText.index}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {education.map((ed, i) => (
            <motion.div
              key={ed.program + ed.period}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative flex flex-col justify-between rounded-xl border border-line bg-ground-raised/40 p-6 backdrop-blur-sm transition-colors hover:border-accent/40"
            >
              <div>
                <span className="font-mono text-xs text-accent font-semibold">{ed.period}</span>
                <h3 className="mt-2 font-display text-lg font-medium text-ink">{ed.program}</h3>
                <p className="mt-1 font-mono text-xs text-ink-faint">
                  {ed.org}
                  {ed.location && <span> · {ed.location}</span>}
                </p>
                {ed.detail && (
                  <p className="mt-3 text-xs leading-relaxed text-ink-dim">{ed.detail}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
