import { ArrowRight } from "lucide-react";
import { useRef, useState, useLayoutEffect } from "react";
import video2 from "../../assets/4.mp4";
import { DominoButton } from "./DominoButton";
import { useLanguage } from "../../context/LanguageContext";

/* ---------------- WordsPullUp ---------------- */
export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }) => {
  const words = text.split(" ");

  return (
    <div className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <span
            key={i}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.3em] right-0 text-[0.31em]">*</span>
            )}
          </span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
export const WordsPullUpMultiStyle = ({ segments, className = "", style }) => {
  const words = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <span
          key={i}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </span>
      ))}
    </div>
  );
};

/* ---------------- Hero ---------------- */

export const PrismaHero = () => {
  const { content } = useLanguage();
  const { profile } = content;
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

  const [introWidth, setIntroWidth] = useState(0);
  const [line1Width, setLine1Width] = useState(0);
  const [line2Width, setLine2Width] = useState(0);

  useLayoutEffect(() => {
    const updateWidths = () => {
      if (introRef.current) {
        introRef.current.style.width = "auto";
        setIntroWidth(Math.ceil(introRef.current.getBoundingClientRect().width) + 48);
        introRef.current.style.width = "";
      }
      if (line1Ref.current) {
        line1Ref.current.style.width = "auto";
        setLine1Width(Math.ceil(line1Ref.current.getBoundingClientRect().width) + 48);
        line1Ref.current.style.width = "";
      }
      if (line2Ref.current) {
        line2Ref.current.style.width = "auto";
        setLine2Width(Math.ceil(line2Ref.current.getBoundingClientRect().width) + 48);
        line2Ref.current.style.width = "";
      }
    };
    

    updateWidths();
    window.addEventListener("resize", updateWidths);
    return () => window.removeEventListener("resize", updateWidths);
  }, [profile.heroIntro, profile.firstName, profile.lastName]);

  return (
    <section ref={heroRef} className="min-h-svh w-full lg:h-screen">
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
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 lg:top-auto lg:translate-y-0 lg:bottom-0 mx-auto max-w-7xl px-6 sm:px-0 pb-0 lg:pb-8">
          <div className="grid grid-cols-12 items-center lg:items-end gap-6 lg:gap-4 text-center lg:text-left">
            <div className="col-span-12 lg:col-span-8 flex flex-col items-center lg:items-start">
              <div className="mb-2">
                <span
                  ref={introRef}
                  className="hero-intro animate-in"
                  style={introWidth ? { "--w": `${introWidth}px` } : undefined}
                >
                  {profile.heroIntro || "Hi, my name is"}
                </span>
              </div>
              <h1 className="leading-[1.1] sm:leading-[0.9] tracking-[-0.04em] text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] xl:text-[7vw] 2xl:text-[7vw] flex flex-col items-center lg:items-start max-w-full overflow-hidden">
                <span
                  ref={line1Ref}
                  className="hero-name-line line-1 animate-in"
                  style={line1Width ? { "--w": `${line1Width}px` } : undefined}
                >
                  {profile.firstName || "Shahmar"}
                </span>
                <span
                  ref={line2Ref}
                  className="hero-name-line line-2 text-[11vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] xl:text-[7vw] 2xl:text-[6vw] ml-0 lg:ml-16 xl:ml-36 text-accent animate-in"
                  style={line2Width ? { "--w": `${line2Width}px` } : undefined}
                >
                  {profile.lastName || "Kazimov"}
                </span>
              </h1>
            </div>

            <div className="col-span-12 flex flex-col items-center lg:items-start gap-4 pb-1 sm:gap-5 lg:col-span-4">
              <p
                className="text-xs text-ink-dim sm:text-sm md:text-base max-w-md lg:max-w-none text-center lg:text-left drop-shadow-sm"
                style={{ lineHeight: 1.4 }}
              >
                {profile.heroBio}
              </p>

              <div
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrismaHero;
