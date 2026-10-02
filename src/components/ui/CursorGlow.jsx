import { useEffect, useRef } from "react";
import usePointerCapable from "../../hooks/usePointerCapable";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function CursorGlow() {
  const pointerCapable = usePointerCapable();
  const reduced = useReducedMotion();
  const active = pointerCapable && !reduced;
  const glowRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const onMove = (e) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    const onOver = (e) => {
      const el = e.target.closest?.("a, button, [data-glow-boost]");
      if (glowRef.current) {
        glowRef.current.style.opacity = el ? "1" : "0.5";
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 h-105 w-105 rounded-full mix-blend-screen transition-opacity duration-300"
      style={{
        opacity: 0.5,
        background:
          "radial-gradient(circle, rgba(124,140,255,0.10), rgba(201,255,58,0.05) 45%, transparent 70%)",
      }}
    />
  );
}
