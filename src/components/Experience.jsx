import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { experience } from "../data/content";
import GenerativeTree from "./ui/GenerativeTree";
import useReducedMotion from "../hooks/useReducedMotion";

export default function Experience() {
  const containerRef = useRef(null);
  const reduced = useReducedMotion();

  // Scroll progress for the timeline line height animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 80%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 25,
    restDelta: 0.001,
  });

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
          index="00 / 02"
        />

        <div ref={containerRef} className="relative mt-12 md:mt-16">
          {/* Background Timeline Rail */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-white/10 z-0" />

          {/* Animated Dynamic Scroll Timeline Line */}
          {!reduced && (
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-linear-to-b from-amber-400 via-amber-500 to-amber-600/20 z-10 shadow-[0_0_12px_#f59e0b]"
            />
          )}

          <div className="flex flex-col gap-12 md:gap-16">
            {experience.map((role, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={role.role + role.period}
                  className="relative flex flex-col md:flex-row items-center w-full"
                >
                  {/* Timeline Dot Node with Spring Pop Animation */}
                  <motion.div
                    initial={reduced ? { opacity: 1 } : { scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 22,
                    }}
                    className="absolute left-5 md:left-1/2 top-7 md:top-8 -translate-x-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-ground/90 border border-amber-500/40 backdrop-blur-sm shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  >
                    <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                      {role.current && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${
                          role.current
                            ? "bg-accent shadow-[0_0_12px_#f59e0b]"
                            : "bg-amber-500/80"
                        }`}
                      />
                    </span>
                  </motion.div>

                  {/* Card Container with Smooth Slide & Scale Animation */}
                  <div
                    className={`w-full pl-12 md:pl-0 ${
                      isEven
                        ? "md:w-[calc(50%-2.5rem)] md:mr-auto md:ml-0 md:text-right"
                        : "md:w-[calc(50%-2.5rem)] md:ml-auto md:mr-0 md:text-left"
                    }`}
                  >
                    <motion.div
                      initial={
                        reduced
                          ? { opacity: 1 }
                          : {
                              opacity: 0,
                              y: 15,
                            }
                      }
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                      whileHover={reduced ? {} : { y: -4, transition: { duration: 0.2 } }}
                      className="group relative rounded-2xl border border-white/15 bg-ground/85 p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:border-amber-500/60 hover:bg-ground/95 hover:shadow-[0_0_35px_rgba(245,158,11,0.22)]"
                    >
                      {/* Ambient card accent glow on hover */}
                      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-linear-to-r from-amber-500/10 via-transparent to-amber-500/5" />

                      <div
                        className={`relative z-10 flex flex-wrap items-center gap-3 mb-2 ${
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

                      <h3 className="relative z-10 font-display text-xl font-medium text-ink group-hover:text-amber-100 transition-colors">
                        {role.role}
                      </h3>

                      <p className="relative z-10 mt-1 font-mono text-sm text-ink-faint">
                        {role.org}
                        {role.location && (
                          <span className="text-ink-faint/70"> · {role.location}</span>
                        )}
                      </p>

                      <p className="relative z-10 mt-4 text-sm leading-relaxed text-ink-dim">
                        {role.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
