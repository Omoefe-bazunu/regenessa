"use client";
import React from "react";
import { BusIcon, ShipIcon, ShipWheelIcon } from "lucide-react";

const DeliveryBar = () => {
  const pillars = [
    {
      icon: BusIcon,
      text: "FREE DELIVERY TO ANY LOCATION WITHIN NIGERIA",
    },
  ];

  return (
    <section className="bg-brand-accent py-10 border-y border-brand-primary/10 overflow-hidden transition-colors duration-500">
      <div className="relative flex items-center">
        {/* INFINITE MARQUEE WRAPPER */}
        <div className="animate-marquee flex items-center">
          {/* We render the set twice for a seamless loop */}
          {[...Array(2)].map((_, setIdx) => (
            <div key={`set-${setIdx}`} className="flex items-center">
              {pillars.map((item, idx) => (
                <div
                  key={`${setIdx}-${idx}`}
                  className="flex items-center gap-6 px-12 flex-shrink-0"
                >
                  <item.icon className="text-brand-primary w-5 h-5 opacity-70" />

                  {/* whitespace-nowrap prevents the text from breaking into multiple lines */}
                  <span className="font-syne text-sm font-bold uppercase tracking-[0.25em] text-brand-primary whitespace-nowrap">
                    {item.text}
                  </span>

                  {/* Aesthetic Separator */}
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/30 ml-4" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliveryBar;
