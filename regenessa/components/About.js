"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Target, Award, ArrowRight } from "lucide-react";

export default function AboutSection() {
  const coreValues = [
    {
      icon: <ShieldCheck className="text-brand-accent" size={24} />,
      title: "Our Mission",
      desc: "Promoting holistic longevity through innovative anti-aging and plant stem cell solutions. ",
    },
    {
      icon: <Target className="text-brand-accent" size={24} />,
      title: "Our Vision",
      desc: "To be a trusted leader in regenerative wellness, empowering graceful and natural aging.",
    },
    {
      icon: <Award className="text-brand-accent" size={24} />,
      title: "Expert Leadership",
      desc: "Led by Emuovbe Patience, a dedicated Lifestyle Consultant and Plant Stemcell Therapist. ",
    },
  ];

  return (
    <section className="py-16 bg-brand-primary transition-colors duration-500 overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: CONTENT AREA */}
          <div className="animate-page-reveal">
            <span className="font-jakarta font-black text-[10px] uppercase tracking-[0.4em] mb-4 block text-brand-accent">
              The Science of Longevity
            </span>
            <h2 className="font-syne text-4xl lg:text-6xl font-bold mb-8 text-brand-warm leading-[1.1] tracking-tighter">
              <span className="text-white">Pioneering</span> <br />
              <span className="text-brand-accent">Regenerative</span>{" "}
              <span className="text-white">Wellness</span>
            </h2>

            <p className="font-jakarta text-white/70 dark:text-brand-dark/70 text-lg leading-relaxed mb-12 max-w-xl">
              Regenessa stands at the forefront of cellular health, bridging the
              gap between clinical science and natural recovery. We specialize
              in plant stem cell therapy designed to optimize your biological
              potential.
            </p>

            <div className="space-y-8 mb-12">
              {coreValues.map((value, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="shrink-0 w-12 h-12 rounded-sm border border-brand-accent/30 flex items-center justify-center bg-white/5 transition-colors group-hover:bg-brand-accent/10">
                    {value.icon}
                  </div>
                  <div>
                    <div className="font-syne font-bold text-white">
                      {value.title}
                    </div>
                    <p className="font-jakarta text-sm text-white/50 dark:text-brand-dark/50 leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-4 px-10 py-5 bg-white text-brand-primary font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 group"
            >
              Consult a Therapist
              <ArrowRight
                size={14}
                className="group-hover:translate-x-2 transition-transform"
              />
            </Link>
          </div>

          {/* RIGHT: IMAGE AREA */}
          <div className="relative animate-page-reveal [animation-delay:300ms]">
            <div className="relative aspect-4/5 rounded-sm overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
                alt="Clinical Stem Cell Research"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-brand-primary/20 mix-blend-multiply" />
            </div>

            {/* FLOATING BADGE */}
            <div className="absolute -bottom-8 -left-8 bg-brand-accent p-8 rounded-sm shadow-2xl hidden md:block border border-white">
              <p className="font-syne font-black text-brand-primary text-4xl leading-none mb-1">
                100%
              </p>
              <p className="font-jakarta font-bold text-brand-primary/60 text-[9px] uppercase tracking-widest">
                Natural Activators
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
