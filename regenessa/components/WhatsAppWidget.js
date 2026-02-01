"use client";
import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
  const phoneNumber = "2348106773690"; // International format for Nigeria
  const message = "Hello Clean Foods, I'm interested in making a bulk order.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-55">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md border border-border px-6 py-3 rounded-full shadow-2xl hover:scale-105 transition-all group"
      >
        <div className="bg-[#25D366] p-1.5 rounded-full text-white">
          <MessageCircle size={20} fill="currentColor" />
        </div>
        <span className="font-bold text-sm text-brand-dark dark:text-white">
          Chat on WhatsApp
        </span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-primary rounded-full animate-ping" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-primary rounded-full" />
      </a>
    </div>
  );
}
