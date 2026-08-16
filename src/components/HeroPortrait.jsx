import { motion, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import profilePicture from "../assets/profile-picture.png";
import { SPRING_TRAIL } from "../hooks/motionConfig";

// Max tilt angle (deg) applied to the portrait as the cursor moves across
// the hero. Kept subtle so it reads as depth, not a gimmick.
const MAX_TILT = 14;

export default function HeroPortrait({ gx, gy, active }) {
  // Perspective tilt: card leans toward the cursor, matching the
  // convention used by most tilt-on-hover implementations.
  const rotateY = useSpring(useTransform(gx, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), SPRING_TRAIL);
  const rotateX = useSpring(useTransform(gy, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), SPRING_TRAIL);

  // Backdrop glow drifts opposite the tilt so it reads as the layer
  // furthest from the viewer — reinforces the depth stack.
  const glowX = useSpring(useTransform(gx, [-0.5, 0.5], [16, -16]), SPRING_TRAIL);
  const glowY = useSpring(useTransform(gy, [-0.5, 0.5], [12, -12]), SPRING_TRAIL);

  // Pointer-following light sheen across the photo, reinforcing the
  // illusion of a lit, physical (not flat) surface.
  const sheenX = useTransform(gx, [-0.5, 0.5], ["15%", "85%"]);
  const sheenY = useTransform(gy, [-0.5, 0.5], ["15%", "85%"]);
  const sheenBackground = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.35), transparent 55%)`;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ perspective: 1200 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, filter: "blur(16px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          rotateX: active ? rotateX : 0,
          rotateY: active ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        className="relative aspect-square w-[62%] max-w-[320px] min-w-[180px]"
      >
        {/* backmost depth layer: ambient glow, drifts opposite the tilt */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[16%] rounded-full opacity-60 blur-[30px]"
          style={{
            background: "radial-gradient(circle, var(--color-signal), transparent 70%)",
            transform: "translateZ(-70px)",
            x: active ? glowX : 0,
            y: active ? glowY : 0,
          }}
        />

        {/* rotating conic glow ring */}
        <div
          className="orbit-spin pointer-events-none absolute -inset-[6%] rounded-full opacity-70 [mask-image:radial-gradient(circle,transparent_62%,black_64%,black_68%,transparent_70%)]"
          style={{
            background:
              "conic-gradient(from 0deg, var(--color-accent), var(--color-signal), transparent 40%, var(--color-accent))",
            transform: "translateZ(16px)",
          }}
        />

        {/* dashed static ring */}
        <div
          className="pointer-events-none absolute -inset-[6%] rounded-full border border-dashed border-line"
          style={{ transform: "translateZ(28px)" }}
        />

        {/* frontmost layer: circular portrait photo, cropped to frame face/shoulders */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          style={{ transform: "translateZ(52px)" }}
        >
          <img
            src={profilePicture}
            alt="Shahmar Kazimov"
            className="h-full w-full select-none object-cover"
            draggable={false}
            style={{
              objectPosition: "center 18%",
              filter: "grayscale(1) contrast(1.1) brightness(0.95)",
            }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{ opacity: active ? 1 : 0, background: sheenBackground }}
          />
        </div>
      </motion.div>
    </div>
  );
}
