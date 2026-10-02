import { motion } from "motion/react";

export function ScrollElementReveal({
  children,
  className = "",
  style = {},
  delay = 0,
  yOffset = 24,
  duration = 0.6,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default ScrollElementReveal;
