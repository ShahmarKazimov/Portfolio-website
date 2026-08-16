export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 font-mono text-xs text-ink-faint sm:flex-row">
        <p>© {year} Shahmar Kazimov. All rights reserved.</p>
      </div>
    </footer>
  );
}
