"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

// --- LOGIC COMPONENT ---
function VerifyPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("verifying");
  const verificationStarted = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const transactionId = searchParams.get("transaction_id");

      if (!transactionId) {
        setStatus("failed");
        return;
      }

      if (verificationStarted.current) return;
      verificationStarted.current = true;

      try {
        const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));

        if (!pendingOrder) {
          setStatus("success");
          return;
        }

        await api.post("/orders", {
          items: pendingOrder.items,
          totalAmount: pendingOrder.totalAmount,
          shippingDetails: pendingOrder.shippingDetails,
          transactionId,
        });

        clearCart();
        localStorage.removeItem("pendingOrder");
        setStatus("success");
        toast.success("Payment successful! Order placed.");

        setTimeout(() => {
          router.push("/orders");
        }, 3000);
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
        toast.error(err.response?.data?.error || "Order submission failed");
      }
    };

    verifyPayment();
  }, [searchParams, router, clearCart]);

  return (
    <div className="bg-white p-12 rounded-sm border border-brand-dark/10 shadow-2xl text-center max-w-md w-full">
      {status === "verifying" && (
        <>
          <Loader2
            className="animate-spin text-brand-primary mx-auto mb-6"
            size={48}
          />
          <h2 className="font-syne text-2xl font-bold mb-3 uppercase tracking-tighter">
            Verifying Payment...
          </h2>
          <p className="font-jakarta text-sm text-brand-dark/50">
            Securing your order details.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="text-brand-primary mx-auto mb-6" size={48} />
          <h2 className="font-syne text-2xl font-bold mb-3 text-brand-primary uppercase tracking-tighter">
            Order Confirmed
          </h2>
          <p className="font-jakarta text-sm text-brand-dark/50 mb-6">
            Your orders are being processed.
          </p>
        </>
      )}

      {status === "failed" && (
        <>
          <XCircle className="text-red-500 mx-auto mb-6" size={48} />
          <h2 className="font-syne text-2xl font-bold mb-3 text-red-600 uppercase tracking-tighter">
            Verification Failed
          </h2>
          <p className="font-jakarta text-sm text-brand-dark/50 mb-6">
            We could not confirm the transaction. If you were debited, please
            contact support.
          </p>
          <button
            onClick={() => router.push("/checkout")}
            className="w-full py-4 bg-brand-primary text-white font-black text-[10px] uppercase tracking-widest"
          >
            Return to Checkout
          </button>
        </>
      )}
    </div>
  );
}

// --- MAIN WRAPPER PAGE ---
export default function VerifyPayment() {
  return (
    <main className="min-h-screen bg-brand-warm flex items-center justify-center px-6">
      <Suspense
        fallback={
          <div className="bg-white p-12 rounded-sm border border-brand-dark/10 shadow-2xl text-center max-w-md w-full">
            <Loader2
              className="animate-spin text-brand-primary mx-auto mb-6"
              size={48}
            />
            <p className="font-syne text-sm uppercase tracking-widest opacity-40">
              Loading Registry...
            </p>
          </div>
        }
      >
        <VerifyPaymentContent />
      </Suspense>
    </main>
  );
}
