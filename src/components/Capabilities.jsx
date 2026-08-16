import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { capabilities } from "../data/content";
import TiltCard from "./ui/TiltCard";
import MagneticElement from "./ui/MagneticElement";
import HeroField from "./HeroField";
import usePointerCapable from "../hooks/usePointerCapable";
import useReducedMotion from "../hooks/useReducedMotion";

export default function Capabilities() {
  const pointerCapable = usePointerCapable();
  const reduced = useReducedMotion();
  const active = pointerCapable && !reduced;

  return (
    <section id="capabilities" className="relative overflow-hidden border-b border-line px-6 py-24 md:px-10">
      {/* abstract node/connection field — stands in for the AI/agentic thread
          of the section without literal robot/brain iconography */}
      {!reduced && (
        <div className="pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden="true">
          <HeroField />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading eyebrow="Capabilities" title="Where AI and engineering meet." index="00 / 02" />

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {capabilities.map((cap, i) => (
            <MagneticElement
              key={cap.title}
              strength={active ? 0.08 : 0}
              className="relative"
            >
              <TiltCard
                range={4}
                glare
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
                className={`group relative bg-ground-raised p-8 transition-colors hover:bg-ground-elevated ${
                  active ? `card-float card-float-${i % 4}` : ""
                }`}
              >
                <div className="mb-8 flex items-start justify-between">
                  <span className="font-mono text-xs text-ink-faint">{cap.index}</span>
                  <span className="h-2 w-2 rounded-full bg-line transition-colors group-hover:bg-accent" />
                </div>
                <h3 className="mb-3 font-display text-xl font-medium text-ink">{cap.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-ink-dim">{cap.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cap.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-ground px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-faint"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </MagneticElement>
          ))}
        </div>
      </div>
    </section>
  );
}
