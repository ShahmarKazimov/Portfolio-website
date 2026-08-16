import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import usePointerCapable from "../../hooks/usePointerCapable";
import useReducedMotion from "../../hooks/useReducedMotion";
import { SPRING_TRAIL } from "../../hooks/motionConfig";

/**
 * A single, very low-intensity radial glow that trails the cursor across
 * dark sections. Positioned via transform (translate) driven by springs —
 * no per-mousemove React re-renders, no layout thrash. Disabled entirely
 * on touch devices and when reduced motion is preferred.
 */
export default function CursorGlow() {
  const pointerCapable = usePointerCapable();
  const reduced = useReducedMotion();
  const active = pointerCapable && !reduced;

  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, SPRING_TRAIL);
  const springY = useSpring(y, SPRING_TRAIL);
  const intensity = useMotionValue(0.5);
  const springIntensity = useSpring(intensity, SPRING_TRAIL);

  useEffect(() => {
    if (!active) return;
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);
        raf = null;
      });
    };
    const onOver = (e) => {
      const el = e.target.closest?.("a, button, [data-glow-boost]");
      intensity.set(el ? 1 : 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, x, y, intensity]);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
      style={{
        x: springX,
        y: springY,
        opacity: springIntensity,
        background:
          "radial-gradient(circle, rgba(124,140,255,0.10), rgba(201,255,58,0.05) 45%, transparent 70%)",
      }}
    />
  );
}
