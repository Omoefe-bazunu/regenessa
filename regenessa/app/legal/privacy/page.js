"use client";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, ChevronRight } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-warm  pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* BREADCRUMBS */}
        <nav className="flex items-center justify-center gap-2 mb-12 font-jakarta text-[9px] font-black uppercase tracking-[0.3em] text-brand-dark/40 dark:text-white/30">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Home
          </Link>
          <span>|</span>
          <span className="text-brand-dark">Privacy Policy</span>
        </nav>

        {/* HEADER */}
        <div className="text-center mb-16">
          <ShieldCheck className="mx-auto text-brand-dark mb-6" size={48} />
          <h1 className="font-syne text-4xl md:text-6xl font-bold text-brand-dark dark:text-white tracking-tighter mb-6">
            Privacy <span className="text-brand-accent italic">Policy.</span>
          </h1>
          <p className="font-jakarta text-brand-dark/50 dark:text-white/50 text-sm max-w-2xl mx-auto leading-relaxed">
            THE REGENESSA LIMITED (&quot;we,&quot; &quot;our,&quot; or
            &quot;us&quot;) is committed to securing your clinical and personal
            data. This policy details our protocols in accordance with the{" "}
            <strong>Nigeria Data Protection Regulation (NDPR)</strong>.
          </p>
        </div>

        <div className="space-y-12">
          {/* SECTION 1 */}
          <section className="bg-white dark:bg-white/5 p-8 md:p-12 border border-brand-dark/5 rounded-sm shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-primary/10 text-brand-darkrounded-full">
                <FileText size={20} />
              </div>
              <h3 className="font-syne text-xl font-bold uppercase tracking-tight">
                1. Information We Collect
              </h3>
            </div>
            <p className="font-jakarta text-sm text-brand-dark/60 dark:text-white/60 mb-6 leading-relaxed">
              To provide accurate stem cell therapy recommendations, we collect:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Identity: Name, email, and clinical contact phone.",
                "Clinical Intake: Health concerns and biological goals.",
                "Logistics: Delivery addresses for product shipments.",
                "Financial: Flutterwave transaction references (we do not store cards).",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-xs font-bold font-jakarta text-brand-dark/70 dark:text-white/70"
                >
                  <div className="w-1 h-1 rounded-full bg-brand-primary mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* SECTION 2 */}
          <section className="bg-white dark:bg-white/5 p-8 md:p-12 border border-brand-dark/5 rounded-sm shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-primary/10 text-brand-dark rounded-full">
                <Eye size={20} />
              </div>
              <h3 className="font-syne text-xl font-bold uppercase tracking-tight">
                2. Clinical Data Usage
              </h3>
            </div>
            <div className="space-y-4 font-jakarta text-sm text-brand-dark/60 dark:text-white/60 leading-relaxed">
              <p>Your data is processed exclusively for: </p>
              <ul className="space-y-3">
                <li>
                  • Developing personalized plant-based stem cell Supplements.
                </li>
                <li>• Coordinating delivery logistics for products.</li>
                <li>
                  • Internal clinical reviews conducted by our lead therapist.
                </li>
              </ul>
            </div>
          </section>
          {/* SECTION 3 */}
          <section className="bg-white dark:bg-white/5 p-8 md:p-12 border border-brand-dark/5 rounded-sm shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-primary/10 text-brand-dark rounded-full">
                <Lock size={20} />
              </div>
              <h3 className="font-syne text-xl font-bold uppercase tracking-tight">
                3. Data Security & Sharing
              </h3>
            </div>
            <p className="font-jakarta text-sm text-brand-dark/60 dark:text-white/60 leading-relaxed">
              We enforce a <strong>Zero-Sale Policy</strong> on personal data.
              Relevant details are shared only with Flutterwave for payment
              processing and verified shipping partners to ensure the safe
              transit of ordered products to your location.
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-brand-dark/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/30">
            © 2026 THE REGENESSA LIMITED • All Rights Reserved
          </p>
        </footer>
      </div>
    </main>
  );
}
