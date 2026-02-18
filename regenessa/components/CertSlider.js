"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/api";

export default function CertSlider() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data } = await api.get("/certifications");

        // Sort by createdAt (Newest First)
        // Swap 'b' and 'a' if you prefer Oldest First
        const sortedCerts = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setCerts(sortedCerts);
      } catch (err) {
        console.error("Failed to load trust assets", err);
      }
    };
    fetchCerts();
  }, []);

  if (certs.length === 0) return null;

  return (
    <section className="bg-brand-warm pt-16 pb-8 border-y border-brand-dark/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-2 block">
          OUR TRUST BADGE
        </span>
        <h3 className="font-syne font-bold text-xl uppercase tracking-tighter text-brand-dark">
          Verified &{" "}
          <span className="text-brand-primary italic">Certified.</span>
        </h3>
      </div>

      <div className="relative w-full overflow-hidden flex items-center h-40 md:h-56">
        <div className="animate-marquee-balanced flex items-center gap-12 md:gap-20 whitespace-nowrap">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="relative w-32 h-32 md:w-44 md:h-44 bg-white rounded-full shadow-sm border border-brand-dark/5 flex items-center justify-center p-8 flex-shrink-0"
            >
              <div className="relative w-full h-full">
                <Image
                  src={cert.url}
                  alt={cert.name || "Certification logo"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 128px, 176px"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
