"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Target,
  Award,
  ArrowRight,
  Handshake,
  ExternalLink,
} from "lucide-react";

export default function AboutSection() {
  const coreValues = [
    {
      icon: <Target className="text-brand-accent" size={24} />,
      title: "Our Mission & Vision",
      desc: "To be a trusted leader in regenerative wellness, promoting holistic longevity through scientifically backed plant stem cell solutions.",
    },
    {
      icon: <Award className="text-brand-accent" size={24} />,
      title: "Expert Leadership",
      desc: "Led by Emuovbe Patience, a dedicated Lifestyle Consultant and Plant Stemcell Therapist guiding our clinical direction.",
    },
    {
      icon: <Handshake className="text-brand-accent" size={24} />,
      title: "Phytoscience Partnership",
      desc: "Our strategic alliance with Phytoscience, the sole distributor of these revolutionary products, guarantees 100% authenticity.",
    },
  ];

  return (
    <section className="py-16 bg-brand-primary transition-colors duration-500 overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: CONTENT AREA */}
          <div className="animate-page-reveal">
            <span className="font-jakarta font-black text-[10px] uppercase tracking-[0.4em] mb-4 block text-brand-accent">
              ABOUT REGENESSA
            </span>
            <h2 className="font-syne text-4xl lg:text-6xl font-bold mb-8 text-brand-warm leading-[1.1] tracking-tighter">
              <span className="text-white">Pioneering</span> <br />
              <span className="text-brand-accent">Regenerative</span>{" "}
              <span className="text-white">Wellness</span>
            </h2>

            {/* PARTNERSHIP ANNOUNCEMENT BOX */}
            <div className="mb-10 p-6 bg-white/5 border-l-2 border-brand-accent rounded-r-sm">
              <p className="font-jakarta text-white/80 text-sm leading-relaxed italic">
                &quot;Under the expert leadership of{" "}
                <span className="text-brand-accent font-bold">
                  Emuovbe Patience
                </span>
                , we are proud to announce our official partnership with{" "}
                <span className="text-white font-bold">Phytoscience</span> — the
                sole distributor of premium plant stem cell products. This
                collaboration ensures our clients receive only authentic,
                scientifically backed solutions sourced directly through
                authorized channels.&quot;
              </p>
            </div>

            <p className="font-jakarta text-white/70 text-lg leading-relaxed mb-12 max-w-xl">
              Regenessa stands at the forefront of cellular health, bridging the
              gap between clinical science and natural recovery through our
              strategic alliance with global leaders in biotechnology.
            </p>

            <div className="space-y-8 mb-12">
              {coreValues.map((value, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="shrink-0 w-12 h-12 rounded-sm border border-brand-accent/30 flex items-center justify-center bg-white/5 transition-colors group-hover:bg-brand-accent/10">
                    {value.icon}
                  </div>
                  <div>
                    <div className="font-syne font-bold text-white uppercase text-xs tracking-widest mb-1">
                      {value.title}
                    </div>
                    <p className="font-jakarta text-sm text-white/50 leading-relaxed">
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

            {/* FLOATING AUTHENTICITY BADGE */}
            <div className="absolute -bottom-8 -left-8 bg-brand-accent p-8 rounded-sm shadow-2xl border border-white max-w-55">
              <p className="font-syne font-black text-brand-primary text-lg leading-none mb-3 uppercase">
                Certified Original
              </p>
              <a
                href="https://drive.google.com/drive/folders/1Cak7XZm2doO1P0WWvWkm2nxBiCQukEZB?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-jakarta font-black text-brand-primary bg-white/40 px-3 py-2 rounded-sm text-[8px] uppercase tracking-widest hover:bg-white transition-all group/cta"
              >
                View Certificate
                <ExternalLink
                  size={10}
                  className="group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
