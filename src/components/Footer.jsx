import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { content } = useLanguage();
  const { profile, sections } = content;

  return (
    <footer className="border-t border-line px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 font-mono text-xs text-ink-faint sm:flex-row">
        <p className="flex justify-center items-center gap-1.5">
          <span className="text-lg mt-0.5 ">© </span> {year} {profile.name}. {sections.footer.rights}
        </p>
      </div>
    </footer>
  );
}
