import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { MacbookScroll } from "./ui/macbook-scroll";
import { useLanguage } from "../context/LanguageContext";

export default function Certifications() {
  const { content } = useLanguage();
  const { sections, certifications } = content;
  const certText = sections.certifications;

  return (
    <section id="certifications" className="relative border-b border-line px-6 py-12 sm:py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={certText.eyebrow}
          title={certText.title}
          index={certText.index}
        />

        {/* Macbook Scroll interactive certificate presentation */}
        <div className="w-full">
          <MacbookScroll
            showGradient={false}
            certifications={certifications}
          />
        </div>
      </div>
    </section>
  );
}
