"use client";
import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
  ArrowUp,
  MessageCircle,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Solutions",
      links: [
        { name: "Products", href: "/products" },
        { name: "Packages", href: "/packages" },
        { name: "Testimonials", href: "/teestimonials" },

        { name: "Orders", href: "/orders" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/legal/privacy" },
        { name: "Terms of Service", href: "/legal/terms" },
      ],
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#011f13] border-t border-white/5 pt-20 pb-10 transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* BRAND ARCHITECTURE */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex flex-col mb-8 group">
              <span className="font-heading text-3xl font-bold tracking-[-0.05em] text-white! leading-none uppercase">
                REGENESSA
              </span>
            </Link>
            <p className="font-jakarta text-sm text-white/50 max-w-sm leading-relaxed mb-8">
              Pioneering the future of regenerative health. We specialize in
              clinical-grade plant stem cell technology designed to optimize
              cellular vitality and systemic longevity.
            </p>
            <div className="flex gap-4">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-3 rounded-xl border border-white/10 text-white/60 hover:text-[#fbbf24] hover:border-[#fbbf24] transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* NAVIGATION COLUMNS */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-syne text-[11px] font-black uppercase tracking-[0.25em] !text-white mb-8">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="font-jakarta text-[13px] text-white/40 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-[1px] bg-[#4ade80] mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CONTACT MATRICES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-y border-white/5 mb-12">
          <div className="flex items-start gap-4 group">
            <div className="p-2.5 rounded-lg bg-white/5 text-[#4ade80] mt-1">
              <MapPin size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                Location
              </span>
              <span className="text-[11px] leading-relaxed font-bold text-white uppercase">
                2 ALAKE LAKONKO STREET,
                <br />
                OFF LIASU ROAD, IDIMU
                <br />
                EGBE AREA, LAGOS STATE
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-2.5 rounded-lg bg-white/5 text-[#4ade80]">
              <Mail size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                Inquiries
              </span>
              <a
                href="mailto:support@regenessa.com"
                className="text-xs font-bold text-white hover:text-[#4ade80] transition-colors"
              >
                support@regenessa.com
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-2.5 rounded-lg bg-white/5 text-[#4ade80]">
              <Phone size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                Call
              </span>
              <div className="flex flex-col text-xs font-bold text-white">
                <a
                  href="tel:+2348142081020"
                  className="hover:text-[#4ade80] transition-colors"
                >
                  +234 (0) 8142081020
                </a>
                <a
                  href="tel:+2348029306720"
                  className="hover:text-[#4ade80] transition-colors"
                >
                  +234 (0) 8029306720
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="p-2.5 rounded-lg bg-white/5 text-[#4ade80]">
              <MessageCircle size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                WhatsApp
              </span>
              <a
                href="https://wa.me/2348142081020"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-white hover:text-[#4ade80] transition-colors"
              >
                +234 (0) 8142081020
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM UTILITY */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:items-start items-center">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
              © {currentYear} Regenessa Ltd.
            </p>
            <p className="text-[9px] text-white/10 mt-1 uppercase tracking-widest">
              Natural Science • Bio-Vitality • Longevity
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 group text-white/40 hover:text-white transition-colors"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">
              Back to top
            </span>
            <div className="p-2 rounded-lg border border-white/10 group-hover:border-[#4ade80] transition-colors">
              <ArrowUp size={16} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
