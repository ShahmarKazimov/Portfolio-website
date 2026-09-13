import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { experience } from "../data/content";
import GenerativeTree from "./ui/GenerativeTree";

export default function Experience() {
  return (
    <section id="experience" className="relative min-h-screen overflow-hidden border-b border-line px-4 py-20 sm:px-6 md:px-10 md:py-24">
      {/* Background Generative Tree Animation */}
      <div className="absolute inset-0 z-0">
        <GenerativeTree speed={1} particleAmount={1.2} opacity={0.9} brightness={1.2} />
        {/* Transparent background overlay for text contrast */}
        <div className="absolute inset-0 bg-ground/40 pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Experience"
          title="A path from Finance to Development to AI."
          index="00 / 03"
        />

        <div className="relative mt-12 md:mt-16">
          {/* Vertical Timeline Line */}
          {/* Mobile: left-5 (20px) | Desktop: md:left-1/2 (exact center) */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-linear-to-b from-accent/70 via-accent/30 to-transparent z-10" />

          <div className="flex flex-col gap-10 md:gap-14">
            {experience.map((role, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={role.role + role.period}
                  initial={{ opacity: 0, y: 30, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative flex flex-col md:flex-row items-center w-full"
                >
                  {/* Timeline Dot Node */}
                  {/* Mobile: left-5 | Desktop: md:left-1/2 */}
                  <div className="absolute left-5 md:left-1/2 top-7 md:top-8 -translate-x-1/2 -translate-y-1/2 z-20 flex h-6 w-6 items-center justify-center">
                    <span className="relative flex h-3.5 w-3.5">
                      {role.current && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                      )}
                      <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${role.current ? 'bg-accent shadow-[0_0_12px_#f59e0b]' : 'bg-amber-600/90 border border-accent/40'}`} />
                    </span>
                  </div>

                  {/* Card Container */}
                  {/* Mobile: pl-10 (full width right of line) */}
                  {/* Desktop: left card (isEven) vs right card (!isEven) with 4rem central gap */}
                  <div
                    className={`w-full pl-10 md:pl-0 ${
                      isEven
                        ? "md:w-[calc(50%-2rem)] md:mr-auto md:ml-0 md:text-right"
                        : "md:w-[calc(50%-2rem)] md:ml-auto md:mr-0 md:text-left"
                    }`}
                  >
                    <div className="group relative rounded-2xl border border-white/15 bg-ground/85 p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:border-amber-500/60 hover:bg-ground/95 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                      <div
                        className={`flex flex-wrap items-center gap-3 mb-2 ${
                          isEven ? "md:justify-end" : "md:justify-start"
                        }`}
                      >
                        <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
                          {role.period}
                        </span>
                        {role.current && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                            Current
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-xl font-medium text-ink group-hover:text-amber-100 transition-colors">
                        {role.role}
                      </h3>

                      <p className="mt-1 font-mono text-sm text-ink-faint">
                        {role.org}
                        {role.location && (
                          <span className="text-ink-faint/70"> · {role.location}</span>
                        )}
                      </p>

                      <p className="mt-4 text-sm leading-relaxed text-ink-dim">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
