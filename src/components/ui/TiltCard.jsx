import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import usePointerCapable from "../../hooks/usePointerCapable";
import useReducedMotion from "../../hooks/useReducedMotion";
import { SPRING_SOFT } from "../../hooks/motionConfig";

/**
 * Wraps children in a perspective tilt that reacts to cursor position
 * within the element's bounds. Disabled on touch devices and when the
 * user prefers reduced motion — renders children untouched in that case.
 *
 * `range` controls max tilt in degrees (kept subtle by default).
 * `lift` adds a small translateZ/scale pop on hover for depth.
 */
export default function TiltCard({
  children,
  className = "",
  range = 8,
  lift = true,
  glare = false,
  as: Tag = motion.div,
  ...rest
}) {
  const ref = useRef(null);
  const pointerCapable = usePointerCapable();
  const reduced = useReducedMotion();
  const active = pointerCapable && !reduced;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [range, -range]), SPRING_SOFT);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-range, range]), SPRING_SOFT);
  const scale = useSpring(1, SPRING_SOFT);
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(my, [0, 1], ["0%", "100%"]);

  const handleMove = (e) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    if (lift) scale.set(1);
  };

  const handleEnter = () => {
    if (lift && active) scale.set(1.015);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        rotateX: active ? rotateX : 0,
        rotateY: active ? rotateY : 0,
        scale: active ? scale : 1,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className={className}
      {...rest}
    >
      {children}
      {glare && active && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(320px circle at ${glareX} ${glareY}, rgba(201,255,58,0.10), transparent 60%)`,
          }}
        />
      )}
    </Tag>
  );
}
