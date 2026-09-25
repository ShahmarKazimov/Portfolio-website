import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { certifications } from "../data/content";
import { MacbookScroll } from "./ui/macbook-scroll";

const totalCount = certifications.reduce((sum, group) => sum + group.items.length, 0);

export default function Certifications() {
  return (
    <section id="certifications" className="relative border-b border-line px-6 py-12 sm:py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Certifications"
          title={`Certificates in AI, education, and business.`}
          index="00 / 04"
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
