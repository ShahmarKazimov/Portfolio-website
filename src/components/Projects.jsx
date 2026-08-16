import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { projects } from "../data/content";
import TiltCard from "./ui/TiltCard";
import MagneticElement from "./ui/MagneticElement";

export default function Projects() {
  return (
    <section id="projects" className="border-b border-line px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Selected Work" title="Three products, shipped end to end." index="00 / 05" />

        <div className="flex flex-col">
          {projects.map((p, i) => (
            <TiltCard
              key={p.name}
              as={p.link ? motion.a : motion.div}
              {...(p.link ? { href: p.link, target: "_blank", rel: "noopener noreferrer" } : {})}
              range={3}
              glare
              initial={{ opacity: 0, y: 30, clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative grid grid-cols-1 gap-4 overflow-hidden rounded-2xl border-t border-line px-4 py-10 last:border-b sm:grid-cols-12 sm:items-center sm:gap-6"
            >
              <span className="font-mono text-sm text-ink-faint sm:col-span-1">{p.number}</span>

              <div className="sm:col-span-6" style={{ transform: "translateZ(24px)" }}>
                <h3 className="font-display text-3xl font-medium text-ink transition-colors group-hover:text-accent sm:text-4xl">
                  {p.name}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-ink-faint">
                  {p.category}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-ink-dim sm:col-span-3">
                {p.description}
              </p>

              <div className="flex items-center justify-between sm:col-span-2 sm:flex-col sm:items-end sm:gap-3">
                <div className="flex flex-wrap gap-1.5 sm:justify-end">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-ground-raised px-2 py-1 font-mono text-[10px] text-ink-faint"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {p.linkLabel ? (
                  <MagneticElement
                    as={motion.span}
                    strength={0.4}
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink transition-colors group-hover:text-accent"
                  >
                    {p.linkLabel}
                    <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </MagneticElement>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-faint">
                    Previous site
                  </span>
                )}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
