import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Capabilities from "./components/Capabilities";
import Experience from "./components/Experience";
import Certifications from "./components/Certifications";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CursorGlow from "./components/ui/CursorGlow";
import usePointerCapable from "./hooks/usePointerCapable";
import useReducedMotion from "./hooks/useReducedMotion";
import { SPRING_TRAIL } from "./hooks/motionConfig";

function GradientMesh() {
  const pointerCapable = usePointerCapable();
  const reduced = useReducedMotion();
  const active = pointerCapable && !reduced;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // Kept deliberately tiny — this is a background reinforcement layer, not
  // a competing parallax system with the hero/portrait.
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), SPRING_TRAIL);
  const y = useSpring(useTransform(my, [-0.5, 0.5], [-10, 10]), SPRING_TRAIL);

  useEffect(() => {
    if (!active) return;
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
        raf = null;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, mx, my]);

  return (
    <motion.div
      className="gradient-mesh"
      aria-hidden="true"
      style={{ x: active ? x : 0, y: active ? y : 0 }}
    >
      <span />
      <span />
      <span />
    </motion.div>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen bg-ground text-ink">
      <div className="noise" />
      <GradientMesh />
      <CursorGlow />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <About />
          <Capabilities />
          <Experience />
          <Certifications />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
