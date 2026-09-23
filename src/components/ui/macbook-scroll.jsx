"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSearch,
  IconWorld,
  IconCommand,
  IconCaretLeftFilled,
  IconCaretDownFilled,
  IconExternalLink,
  IconAward,
} from "@tabler/icons-react";

export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge,
  certifications = [],
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth lid open transformation during scroll
  const scaleX = useTransform(
    scrollYProgress,
    [0, 0.25],
    [1.2, 1.2],
  );
  const scaleY = useTransform(
    scrollYProgress,
    [0, 0.25],
    [0.6, 1.2],
  );
  const translate = useTransform(scrollYProgress, [0, 0.35], [0, 150]);
  const rotate = useTransform(scrollYProgress, [0.05, 0.25], [-28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.2], [0, 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Flatten all certificate items for slides inside the screen
  const flatCerts = useMemo(() => {
    const list = [];
    certifications.forEach((g) => {
      g.items.forEach((item) => {
        list.push({ ...item, issuer: g.issuer });
      });
    });
    return list;
  }, [certifications]);

  // Active certificate index driven by scroll progression
  const activeIndex = useTransform(
    scrollYProgress,
    [0.25, 0.9],
    [0, Math.max(0, flatCerts.length - 1)]
  );

  const [currentCertIndex, setCurrentCertIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = activeIndex.on("change", (latest) => {
      setCurrentCertIndex(Math.round(latest));
    });
    return () => unsubscribe();
  }, [activeIndex]);

  const currentCert = flatCerts[currentCertIndex] || flatCerts[0];

  // Mobile Carousel View
  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-4">
        {title && (
          <h2 className="text-center font-display text-2xl font-bold text-ink mb-2">
            {title}
          </h2>
        )}

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 py-4 scrollbar-none -mx-6">
          {flatCerts.map((item, idx) => (
            <div
              key={idx}
              className="snap-center shrink-0 w-[82vw] sm:w-80 rounded-2xl bg-ground-raised border border-line p-5 shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b border-line pb-3 mb-3">
                <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-accent">
                  <IconAward className="h-4 w-4 shrink-0" />
                  <span className="truncate max-w-45">{item.issuer}</span>
                </div>
                <div className="rounded-full bg-accent/20 px-2.5 py-0.5 font-mono text-[10px] text-accent shrink-0">
                  {idx + 1} / {flatCerts.length}
                </div>
              </div>

              <div className="flex flex-col gap-2 my-2">
                <h3 className="font-display text-base font-bold leading-snug text-ink">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-xs text-ink-dim leading-relaxed line-clamp-4 font-body">
                    {item.description}
                  </p>
                )}
              </div>

              {item.link ? (
                <div className="flex items-center justify-between border-t border-line pt-3 mt-3">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-accent hover:underline"
                  >
                    Verify Certificate <IconExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <div className="border-t border-line pt-3 mt-3 text-[11px] font-mono text-ink-faint">
                  Verified Credential
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-1.5 text-xs text-ink-faint font-mono pt-1">
          <span>← Swipe horizontally to explore certificates ({flatCerts.length}) →</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative flex min-h-[300vh]  flex-col items-center justify-start py-0 pt-4 perspective-midrange"
    >
      <div className="sticky top-30 flex flex-col items-center justify-center">
        {title && (
          <motion.h2
            style={{
              translateY: textTransform,
              opacity: textOpacity,
            }}
            className="mb-8 text-center text-3xl font-bold text-neutral-800 dark:text-white"
          >
            {title}
          </motion.h2>
        )}

        {/* Lid with Screen Display */}
        <Lid
          src={src}
          scaleX={scaleX}
          scaleY={scaleY}
          rotate={rotate}
          translate={translate}
          cert={currentCert}
          currentIndex={currentCertIndex}
          totalCount={flatCerts.length}
        />

        {/* Base area */}
        <div className="relative -z-10 h-88 w-lg overflow-hidden rounded-2xl bg-gray-200 dark:bg-[#272729]">
          {/* above keyboard bar */}
          <div className="relative h-10 w-full">
            <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
          </div>
          <div className="relative flex">
            <div className="mx-auto h-full w-[10%] overflow-hidden">
              <SpeakerGrid />
            </div>
            <div className="mx-auto h-full w-[80%]">
              <Keypad />
            </div>
            <div className="mx-auto h-full w-[10%] overflow-hidden">
              <SpeakerGrid />
            </div>
          </div>
          <Trackpad />
          <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-linear-to-t from-[#272729] to-[#050505]" />
          {showGradient && (
            <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-linear-to-t from-white via-white to-transparent dark:from-black dark:via-black"></div>
          )}
          {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
        </div>
      </div>
    </div>
  );
};

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src,
  cert,
  currentIndex,
  totalCount,
}) => {
  return (
    <div className="relative perspective-midrange">
      <div
        style={{
          transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="relative h-48 w-lg rounded-2xl bg-[#010101] p-2"
      >
        <div
          style={{
            boxShadow: "0px 2px 0px 2px #171717 inset",
          }}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]"
        >
          <span className="text-white">
            <AceternityLogo />
          </span>
        </div>
      </div>
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
        }}
        className="absolute inset-0 h-96 w-lg rounded-2xl bg-[#010101] p-2"
      >
        <div className="absolute inset-0 rounded-lg bg-[#272729]" />

        {/* Screen Display Content */}
        <div className="relative h-full w-full overflow-hidden rounded-lg bg-[#0B0B0F] p-5 text-white shadow-2xl flex flex-col justify-between border border-white/10">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="flex h-2.5 w-2.5 rounded-full bg-green-500/80" />
            </div>
            <div className="rounded-full bg-accent/20 px-2.5 py-0.5 font-mono text-[10px] text-accent">
              {currentIndex + 1} / {totalCount}
            </div>
          </div>

          {/* Certificate Main Content */}
          {cert ? (
            <div className="my-auto flex flex-col gap-2.5 px-2">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-accent">
                <IconAward className="h-4 w-4" />
                <span>{cert.issuer}</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold leading-tight text-white">
                {cert.name}
              </h3>
              {cert.description && (
                <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                  {cert.description}
                </p>
              )}
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 self-start text-xs font-medium text-accent hover:underline"
                >
                  Verify Certificate <IconExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ) : (
            <div className="my-auto text-center font-mono text-sm text-neutral-400">
              Loading certificates...
            </div>
          )}

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px] text-neutral-500 font-mono">
            <span>Scroll down to switch certificates</span>
            <span className="text-accent/80">Shahmar Kazimov</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Trackpad = () => {
  return (
    <div
      className="mx-auto my-1 h-32 w-[40%] rounded-xl"
      style={{
        boxShadow: "0px 0px 1px 1px #00000020 inset",
      }}
    ></div>
  );
};

export const Keypad = () => {
  return (
    <div className="mx-1 h-full transform-[translateZ(0)] rounded-md bg-[#050505] p-1 will-change-transform">
      {/* First Row */}
      <div className="mb-0.5 flex w-full shrink-0 gap-0.5">
        <KBtn
          className="w-10 items-end justify-start pb-0.5 pl-1"
          childrenClassName="items-start"
        >
          esc
        </KBtn>
        <KBtn>
          <IconBrightnessDown className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F1</span>
        </KBtn>
        <KBtn>
          <IconBrightnessUp className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F2</span>
        </KBtn>
        <KBtn>
          <IconTable className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F3</span>
        </KBtn>
        <KBtn>
          <IconSearch className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F4</span>
        </KBtn>
        <KBtn>
          <IconMicrophone className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F5</span>
        </KBtn>
        <KBtn>
          <IconMoon className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F6</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackPrev className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F7</span>
        </KBtn>
        <KBtn>
          <IconPlayerSkipForward className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F8</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackNext className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F8</span>
        </KBtn>
        <KBtn>
          <IconVolume3 className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F10</span>
        </KBtn>
        <KBtn>
          <IconVolume2 className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F11</span>
        </KBtn>
        <KBtn>
          <IconVolume className="h-1.5 w-1.5" />
          <span className="mt-1 inline-block">F12</span>
        </KBtn>
        <KBtn>
          <div className="h-4 w-4 rounded-full bg-linear-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
            <div className="h-full w-full rounded-full bg-black" />
          </div>
        </KBtn>
      </div>

      {/* Second row */}
      <div className="mb-0.5 flex w-full shrink-0 gap-0.5">
        <KBtn>
          <span className="block">~</span>
          <span className="mt-1 block">`</span>
        </KBtn>
        <KBtn>
          <span className="block">!</span>
          <span className="block">1</span>
        </KBtn>
        <KBtn>
          <span className="block">@</span>
          <span className="block">2</span>
        </KBtn>
        <KBtn>
          <span className="block">#</span>
          <span className="block">3</span>
        </KBtn>
        <KBtn>
          <span className="block">$</span>
          <span className="block">4</span>
        </KBtn>
        <KBtn>
          <span className="block">%</span>
          <span className="block">5</span>
        </KBtn>
        <KBtn>
          <span className="block">^</span>
          <span className="block">6</span>
        </KBtn>
        <KBtn>
          <span className="block">&</span>
          <span className="block">7</span>
        </KBtn>
        <KBtn>
          <span className="block">*</span>
          <span className="block">8</span>
        </KBtn>
        <KBtn>
          <span className="block">(</span>
          <span className="block">9</span>
        </KBtn>
        <KBtn>
          <span className="block">)</span>
          <span className="block">0</span>
        </KBtn>
        <KBtn>
          <span className="block">&mdash;</span>
          <span className="block">_</span>
        </KBtn>
        <KBtn>
          <span className="block">+</span>
          <span className="block"> = </span>
        </KBtn>
        <KBtn
          className="w-10 items-end justify-end pr-1 pb-0.5"
          childrenClassName="items-end"
        >
          delete
        </KBtn>
      </div>

      {/* Third row */}
      <div className="mb-0.5 flex w-full shrink-0 gap-0.5">
        <KBtn
          className="w-10 items-end justify-start pb-0.5 pl-1"
          childrenClassName="items-start"
        >
          tab
        </KBtn>
        <KBtn>
          <span className="block">Q</span>
        </KBtn>
        <KBtn>
          <span className="block">W</span>
        </KBtn>
        <KBtn>
          <span className="block">E</span>
        </KBtn>
        <KBtn>
          <span className="block">R</span>
        </KBtn>
        <KBtn>
          <span className="block">T</span>
        </KBtn>
        <KBtn>
          <span className="block">Y</span>
        </KBtn>
        <KBtn>
          <span className="block">U</span>
        </KBtn>
        <KBtn>
          <span className="block">I</span>
        </KBtn>
        <KBtn>
          <span className="block">O</span>
        </KBtn>
        <KBtn>
          <span className="block">P</span>
        </KBtn>
        <KBtn>
          <span className="block">{`{`}</span>
          <span className="block">{`[`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`}`}</span>
          <span className="block">{`]`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`|`}</span>
          <span className="block">{`\\`}</span>
        </KBtn>
      </div>

      {/* Fourth Row */}
      <div className="mb-0.5 flex w-full shrink-0 gap-0.5">
        <KBtn
          className="w-[2.8rem] items-end justify-start pb-0.5 pl-1"
          childrenClassName="items-start"
        >
          caps lock
        </KBtn>
        <KBtn>
          <span className="block">A</span>
        </KBtn>
        <KBtn>
          <span className="block">S</span>
        </KBtn>
        <KBtn>
          <span className="block">D</span>
        </KBtn>
        <KBtn>
          <span className="block">F</span>
        </KBtn>
        <KBtn>
          <span className="block">G</span>
        </KBtn>
        <KBtn>
          <span className="block">H</span>
        </KBtn>
        <KBtn>
          <span className="block">J</span>
        </KBtn>
        <KBtn>
          <span className="block">K</span>
        </KBtn>
        <KBtn>
          <span className="block">L</span>
        </KBtn>
        <KBtn>
          <span className="block">{`:`}</span>
          <span className="block">{`;`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`"`}</span>
          <span className="block">{`'`}</span>
        </KBtn>
        <KBtn
          className="w-[2.85rem] items-end justify-end pr-1 pb-0.5"
          childrenClassName="items-end"
        >
          return
        </KBtn>
      </div>

      {/* Fifth Row */}
      <div className="mb-0.5 flex w-full shrink-0 gap-0.5">
        <KBtn
          className="w-[3.65rem] items-end justify-start pb-0.5 pl-1"
          childrenClassName="items-start"
        >
          shift
        </KBtn>
        <KBtn>
          <span className="block">Z</span>
        </KBtn>
        <KBtn>
          <span className="block">X</span>
        </KBtn>
        <KBtn>
          <span className="block">C</span>
        </KBtn>
        <KBtn>
          <span className="block">V</span>
        </KBtn>
        <KBtn>
          <span className="block">B</span>
        </KBtn>
        <KBtn>
          <span className="block">N</span>
        </KBtn>
        <KBtn>
          <span className="block">M</span>
        </KBtn>
        <KBtn>
          <span className="block">{`<`}</span>
          <span className="block">{`,`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`>`}</span>
          <span className="block">{`.`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`?`}</span>
          <span className="block">{`/`}</span>
        </KBtn>
        <KBtn
          className="w-[3.65rem] items-end justify-end pr-1 pb-0.5"
          childrenClassName="items-end"
        >
          shift
        </KBtn>
      </div>

      {/* sixth Row */}
      <div className="mb-0.5 flex w-full shrink-0 gap-0.5">
        <KBtn className="" childrenClassName="h-full justify-between py-1">
          <div className="flex w-full justify-end pr-1">
            <span className="block">fn</span>
          </div>
          <div className="flex w-full justify-start pl-1">
            <IconWorld className="h-1.5 w-1.5" />
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-1">
          <div className="flex w-full justify-end pr-1">
            <IconChevronUp className="h-1.5 w-1.5" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">control</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-1">
          <div className="flex w-full justify-end pr-1">
            <OptionKey className="h-1.5 w-1.5" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-1"
        >
          <div className="flex w-full justify-end pr-1">
            <IconCommand className="h-1.5 w-1.5" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="w-[8.2rem]"></KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-1"
        >
          <div className="flex w-full justify-start pl-1">
            <IconCommand className="h-1.5 w-1.5" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-1">
          <div className="flex w-full justify-start pl-1">
            <OptionKey className="h-1.5 w-1.5" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <div className="mt-0.5 flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-sm p-[0.5px]">
          <KBtn className="h-3 w-6">
            <IconCaretUpFilled className="h-1.5 w-1.5" />
          </KBtn>
          <div className="flex">
            <KBtn className="h-3 w-6">
              <IconCaretLeftFilled className="h-1.5 w-1.5" />
            </KBtn>
            <KBtn className="h-3 w-6">
              <IconCaretDownFilled className="h-1.5 w-1.5" />
            </KBtn>
            <KBtn className="h-3 w-6">
              <IconCaretRightFilled className="h-1.5 w-1.5" />
            </KBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KBtn = ({
  className,
  children,
  childrenClassName,
  backlit = true,
}) => {
  return (
    <div
      className={cn(
        "transform-[translateZ(0)] rounded-sm p-[0.5px] will-change-transform",
        backlit && "bg-white/20 shadow-xl shadow-white",
      )}
    >
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-[3.5px] bg-[#0A090D]",
          className,
        )}
        style={{
          boxShadow:
            "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
        }}
      >
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center text-[5px] text-neutral-200",
            childrenClassName,
            backlit && "text-white",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const SpeakerGrid = () => {
  return (
    <div
      className="mt-2 flex h-40 gap-0.5 px-[0.5px]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
        backgroundSize: "3px 3px",
      }}
    ></div>
  );
};

export const OptionKey = ({ className }) => {
  return (
    <svg
      fill="none"
      version="1.1"
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <rect
        stroke="currentColor"
        strokeWidth={2}
        x="18"
        y="5"
        width="10"
        height="2"
      />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
      />
      <rect
        id="_Transparent_Rectangle_"
        className="st0"
        width="32"
        height="32"
        stroke="none"
      />
    </svg>
  );
};

const AceternityLogo = () => {
  return (
    <div>
      {"</>"}
    </div>
  );
};
