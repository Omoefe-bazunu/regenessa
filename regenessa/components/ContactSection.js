"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Microscope, Calendar } from "lucide-react";

export default function ConsultationCTA() {
  return (
    <section className="py-12 bg-brand-warm transition-all duration-500 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        <div className="bg-brand-primary dark:bg-white/5 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 rounded-sm relative overflow-hidden group">
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-brand-accent" size={16} />
              <span className="font-jakarta font-black text-[9px] uppercase tracking-[0.4em] text-brand-accent">
                Expert Guidance Available
              </span>
            </div>
            <p className="font-syne text-3xl md:text-4xl font-bold text-white leading-tight tracking-tighter mb-4">
              Optimize Your{" "}
              <span className="text-brand-accent">Biological</span> Potential.
            </p>
            <p className="font-jakarta text-white/60 text-sm max-w-md">
              Direct access to Emuovbe Patience for plant stem cell therapy and
              cellular health optimization.
            </p>
          </div>

          <div className="relative z-10 mt-8 md:mt-0">
            <Link
              href="/consultation"
              className="inline-flex items-center gap-4 px-8 py-5 bg-white text-brand-primary font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 shadow-xl"
            >
              Book Session <ArrowRight size={14} />
            </Link>
          </div>

          {/* MINIMAL DECORATION */}
          <div className="absolute right-0 top-0 opacity-10 text-white pointer-events-none">
            <Microscope size={180} />
          </div>
        </div>
      </div>
    </section>
  );
}
