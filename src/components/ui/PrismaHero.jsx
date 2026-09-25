import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import video2 from "../../assets/4.mp4";
import { DominoButton } from "./DominoButton";
import { useLanguage } from "../../context/LanguageContext";

/* ---------------- WordsPullUp ---------------- */
export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.3em] right-0 text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
export const WordsPullUpMultiStyle = ({ segments, className = "", style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const words = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- Hero ---------------- */

export const PrismaHero = () => {
  const { content } = useLanguage();
  const { profile } = content;

  return (
    <section className="min-h-svh w-full lg:h-screen">
      <div className="relative min-h-svh w-full lg:h-full lg:min-h-0">
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          src={video2}
        />

        {/* Noise overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/70" />

        {/* Hero content */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 lg:top-auto lg:translate-y-0 lg:bottom-0 mx-auto max-w-7xl px-4 sm:px-6 pb-0 lg:pb-8">
          <div className="grid grid-cols-12 items-center lg:items-end gap-6 lg:gap-4 text-center lg:text-left">
            <div className="col-span-12 lg:col-span-8 flex flex-col items-center lg:items-start">
              <h1
                className="font-medium leading-[0.8] tracking-[-0.04em] text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] xl:text-[7vw] 2xl:text-[7vw]"
                style={{ color: "#E1E0CC" }}
              >
                <WordsPullUp text="Shahmar " showAsterisk />
                <WordsPullUp
                  className="text-accent ml-0 lg:ml-16 xl:ml-50 text-[13vw] sm:text-[13vw] md:text-[10vw] lg:text-[8vw] xl:text-[7vw] 2xl:text-[6vw]"
                  text="Kazimov"
                />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col items-center lg:items-start gap-4 pb-1 sm:gap-5 lg:col-span-4">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs text-ink-dim sm:text-sm md:text-base max-w-md lg:max-w-none text-center lg:text-left drop-shadow-sm"
                style={{ lineHeight: 1.4 }}
              >
                {profile.heroBio}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="self-center lg:self-start"
              >
                <DominoButton
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.downloadCv}
                  <ArrowRight className="h-4 w-4" />
                </DominoButton>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrismaHero;
