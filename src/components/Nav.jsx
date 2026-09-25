import { useEffect, useState } from "react";
import logoMain from "../assets/logo-main.png";
import { useLanguage } from "../context/LanguageContext";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { lang, setLang, content } = useLanguage();
  const navItems = content.nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const sectionElements = navItems
      .map((item) => item.href.replace("#", ""))
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [navItems]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-ground/85 backdrop-blur-md border-b border-line shadow-xs" : "bg-transparent"
      }`}
    >
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-2 sm:px-6 lg:px-0 lg:py-8">
        <div className="py-3 lg:rounded-b-2xl lg:rounded-t-none lg:absolute lg:top-2">
          <a href="/" className="font-display text-sm">
            <img src={logoMain} alt="Logo" className="h-6 w-7" />
          </a>
        </div>

        <ul className="pointer-events-auto absolute left-1/2 top-2 hidden -translate-x-1/2 items-center gap-6 px-8 py-3 lg:flex xl:gap-10 xl:px-10">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <li key={item.href} className={`nav-effect-item ${isActive ? "active" : ""}`}>
                <a
                  href={item.href}
                  className="whitespace-nowrap text-xs transition-colors sm:text-sm inline-block"
                  style={{ color: isActive ? "var(--color-accent)" : "var(--color-ink)" }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 lg:absolute lg:top-2 py-3 lg:right-0">
          {!open && (
            <div className="hidden lg:flex items-center gap-1 font-mono text-xs uppercase tracking-widest">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded-lg px-3 border py-1.5 transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-accent border-accent text-ground font-bold shadow-xs"
                    : "text-ink border-line hover:text-accent hover:border-accent/40"
                }`}
              >
                En
              </button>
              <button
                type="button"
                onClick={() => setLang("az")}
                className={`rounded-lg px-3 border py-1.5 transition-colors cursor-pointer ${
                  lang === "az"
                    ? "bg-accent border-accent text-ground font-bold shadow-xs"
                    : "text-ink border-line hover:text-accent hover:border-accent/40"
                }`}
              >
                Az
              </button>
            </div>
          )}

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`menu-icon-btn lg:hidden ${open ? "open" : ""}`}
          />
        </div>
      </nav>

      {/* Mobile Morphing Liquid Blob Background */}
      <div className={`mobile-nav-blob lg:hidden ${open ? "open" : ""}`} />

      {/* Mobile Fullscreen Menu Overlay */}
      <div className={`mobile-nav-overlay lg:hidden ${open ? "open" : ""}`}>
        <ul>
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <li key={item.href} className={isActive ? "active" : ""}>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            );
          })}

          <li className="flex items-center justify-center gap-3 pt-8">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                lang === "en"
                  ? "bg-accent text-ground font-bold shadow-sm"
                  : "text-ink-dim border border-line hover:text-ink"
              }`}
            >
              En
            </button>
            <button
              type="button"
              onClick={() => setLang("az")}
              className={`rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                lang === "az"
                  ? "bg-accent text-ground font-bold shadow-sm"
                  : "text-ink-dim border border-line hover:text-ink"
              }`}
            >
              Az
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
