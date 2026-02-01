"use client";
import { useState } from "react";
import api from "@/lib/api";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    businessName: "",
    name: "",
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
        setFormData({ businessName: "", name: "", email: "", message: "" });
        toast.success("Inquiry sent successfully!");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Failed to send inquiry. Please try again.";
      toast.error(errorMsg);
      console.error("Submission Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-brand-primary dark:bg-brand-warm transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          {/* Centered Header Content */}
          <div className="max-w-3xl">
            <span className="font-bold text-xs uppercase tracking-[0.3em] mb-4 block text-brand-accent">
              Get in Touch
            </span>
            <h2 className="font-heading text-4xl lg:text-6xl mb-8 text-white dark:text-brand-dark">
              Let&apos;s grow your <br />
              <span className="text-white">Business</span> together.
            </h2>
            <p className="text-white/70 dark:text-brand-dark/70 text-lg lg:text-xl mx-auto leading-relaxed">
              Whether you&apos;re a hotel manager, a restaurant owner, or a bulk
              distributor, we have the supply capacity to meet your needs.
            </p>
          </div>
        </div>

        {/* Centered Form Card */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-brand-dark p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative">
            {sent ? (
              <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-brand-primary" />
                </div>
                <h3 className="font-heading text-2xl text-brand-dark dark:text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-foreground/60">
                  Our team will reach out to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-8 text-brand-primary font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary ml-1">
                      Business Name{" "}
                      <span className="opacity-50">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessName: e.target.value,
                        })
                      }
                      className="w-full px-5 py-4 bg-brand-warm dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all dark:text-white"
                      placeholder="e.g. Royal Hotels"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary ml-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-5 py-4 bg-brand-warm dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-5 py-4 bg-brand-warm dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all dark:text-white"
                    placeholder="manager@business.com"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary ml-1">
                    Your Message
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-5 py-4 bg-brand-warm dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all dark:text-white resize-none"
                    placeholder="Tell us about your bulk food requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-70"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Submit Inquiry"
                  )}
                  {!submitting && <Send size={18} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
