"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }
    setSubmitting(true);
    await resetPassword(token, password);
    setSubmitting(false);
  };

  if (!token) {
    return (
      <div className="text-center mt-20 p-8 bg-card-bg rounded-3xl border border-border">
        <h2 className="font-heading text-xl text-red-500">Invalid Link</h2>
        <p className="text-sm text-foreground/60 mt-2">
          This reset link is missing or expired.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-20 max-w-md bg-card-bg p-8 rounded-3xl shadow-xl border border-border">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl mb-2">Set New Password</h1>
        <p className="text-foreground/60 text-sm">
          Ensure your new password is secure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest ml-1 text-brand-primary">
            New Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full pl-12 pr-12 py-4 bg-brand-warm border border-border rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest ml-1 text-brand-primary">
            Confirm Password
          </label>
          <div className="relative">
            <CheckCircle2
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
              size={18}
            />
            <input
              type="password"
              required
              className="w-full pl-12 pr-4 py-4 bg-brand-warm border border-border rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-lg flex justify-center items-center gap-2"
        >
          {submitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}

// Next.js requires Suspense for components using useSearchParams
export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] mt-20 flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={<Loader2 className="animate-spin text-brand-primary" />}
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
