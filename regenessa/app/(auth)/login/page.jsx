"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] mt-20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-card-bg p-8 rounded-3xl shadow-xl border border-border transition-colors">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl mb-2">Welcome Back</h1>
          <p className="text-foreground/60 text-sm">
            Log in to manage your bulk orders
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
                className="w-full pl-12 pr-4 py-4 bg-brand-warm border border-border rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-primary">
                Password
              </label>
              <Link
                href="/forgot-password"
                size="sm"
                className="text-xs text-brand-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"} // Dynamic type
                required
                className="w-full pl-12 pr-12 py-4 bg-brand-warm border border-border rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-brand-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
          >
            {submitting ? <Loader2 className="animate-spin" /> : "Sign In"}
            {!submitting && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-foreground/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-brand-primary font-bold hover:underline"
          >
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
}
