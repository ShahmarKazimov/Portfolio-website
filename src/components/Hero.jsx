import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import HeroPortrait from "./HeroPortrait";
import MagneticElement from "./ui/MagneticElement";
import usePointerCapable from "../hooks/usePointerCapable";
import useReducedMotion from "../hooks/useReducedMotion";
import { SPRING_TRAIL } from "../hooks/motionConfig";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// Per-character stagger for the kinetic headline. Each glyph fades/lifts in
// with a tiny weight shift, staggered by character index.
const nameContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.028, delayChildren: 0.05 },
  },
};

const glyph = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

function KineticWord({ word, className, reduced }) {
  if (reduced) return <span className={className}>{word}</span>;
  return (
    <motion.span variants={nameContainer} className={className} aria-label={word}>
      {word.split("").map((ch, i) => (
        <motion.span
          key={i}
          variants={glyph}
          className="inline-block"
          aria-hidden="true"
          style={{ willChange: "transform, filter", whiteSpace: "pre" }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function Hero() {
  const pointerCapable = usePointerCapable();
  const reduced = useReducedMotion();
  const active = pointerCapable && !reduced;
  const sectionRef = useRef(null);

  // Scroll-scrub: as the hero exits, the headline lifts and fades slightly,
  // driven directly by scroll progress rather than a viewport trigger —
  // makes the hero-to-about handoff feel directed instead of a hard cut.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0.35]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 0.85]);

  // Background glow layer — moves least, reinforcing depth ordering
  // (foreground portrait > text content > ambient glow).
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const glowX = useSpring(useTransform(gx, [-0.5, 0.5], [-24, 24]), SPRING_TRAIL);
  const glowY = useSpring(useTransform(gy, [-0.5, 0.5], [-24, 24]), SPRING_TRAIL);
  // Core text content — moves minimally, stays legible and steady.
  const textX = useSpring(useTransform(gx, [-0.5, 0.5], [-6, 6]), SPRING_TRAIL);
  const textY = useSpring(useTransform(gy, [-0.5, 0.5], [-4, 4]), SPRING_TRAIL);

  useEffect(() => {
    if (!active) return;
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        gx.set(e.clientX / window.innerWidth - 0.5);
        gy.set(e.clientY / window.innerHeight - 0.5);
        raf = null;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, gx, gy]);

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-line"
    >
      <div className="absolute inset-0 grid-lines opacity-[0.25]" />

      {/* desktop: fixed-size visual panel pinned to the right, out of text flow */}
      <motion.div
        style={{ scale: active ? sceneScale : 1 }}
        className="pointer-events-none absolute top-1/2 right-[2%] z-20 hidden h-[440px] w-[440px] -translate-y-1/2 lg:block xl:right-[6%]"
      >
        <HeroPortrait gx={gx} gy={gy} active={active} />
      </motion.div>

      {/* desktop: CTA buttons sit in the empty space below the portrait, centered under it */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 right-[2%] z-20 hidden w-[440px] translate-y-[252px] items-center justify-center gap-3 lg:flex xl:right-[6%]"
      >
        <MagneticElement as={motion.a} href="#projects" strength={0.35}
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-ground transition-transform hover:-translate-y-0.5"
        >
          View Work
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </MagneticElement>
        <MagneticElement as={motion.a} href="#contact" strength={0.35}
          className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Get in Touch
        </MagneticElement>
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-ground)_0%,var(--color-ground)_18%,transparent_58%)] hidden lg:block" />
      <motion.div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-[0.12] blur-[120px]"
        style={{
          background: "radial-gradient(circle, var(--color-signal), transparent 70%)",
          x: active ? glowX : 0,
          y: active ? glowY : 0,
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ x: active ? textX : 0, y: active ? textY : 0 }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pt-28 pb-20 md:px-10 lg:block lg:pr-[46%]"
      >
        {/* mobile/tablet: visual sits in normal flow above the heading, never overlapping content */}
        <div className="pointer-events-none relative mx-auto h-[300px] w-[300px] sm:h-[360px] sm:w-[360px] lg:hidden">
          <HeroPortrait gx={gx} gy={gy} active={active} />
        </div>

        <motion.p
          variants={item}
          className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-accent"
        >
          Baku, Azerbaijan — Available for select work
        </motion.p>

        <motion.h1
          variants={item}
          style={{ y: headlineY, opacity: active ? headlineOpacity : 1 }}
          className="font-display text-[13vw] leading-[0.92] font-medium tracking-tight text-ink sm:text-[10vw] md:text-[7.5vw] lg:text-[6vw]"
        >
          <KineticWord word="Shahmar" reduced={reduced} />
          <br />
          <KineticWord word="Kazimov" className="text-outline" reduced={reduced} />
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-8 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-xl font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
            <KineticWord word="AI Instructor" reduced={reduced} />{" "}
            <span className="text-ink-faint">/</span>{" "}
            <KineticWord word="Software Developer" reduced={reduced} />
          </p>

          <div className="flex flex-wrap gap-3 lg:hidden">
            <MagneticElement as={motion.a} href="#projects" strength={0.35}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-ground transition-transform hover:-translate-y-0.5"
            >
              View Work
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </MagneticElement>
            <MagneticElement as={motion.a} href="#contact" strength={0.35}
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Get in Touch
            </MagneticElement>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
