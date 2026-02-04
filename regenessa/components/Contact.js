"use client";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleContact = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post("/contact/submit", formData);

      if (response.status === 200) {
        setSent(true);
        setFormData({ name: "", phone: "", email: "", message: "" });
        toast.success("Message sent successfully!");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Failed to send inquiry. Please try again.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className=" pb-24 bg-brand-warm  transition-colors duration-500 overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        {/* CENTERED BREADCRUMB */}
        <nav className="flex items-center justify-center gap-2 mb-10 font-jakarta text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40 animate-page-reveal">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Home
          </Link>
          <span className="opacity-50">|</span>
          <span className=" text-brand-dark">Contact</span>
        </nav>

        <div className="flex flex-col items-center text-center mb-16 animate-page-reveal">
          <div className="max-w-3xl">
            <span className="font-jakarta font-black text-[10px] uppercase tracking-[0.4em] mb-4 block text-brand-dark">
              GET IN TOUCH
            </span>
            <h2 className="font-syne text-4xl lg:text-6xl font-bold mb-8 text-brand-dark dark:text-white leading-[1.1]">
              Begin Your Journey to <br />
              <span className="text-brand-accent">Cellular Longevity.</span>
            </h2>
            <p className="font-jakarta text-brand-dark/60 dark:text-white/60 text-lg lg:text-xl mx-auto leading-relaxed max-w-2xl">
              Whether you are an individual seeker or a healthcare practitioner,
              our team is ready to assist with your regenerative effort.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl bg-brand-warm p-8 md:p-14 rounded-sm border border-brand-dark/5 shadow-2xl relative animate-page-reveal [animation-delay:200ms]">
            {sent ? (
              <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-brand-dark" />
                </div>
                <h3 className="font-syne text-2xl font-bold text-brand-dark  mb-2 uppercase tracking-tight">
                  Inquiry Received
                </h3>
                <p className="font-jakarta text-brand-dark/50 dark:text-white/50 text-sm">
                  Our clinical coordinators will review your message and respond
                  within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-8 font-jakarta text-[10px] font-black uppercase tracking-widest text-brand-dark hover:text-brand-dark transition-colors"
                >
                  Submit Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-dark ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-0 py-3 bg-transparent border-b border-brand-dark/10 focus:border-brand-primary outline-none transition-all font-jakarta text-sm placeholder:text-brand-dark/20 dark:text-white"
                      placeholder="e.g. Dr. John Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-dark ml-1">
                      Phone Number{" "}
                      <span className="opacity-30">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-0 py-3 bg-transparent border-b border-brand-dark/10 focus:border-brand-primary outline-none transition-all font-jakarta text-sm placeholder:text-brand-dark/20 dark:text-white"
                      placeholder="+234..."
                    />
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-dark ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-0 py-3 bg-transparent border-b border-brand-dark/10 focus:border-brand-primary outline-none transition-all font-jakarta text-sm placeholder:text-brand-dark/20 dark:text-white"
                    placeholder="clinical@example.com"
                  />
                </div>

                <div className="space-y-3 text-left">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-darl ml-1">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-0 py-3 bg-transparent border-b border-brand-dark/10 focus:border-brand-primary outline-none transition-all font-jakarta text-sm placeholder:text-brand-dark/20 dark:text-white resize-none"
                    placeholder="Describe your health goals or specific product requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-6 bg-brand-dark text-brand-warm font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-70 group"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Submit
                      <Send
                        size={14}
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
