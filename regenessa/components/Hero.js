"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-brand-primary dark:bg-brand-warm py-16 transition-colors duration-500">
      {/* SUBTLE BIOTECH BACKGROUND */}
      <div
        className="absolute inset-0 z-0 opacity-15 mix-blend-overlay grayscale"
        style={{
          backgroundImage: "url('/regenessahero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-brand-primary/60 dark:from-brand-warm/70 via-transparent to-brand-primary/80 dark:to-brand-warm/90" />

      {/* CONTENT AREA */}
      <div className="relative z-20 max-w-6xl px-6 flex flex-col items-center text-center">
        <h1 className="font-syne text-[7.5vw] md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[1.1] md:leading-[0.95] text-white animate-fade-up opacity-0 [animation-delay:200ms]">
          <span className="block whitespace-nowrap text-white">
            Nourish Your Cells.
          </span>
          <span className="text-brand-accent">Elevate Your Life.</span>
        </h1>

        <p className="font-jakarta text-base md:text-xl text-white/80 max-w-2xl mb-8 leading-relaxed animate-fade-up opacity-0 [animation-delay:400ms]">
          Pioneering regenerative wellness through clinical-grade plant stem
          cell technology. Scientifically formulated to support your body&apos;s
          natural healing and vital energy.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-up opacity-0 [animation-delay:600ms]">
          <Link
            href="/products"
            className="group relative flex items-center gap-3 bg-brand-accent text-brand-primary px-10 py-5 rounded-sm font-jakarta font-black text-xs uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-2xl shadow-brand-accent/20"
          >
            Shop Supplements
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <Link
            href="/consultation"
            className="flex items-center gap-3 text-white/90 hover:text-white font-jakarta font-bold text-xs uppercase tracking-widest transition-colors py-4 px-6 border border-white/20 hover:border-white/40 rounded-sm"
          >
            Expert Consultation
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
        <div className="w-px h-10 bg-linear-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
