"use client";
import Image from "next/image";
import { CheckCircle2, Factory, Globe2, Users2 } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Partner Farms", value: "3+", icon: Factory },
    { label: "Active Wholesalers", value: "5+", icon: Users2 },
    { label: "States Covered", value: "36", icon: Globe2 },
  ];

  return (
    <section className="py-24 bg-brand-warm transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Visual Side */}
          <div className="flex-1 relative w-full">
            <div className="relative z-10 rounded-[3rem] overflow-hidden aspect-4/5 lg:aspect-square shadow-2xl">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/lubby-59574.appspot.com/o/cleanfoods%2Fabout.jpeg?alt=media&token=90440462-c8e2-42cf-8b9a-4abdc6106813"
                alt="Quality control at Clean Foods"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 md:-right-6 -right-2 z-20 bg-brand-accent p-8 rounded-4xl shadow-xl animate-slow-pulse">
              <p className="font-heading text-4xl text-brand-dark">100%</p>
              <p className="text-brand-dark/70 text-xs font-bold uppercase tracking-widest">
                Quality
                <br />
                Foods
              </p>
            </div>

            {/* Background Decorative Shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary/5 rounded-full blur-3xl -z-10" />
          </div>

          {/* Text Side */}
          <div className="flex-1">
            <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">
              Our Story
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl mb-8 leading-tight">
              Bridging the gap between{" "}
              <span className="text-brand-primary">Farms</span> and your{" "}
              <span className="text-brand-primary">Store.</span>
            </h2>

            <p className="text-foreground/70 text-lg mb-8 leading-relaxed">
              Founded in Delta State, Clean Foods began with a simple mission:
              to make high-quality Nigerian produce accessible to every
              wholesaler. We don&apos;t just supply food; we manage the entire
              supply chain to ensure that what reaches your warehouse is as
              fresh as the day it was harvested.
            </p>

            {/* Values List */}
            <div className="space-y-4 mb-10">
              {[
                "Direct sourcing from verified local farmers",
                "Strict quality control & stone-free processing",
                "Reliable logistics across all 36 states",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="font-medium text-foreground/80">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-border">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="font-heading text-3xl text-brand-dark mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
