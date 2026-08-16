import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { certifications } from "../data/content";
import { VIEWPORT_ONCE } from "../hooks/motionConfig";

const totalCount = certifications.reduce((sum, group) => sum + group.items.length, 0);

export default function Certifications() {
  return (
    <section id="certifications" className="border-b border-line px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Certifications"
          title={`${totalCount} credentials across AI fluency, education, and business.`}
          index="00 / 04"
        />

        <div className="flex flex-col gap-10">
          {certifications.map((group, gi) => (
            <motion.div
              key={group.issuer}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: gi * 0.06 }}
            >
              <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-3">
                <h3 className="font-display text-lg font-medium text-ink">{group.issuer}</h3>
                <span className="font-mono text-xs text-ink-faint">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((cert) => {
                  const CardTag = cert.link ? "a" : "div";
                  return (
                    <CardTag
                      key={cert.name}
                      {...(cert.link
                        ? { href: cert.link, target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group rounded-xl border border-line bg-ground-raised px-4 py-3 transition-colors hover:border-accent/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm leading-snug text-ink-dim transition-colors group-hover:text-ink">
                          {cert.name}
                        </p>
                        {cert.link && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint transition-colors group-hover:text-accent"
                          >
                            <path d="M7 17 17 7" />
                            <path d="M7 7h10v10" />
                          </svg>
                        )}
                      </div>
                      {cert.description && (
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">
                          {cert.description}
                        </p>
                      )}
                    </CardTag>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
