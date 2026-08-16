import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { nav, profile } from "../data/content";
import MagneticElement from "./ui/MagneticElement";
import logoMain from "../assets/logo-main.png";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? "bg-ground/85 backdrop-blur-md border-b border-line" : "bg-transparent"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#intro" className="font-display text-sm font-medium tracking-tight text-ink">
          <img src={logoMain} alt="Logo" className="h-6 w-7" />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-mono text-xs uppercase tracking-widest text-ink-dim transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <MagneticElement
            as={motion.a}
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            strength={0.3}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-mono text-xs uppercase tracking-widest text-ground transition-transform hover:-translate-y-0.5"
          >
            Download CV
          </MagneticElement>
          <MagneticElement
            as={motion.a}
            href="#contact"
            strength={0.3}
            className="rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Let's talk
          </MagneticElement>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 bottom-0 h-px w-4 bg-current transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </span>
        </motion.button>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-line bg-ground md:hidden"
        >
          <ul className="flex flex-col px-6 py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-mono text-sm uppercase tracking-widest text-ink-dim hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block py-3 font-mono text-sm uppercase tracking-widest text-accent"
              >
                Download CV
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
}
