import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SquareArrowOutUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { projects as rawProjects } from "../data/content";

import woodImg from "../assets/wood_in_vision.jpg";
import eclipseImg from "../assets/eclipse.jpg";
import area36Img from "../assets/area36.jpg";
import portfolioImg from "../assets/portfolio.jpg";
import lineaImg from "../assets/linea.jpg";

const projectImages = [woodImg, eclipseImg, area36Img, portfolioImg, lineaImg];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function wrapIndex(n, len) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i, active, len, loop) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack({
  items,
  initialIndex = 0,
  maxVisible = 5,
  cardWidth = 480,
  cardHeight = 270,
  overlap = 0.55,
  spreadDeg = 36,
  perspectivePx = 1100,
  depthPx = 130,
  tiltXDeg = 10,
  activeLiftPx = 20,
  activeScale = 1.0,
  inactiveScale = 0.85,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 3000,
  pauseOnHover = true,
  showDots = true,
  className,
  onChangeIndex,
  renderCard,
}) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]);
  }, [active, len, items, onChangeIndex]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(6, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  useEffect(() => {
    if (!autoAdvance || reduceMotion || !len || (pauseOnHover && hovering)) return;

    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));

    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next]);

  if (!len) return null;

  const activeItem = items[active];

  return (
    <div
      className={cn("w-full select-none", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Top Center Active Project Link */}
      {activeItem?.href && (
        <div className="mb-6 flex justify-center items-center w-full">
          <a
            href={activeItem.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-row gap-2.5 justify-center items-center group cursor-pointer max-w-full px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all shadow-md"
            aria-label={`Open link for ${activeItem.title}`}
          >
            <span className="flex sm:h-7 sm:w-7 h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 transition group-hover:bg-amber-500/30">
              <SquareArrowOutUpRight className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-xs sm:text-base font-mono uppercase tracking-widest text-amber-300 font-bold transition-colors group-hover:text-amber-200 truncate">
              {activeItem.title}
            </h3>
          </a>
        </div>
      )}

      {/* Stage */}
      <div
        className="relative w-full focus:outline-none flex items-center justify-center"
        style={{ height: Math.max(220, cardHeight + 50) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Ambient spotlight glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-2 mx-auto h-36 w-[80%] rounded-full bg-amber-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-28 w-[85%] rounded-full bg-black/50 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 flex items-end justify-center overflow-visible"
          style={{ perspective: `${perspectivePx}px` }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              if (!visible) return null;

              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 6;
              const z = -abs * depthPx;

              const isActive = off === 0;

              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;

              const dragProps = isActive
                ? {
                    drag: "x",
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (
                      _e,
                      info
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(140, cardWidth * 0.2);

                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-0 rounded-2xl border border-white/15 overflow-hidden shadow-2xl bg-ground/95 backdrop-blur-md transition-colors",
                    "will-change-transform select-none touch-pan-y",
                    isActive
                      ? "cursor-grab border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.22)]"
                      : "cursor-pointer hover:border-white/30"
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 30,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isActive })
                    ) : (
                      <DefaultFanCard item={item} active={isActive} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots navigation & arrow controls */}
      {showDots ? (
        <div className="mt-5 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <button
              onClick={prev}
              className="flex sm:h-9 sm:w-9 h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-ground-raised/80 text-ink transition hover:border-amber-500/50 hover:bg-white/10 active:scale-95 cursor-pointer"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-3 w-4" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {items.map((it, idx) => {
                const on = idx === active;
                return (
                  <button
                    key={it.id}
                    onClick={() => setActive(idx)}
                    className={cn(
                      "h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                      on
                        ? "w-6 sm:w-7 bg-accent shadow-[0_0_10px_#f59e0b]"
                        : "w-2 sm:w-2.5 bg-white/20 hover:bg-white/40"
                    )}
                    aria-label={`Go to ${it.title}`}
                  />
                );
              })}
            </div>

            <button
              onClick={next}
              className="flex sm:h-9 sm:w-9 h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-ground-raised/80 text-ink transition hover:border-amber-500/50 hover:bg-white/10 active:scale-95 cursor-pointer"
              aria-label="Next card"
            >
              <ChevronRight className="h-3 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({ item, active }) {
  return (
    <div className="relative h-full w-full group overflow-hidden rounded-2xl">
      {/* image */}
      <div className="absolute inset-0">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            draggable={false}
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-ground-raised text-xs text-ink-faint">
            No image
          </div>
        )}
      </div>

      {/* gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/95 via-black/45 to-black/25" />

      {/* Badge / Category (Bottom Right) */}
      {item.tag && (
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-ground/90 border border-amber-500/40 backdrop-blur-md text-[6px] sm:text-[10px] font-mono uppercase tracking-widest text-amber-300 font-semibold shadow-md max-w-[50%] sm:max-w-[55%] truncate">
          {item.tag}
        </div>
      )}

      {/* Project Number (Top Left) */}
      {item.number && (
        <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 font-mono text-[10px] sm:text-xs font-bold text-amber-400/90 bg-ground/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md border border-white/10">
          {item.number}
        </div>
      )}

      {/* Content at Bottom */}
      <div className="relative z-10 flex h-full flex-col justify-end p-3 sm:p-5 text-white">
        <div className="text-sm sm:text-2xl font-bold leading-tight text-ink font-display drop-shadow-md">
          {item.title}
        </div>

        {item.description ? (
          <div className="mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2 text-[11px] sm:text-sm text-ink-dim leading-relaxed font-sans">
            {item.description}
          </div>
        ) : null}

        {item.stack && item.stack.length > 0 && (
          <div className="mt-1.5 sm:mt-3 flex flex-wrap gap-1 sm:gap-1.5">
            {item.stack.map((s) => (
              <span
                key={s}
                className="rounded-full bg-white/10 px-1.5 sm:px-2.5 py-0.5 font-mono text-[8px] sm:text-[10px] text-amber-300/95 backdrop-blur-xs border border-amber-500/20"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const [responsiveConfig, setResponsiveConfig] = useState({
    width: 520,
    height: 330,
    overlap: 0.60,
    spreadDeg: 38,
    maxVisible: 5,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      if (w < 640) {
        // Proportionally scaled down desktop layout for mobile
        const cardW = Math.min(w - 32, 320);
        const cardH = Math.round(cardW * (330 / 520)); // Exact same desktop aspect ratio scaled down!
        setResponsiveConfig({
          width: cardW,
          height: cardH,
          overlap: 0.62,
          spreadDeg: 36,
          maxVisible: 5,
        });
      } else if (w < 1024) {
        // Tablet layout
        const cardW = 440;
        const cardH = Math.round(cardW * (330 / 520));
        setResponsiveConfig({
          width: cardW,
          height: cardH,
          overlap: 0.60,
          spreadDeg: 36,
          maxVisible: 5,
        });
      } else {
        // Desktop layout
        setResponsiveConfig({
          width: 520,
          height: 330,
          overlap: 0.60,
          spreadDeg: 38,
          maxVisible: 5,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const items = useMemo(() => {
    return rawProjects.map((p, i) => ({
      id: p.name,
      number: p.number,
      title: p.name,
      description: p.description,
      tag: p.category,
      stack: p.stack,
      imageSrc: projectImages[i % projectImages.length],
      href: p.link,
      ctaLabel: p.linkLabel || "View project",
    }));
  }, []);

  return (
    <section id="projects" className="mx-auto max-w-7xl border-b border-line px-6 md:px-10 py-12 sm:py-24 overflow-hidden">
      <div>
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects built from idea to execution"
          index="00 / 05"
        />

        <div className="mt-6">
          <CardStack
            items={items}
            cardWidth={responsiveConfig.width}
            cardHeight={responsiveConfig.height}
            maxVisible={responsiveConfig.maxVisible}
            overlap={responsiveConfig.overlap}
            spreadDeg={responsiveConfig.spreadDeg}
            perspectivePx={1100}
            depthPx={130}
            tiltXDeg={10}
            activeLiftPx={20}
            activeScale={0.98}
            inactiveScale={0.84}
            loop={true}
            showDots={true}
          />
        </div>
      </div>
    </section>
  );
}
