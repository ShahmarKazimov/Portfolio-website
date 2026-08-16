import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import usePointerCapable from "../../hooks/usePointerCapable";
import useReducedMotion from "../../hooks/useReducedMotion";
import { SPRING_SNAPPY } from "../../hooks/motionConfig";

/**
 * Wraps an interactive element (button/link) with a subtle magnetic pull
 * toward the cursor when nearby. No-op on touch devices / reduced motion.
 */
export default function MagneticElement({
  children,
  className = "",
  strength = 0.25,
  as: Tag = motion.div,
  ...rest
}) {
  const ref = useRef(null);
  const pointerCapable = usePointerCapable();
  const reduced = useReducedMotion();
  const active = pointerCapable && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_SNAPPY);
  const springY = useSpring(y, SPRING_SNAPPY);

  const handleMove = (e) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const relX = e.clientX - (r.left + r.width / 2);
    const relY = e.clientY - (r.top + r.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: active ? springX : 0, y: active ? springY : 0 }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
