import { motion } from "framer-motion";
import { profile } from "../data/content";
import FancyTextHover from "./ui/FancyTextHover";
import { InteractiveTravelCard } from "./ui/InteractiveTravelCard";
import profilePictureUrl from "../assets/profile-picture.png";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 md:px-10">
      <div className="absolute inset-0" />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-105 w-105 rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-signal), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent"
        >
          Contact
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-5xl"
        >
          Let's build something worthwhile.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-12 flex flex-col gap-8 border-t border-line pt-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <InteractiveTravelCard
            title="Shahmar Kazimov"
            imageUrl={profilePictureUrl}
          />

          <div className="flex flex-col gap-6 font-mono text-sm text-ink-dim lg:items-end">
            <FancyTextHover className="justify-start lg:justify-end gap-6 sm:gap-10" />

            <div className="flex items-center gap-2 text-xs text-ink-faint">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{profile.location}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
