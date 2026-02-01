"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await forgotPassword(email);
    setSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] mt-20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-card-bg p-8 rounded-3xl shadow-xl border border-border">
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm text-brand-primary mb-6 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl mb-2">Reset Password</h1>
          <p className="text-foreground/60 text-sm">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest ml-1 text-brand-primary">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                size={18}
              />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 bg-brand-warm border border-border rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all"
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
