"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await signup(name, email, password);
    setSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] mt-20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-card-bg p-8 rounded-3xl shadow-xl border border-border transition-colors">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl mb-2">Create Account</h1>
          <p className="text-foreground/60 text-sm">
            Join Clean Foods for wholesale prices
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest ml-1 text-brand-primary">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                size={18}
              />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-4 bg-brand-warm border border-border rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest ml-1 text-brand-primary">
              Email
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
                placeholder="john@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest ml-1 text-brand-primary">
              Password
            </label>
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
            className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-lg flex justify-center items-center gap-2 mt-4"
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-foreground/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-primary font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
