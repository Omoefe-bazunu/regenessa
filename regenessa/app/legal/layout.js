// app/legal/layout.js
export default function LegalLayout({ children }) {
  return (
    <main className="min-h-screen bg-brand-warm dark:bg-brand-dark pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6 prose dark:prose-invert prose-headings:font-heading prose-p:text-foreground/70 prose-strong:text-brand-primary">
        {children}
        <div className="mt-20 pt-10 border-t border-border text-xs text-foreground/40 text-center uppercase font-bold tracking-[0.2em]">
          Last Updated: January 2026 • Clean Foods
        </div>
      </div>
    </main>
  );
}
