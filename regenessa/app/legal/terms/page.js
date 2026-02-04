"use client";
import Link from "next/link";
import {
  Scale,
  AlertTriangle,
  CreditCard,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-warm  pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* BREADCRUMBS */}
        <nav className="flex items-center justify-center gap-2 mb-12 font-jakarta text-[9px] font-black uppercase tracking-[0.3em] text-brand-dark/40 dark:text-white/30">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Home
          </Link>
          <span>|</span>
          <span className="text-brand-dark">Terms & Conditions</span>
        </nav>

        {/* HEADER */}
        <div className="text-center mb-16">
          <Scale className="mx-auto text-brand-dark mb-6" size={48} />
          <h1 className="font-syne text-4xl md:text-6xl font-bold text-brand-dark dark:text-white tracking-tighter mb-6 leading-none">
            Service <span className="text-brand-accent italic">Protocols.</span>
          </h1>
          <p className="font-jakarta text-brand-dark/50 dark:text-white/50 text-sm max-w-2xl mx-auto leading-relaxed">
            By accessing the Regenessa Registry, you agree to the following
            terms governing our clinical regenerative wellness services and
            product distribution.
          </p>
        </div>

        <div className="space-y-8">
          {/* MEDICAL DISCLAIMER */}
          <section className="bg-amber-50 dark:bg-amber-950/20 p-8 md:p-12 border border-amber-200 dark:border-amber-900/30 rounded-sm">
            <div className="flex items-center gap-4 mb-6 text-brand-dark">
              <AlertTriangle size={24} />
              <h3 className="font-syne text-xl font-bold uppercase tracking-tight">
                1. Disclaimer
              </h3>
            </div>
            <div className="font-jakarta text-sm text-amber-900/70 dark:text-amber-200/60 space-y-4 leading-relaxed">
              <p>
                Plant-based stem cell activators provided by Regenessa are
                intended to support biological wellness and cellular repair.
                These products are not intended to diagnose, treat, cure, or
                prevent any disease.
              </p>
              <p>
                <strong>
                  Always consult with a qualified health professional
                </strong>{" "}
                before beginning any new regenerative products, especially if
                you have pre-existing clinical conditions.
              </p>
            </div>
          </section>

          {/* ORDERS & PRICING */}
          <section className="bg-white dark:bg-white/5 p-8 md:p-12 border border-brand-dark/5 rounded-sm shadow-sm">
            <div className="flex items-center gap-4 mb-6 text-brand-dark">
              <CreditCard size={24} />
              <h3 className="font-syne text-xl font-bold uppercase tracking-tight">
                2. Orders & Payments
              </h3>
            </div>
            <div className="font-jakarta text-sm text-brand-dark/60 dark:text-white/60 space-y-4 leading-relaxed">
              <p>
                Clinical product prices are listed in Nigerian Naira (₦) and are
                subject to market adjustments. However, prices are secured once
                your payment is verified via Flutterwave.
              </p>
              <ul className="space-y-2">
                <li>
                  • Orders are processed only upon successful verification of
                  the transaction ID.
                </li>
                <li>
                  • Digital receipts generated through the Regenessa platform
                  serve as the official record.
                </li>
              </ul>
            </div>
          </section>

          {/* RETURNS */}
          <section className="bg-white dark:bg-white/5 p-8 md:p-12 border border-brand-dark/5 rounded-sm shadow-sm">
            <div className="flex items-center gap-4 mb-6 text-brand-dark">
              <RefreshCcw size={24} />
              <h3 className="font-syne text-xl font-bold uppercase tracking-tight">
                3. Returns & Clinical Integrity
              </h3>
            </div>
            <p className="font-jakarta text-sm text-brand-dark/60 dark:text-white/60 leading-relaxed">
              To maintain the biological integrity of our supplements (e.g.,
              Crystal Cell, Actual +), we do not accept returns on opened or
              tampered products. Returns are only eligible if the product seal
              is compromised upon delivery or if the item significantly deviates
              from the clinical description.
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-brand-dark/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/30">
            © 2026 THE REGENESSA LIMITED • Clinical Integrity Registry
          </p>
        </footer>
      </div>
    </main>
  );
}
