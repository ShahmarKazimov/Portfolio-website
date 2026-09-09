import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { nav, profile } from "../data/content";
import logoMain from "../assets/logo-main.png";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${scrolled ? "bg-black backdrop-blur-md border-line" : "bg-transparent"
        }`}
    >
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between py-6">
        <div className=" rounded-b-2xl bg-black! py-3 px-4 absolute top-0">
          <a href="#intro" className="font-display text-sm">
            <img src={logoMain} alt="Logo" className="h-6 w-7" />
          </a>
        </div>

        <ul className="pointer-events-auto absolute left-1/2 top-0 hidden -translate-x-1/2 items-center gap-6 rounded-b-2xl bg-black px-8 py-3 shadow-lg lg:flex xl:gap-10 xl:px-10">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="whitespace-nowrap text-xs transition-colors sm:text-sm"
                style={{ color: "rgba(225, 224, 204, 0.8)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)")}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-1 rounded-b-2xl bg-black border-line px-4 font-mono text-xs uppercase tracking-widest lg:absolute lg:top-0 py-3 lg:right-0 lg:flex">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`rounded-full px-3 py-1 transition-colors cursor-pointer ${lang === "en" ? "bg-accent text-ground" : "text-ink-dim hover:text-ink"
              }`}
          >
            En
          </button>
          <button
            type="button"
            onClick={() => setLang("az")}
            className={`rounded-full px-2.5 py-1 transition-colors  cursor-pointer ${lang === "az" ? "bg-accent text-ground" : "text-ink-dim hover:text-ink"
              }`}
          >
            Az
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink lg:hidden"
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute -left-0.5 top-0 h-px w-5 bg-current transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-2 h-px w-4 bg-current transition-transform ${open ? "hidden -translate-y-[6px] -rotate-45" : ""}`}
            />
            <span
              className={`absolute -left-0.5 top-4 h-px w-5 bg-current transition-transform ${open ? "-translate-y-[10px] -rotate-45" : ""}`}
            />
          </span>
        </motion.button>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-line bg-ground lg:hidden"
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
