import { useEffect, useState } from "react";

/**
 * True only for devices with a fine pointer that supports hover
 * (mouse / trackpad). False for touch-only devices, so mouse-driven
 * effects (tilt, magnetic pull, cursor glow) can be gated off cleanly.
 */
export default function usePointerCapable() {
  const [capable, setCapable] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(hover: hover) and (pointer: fine)").matches
      : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCapable(mq.matches);
    const onChange = (e) => setCapable(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return capable;
}
