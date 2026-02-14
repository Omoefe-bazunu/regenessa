"use client";
import { useState, useEffect } from "react";
import { ChevronDown, Plus, Minus, HelpCircle } from "lucide-react";
import api from "@/lib/api";

export default function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.get("/faqs").then((res) => setFaqs(res.data));
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="py-24 bg-[#FDFDFD] px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-3 block">
            Clarification Hub
          </span>
          <h2 className="font-syne text-4xl md:text-5xl font-bold text-brand-dark tracking-tighter uppercase">
            Frequently Asked{" "}
            <span className="text-brand-accent italic">Questions.</span>
          </h2>
        </header>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border border-brand-dark/5 overflow-hidden transition-all duration-500 ${
                  isOpen ? "bg-brand-warm/30 shadow-sm" : "bg-white"
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
                >
                  <h4
                    className={`font-syne font-bold text-sm md:text-base uppercase tracking-tight transition-colors ${
                      isOpen ? "text-brand-primary" : "text-brand-dark"
                    }`}
                  >
                    {faq.question}
                  </h4>
                  <div
                    className={`p-2 rounded-full transition-all ${
                      isOpen
                        ? "bg-brand-primary text-white rotate-180"
                        : "bg-brand-warm text-brand-dark/40 group-hover:text-brand-primary"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 md:p-8 pt-0 border-t border-brand-dark/5">
                    <p className="font-jakarta text-sm leading-relaxed text-brand-dark/60 whitespace-pre-wrap">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
