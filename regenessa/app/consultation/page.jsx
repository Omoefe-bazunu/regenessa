"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Send,
  Loader2,
  CheckCircle,
  Phone,
  MessageCircle,
  Microscope,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ConsultationPage() {
  const [availableDates, setAvailableDates] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Required by backend
    phone: "",
    concern: "",
    scheduledDate: "",
  });
  const [status, setStatus] = useState("idle");

  const contactNumber = "08029306720";
  const whatsappLink = `https://wa.me/234${contactNumber.substring(1)}`;

  // Helper to convert 24h time in labels to AM/PM
  const formatTimeToAMPM = (label) => {
    return label.replace(/\((\d{2}):(\d{2})\)/, (match, hh, mm) => {
      let hour = parseInt(hh);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `(${hour}:${mm} ${ampm})`;
    });
  };

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const { data } = await api.get("/consultations/available-dates");
        // Format labels to AM/PM before setting state
        const formatted = data.map((date) => ({
          ...date,
          label: formatTimeToAMPM(date.label),
        }));
        setAvailableDates(formatted);
      } catch (err) {
        console.error("Failed to load dates");
      }
    };
    fetchAvailableDates();
  }, []);

  const handleConsultation = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      // Ensure email is included in the payload
      await api.post("/consultations/request", formData);
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        concern: "",
        scheduledDate: "",
      });
    } catch (err) {
      setStatus("error");
      const errorMsg =
        err.response?.data?.error || "Submission failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <main className="pt-12 pb-20 bg-brand-warm min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        {/* CENTERED BREADCRUMB */}
        <nav className="flex items-center justify-center gap-2 mb-12 font-jakarta text-[9px] font-black uppercase tracking-[0.3em] text-brand-dark/40">
          <Link href="/" className="hover:text-brand-dark">
            Home
          </Link>
          <span>|</span>
          <span className="text-brand-dark">Clinical Consultation</span>
        </nav>

        {/* PAGE HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-page-reveal">
          <div className="flex justify-center mb-6 text-brand-dark opacity-20">
            <Microscope size={48} />
          </div>
          <h1 className="font-syne text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6 leading-tight">
            Schedule a{" "}
            <span className="text-brand-accent italic">Session.</span>
          </h1>
          <p className="font-jakarta text-brand-dark/50 dark:text-white/50 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Consult with our specialists to develop a targeted plant stem cell
            regimen designed for your specific cellular recovery and longevity
            goals.
          </p>
        </div>

        {/* BOOKING CARD */}
        <div className="max-w-xl mx-auto">
          <div className="bg-brand-warm p-8 md:p-12 rounded-sm border border-brand-dark/5 shadow-2xl animate-page-reveal [animation-delay:200ms]">
            <h2 className="font-syne text-2xl font-bold text-brand-dark dark:text-white mb-8 text-center tracking-tight">
              Provide <span className="text-brand-dark">Basic Details</span>
            </h2>

            <form onSubmit={handleConsultation} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-brand-dark tracking-widest">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-brand-dark/10 py-2 outline-none focus:border-brand-dark text-sm font-jakarta dark:text-white"
                />
              </div>

              {/* Added Email Field for logic to work with Controller */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-brand-dark tracking-widest">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-brand-dark/10 py-2 outline-none focus:border-brand-dark text-sm font-jakarta dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-brand-dark tracking-widest">
                    WhatsApp / Phone
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-brand-dark/10 py-2 outline-none focus:border-brand-primary text-sm font-jakarta dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-brand-dark tracking-widest">
                    Available Slot
                  </label>
                  <select
                    required
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduledDate: e.target.value,
                      })
                    }
                    className="w-full bg-transparent border-b border-brand-dark/10 py-2 outline-none focus:border-brand-primary text-sm font-jakarta dark:text-white"
                  >
                    <option value="">Choose a date</option>
                    {availableDates.map((date, idx) => (
                      <option key={idx} value={date.value}>
                        {date.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-brand-dark tracking-widest">
                  Current Health Concern
                </label>
                <textarea
                  required
                  rows="2"
                  value={formData.concern}
                  onChange={(e) =>
                    setFormData({ ...formData, concern: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-brand-dark/10 py-2 outline-none focus:border-brand-primary text-sm font-jakarta resize-none dark:text-white"
                  placeholder="e.g. Chronic Fatigue, Joint Pain, etc."
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-5 bg-brand-dark text-brand-warm font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-dark transition-all disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Submit"
                )}
              </button>
            </form>

            {/* DIRECT CONTACT DIVIDER */}
            <div className="mt-12 pt-8 border-t border-brand-dark/5 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-dark/30 mb-6">
                Or Reach Out Directly
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href={`tel:${contactNumber}`}
                  className="flex items-center gap-3 text-brand-dark dark:text-white/70 hover:text-brand-primary transition-colors group"
                >
                  <div className="p-2 rounded-full bg-brand-dark/5 group-hover:bg-brand-primary/10">
                    <Phone size={16} />
                  </div>
                  <span className="font-jakarta text-sm font-bold">
                    {contactNumber}
                  </span>
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-brand-dark dark:text-white/70 hover:text-green-600 transition-colors group"
                >
                  <div className="p-2 rounded-full bg-brand-dark/5 group-hover:bg-green-50">
                    <MessageCircle size={16} />
                  </div>
                  <span className="font-jakarta text-sm font-bold">
                    WhatsApp Chat
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {status === "success" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/40 backdrop-blur-sm p-4">
          <div className="bg-white p-10 rounded-sm text-center max-w-sm w-full shadow-2xl">
            <CheckCircle
              className="mx-auto text-brand-primary mb-4"
              size={48}
            />
            <h3 className="font-syne text-xl font-bold mb-2 uppercase">
              Request Sent
            </h3>
            <p className="font-jakarta text-xs text-brand-dark/50 mb-6 leading-relaxed">
              Your request has been submitted. Our lead therapist will contact
              you shortly to confirm your slot.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="w-full py-4 bg-brand-primary text-white font-black text-[9px] uppercase tracking-widest"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
