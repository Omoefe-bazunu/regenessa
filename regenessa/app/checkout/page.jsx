"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  MapPin,
  UploadCloud,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Building,
  Copy,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, cartLoading } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "Lagos",
  });

  const companyBank = {
    bank: "Opay",
    accountName: "Omoefe Bazunu",
    accountNumber: "9043970401",
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cart.length === 0 && !showSuccess) {
      router.push("/products");
    }
  }, [cart, cartLoading, showSuccess, router]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setShipping((prev) => ({
        ...prev,
        fullName: user.fullName || "",
      }));
    }
  }, [user]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const uploadReceipt = async (receiptFile) => {
    const formDataToSend = new FormData();
    formDataToSend.append("image", receiptFile);

    const response = await api.post("/upload/payment-proof", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.imageUrl;
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload your payment receipt");
      return;
    }

    if (
      !shipping.fullName ||
      !shipping.phone ||
      !shipping.address ||
      !shipping.city
    ) {
      toast.error("Please fill in all shipping details");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Payment Proof to Backend (which stores in Firebase)
      const paymentProofUrl = await uploadReceipt(file);

      // 2. Submit Order to Backend
      const payload = {
        items: cart,
        totalAmount: cartTotal,
        shippingDetails: shipping,
        paymentMethod: "Bank Transfer",
        paymentProofUrl: paymentProofUrl,
      };

      const { data } = await api.post("/orders/checkout", payload);

      // 3. Success Flow
      setOrderId(data.orderId);
      setShowSuccess(true);
      clearCart();
    } catch (err) {
      console.error("Order error:", err);
      toast.error(err.response?.data?.error || "Order failed to submit");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || cartLoading) {
    return (
      <main className="min-h-screen bg-brand-warm dark:bg-brand-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </main>
    );
  }

  if (!user || (cart.length === 0 && !showSuccess)) return null;

  return (
    <main className="min-h-screen bg-brand-warm dark:bg-brand-dark pt-32 pb-20">
      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md" />
          <div className="relative bg-white dark:bg-brand-dark w-full max-w-md p-10 rounded-[3rem] text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h2 className="font-heading text-3xl text-brand-dark dark:text-white mb-3">
                Order Received!
              </h2>
              <p className="text-foreground/60 mb-2">
                Order{" "}
                <span className="font-bold text-brand-primary">
                  #{orderId.slice(0, 8)}
                </span>
              </p>
              <p className="text-foreground/60 text-sm">
                Your bulk order has been submitted. Our team will verify your
                payment and contact you shortly via phone to confirm delivery
                logistics.
              </p>
            </div>
            <button
              onClick={() => router.push("/orders")}
              className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-dark transition-all shadow-xl"
            >
              Track Order Status <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-heading text-4xl lg:text-6xl mb-12">
          Finalize <span className="text-brand-primary">Order.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* LEFT: SHIPPING & PAYMENT */}
          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-brand-primary font-bold uppercase tracking-widest text-xs">
                <MapPin size={16} /> Shipping Details
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <input
                    required
                    placeholder="Full Name"
                    className="w-full p-4 bg-white dark:bg-white/5 border border-border rounded-xl text-sm text-brand-dark dark:text-white"
                    value={shipping.fullName}
                    onChange={(e) =>
                      setShipping({ ...shipping, fullName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <input
                    required
                    placeholder="Phone Number"
                    className="w-full p-4 bg-white dark:bg-white/5 border border-border rounded-xl text-sm text-brand-dark dark:text-white"
                    value={shipping.phone}
                    onChange={(e) =>
                      setShipping({ ...shipping, phone: e.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    required
                    placeholder="Detailed Delivery Address"
                    className="w-full p-4 bg-white dark:bg-white/5 border border-border rounded-xl text-sm text-brand-dark dark:text-white"
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping({ ...shipping, address: e.target.value })
                    }
                  />
                </div>
                <input
                  required
                  placeholder="City"
                  className="w-full p-4 bg-white dark:bg-white/5 border border-border rounded-xl text-sm text-brand-dark dark:text-white"
                  value={shipping.city}
                  onChange={(e) =>
                    setShipping({ ...shipping, city: e.target.value })
                  }
                />
                <input
                  required
                  placeholder="State"
                  className="w-full p-4 bg-white dark:bg-white/5 border border-border rounded-xl text-sm text-brand-dark dark:text-white"
                  value={shipping.state}
                  onChange={(e) =>
                    setShipping({ ...shipping, state: e.target.value })
                  }
                />
              </div>
            </section>

            <section className="bg-brand-dark text-white p-8 rounded-[2.5rem] space-y-6 shadow-xl">
              <div className="flex items-center gap-3 text-brand-accent font-bold uppercase tracking-widest text-xs">
                <Building size={16} /> Bank Transfer Details
              </div>
              <div className="space-y-4">
                <p className="text-sm opacity-60">
                  Please transfer exactly{" "}
                  <span className="text-brand-accent font-bold">
                    ₦{cartTotal.toLocaleString()}
                  </span>{" "}
                  to the account below:
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                      <p className="text-[10px] uppercase opacity-40 font-bold">
                        Bank Name
                      </p>
                      <p className="font-bold">{companyBank.bank}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                      <p className="text-[10px] uppercase opacity-40 font-bold">
                        Account Name
                      </p>
                      <p className="font-bold text-sm">
                        {companyBank.accountName}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                      <p className="text-[10px] uppercase opacity-40 font-bold">
                        Account Number
                      </p>
                      <p className="font-bold text-xl text-brand-accent tracking-widest">
                        {companyBank.accountNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(companyBank.accountNumber)}
                      className="p-2 hover:bg-white/10 rounded-lg text-brand-accent transition-all"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: RECEIPT UPLOAD & SUMMARY */}
          <div className="space-y-8 lg:sticky lg:top-32 h-fit">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-brand-primary font-bold uppercase tracking-widest text-xs">
                <UploadCloud size={16} /> Upload Payment Receipt
              </div>
              <div className="relative group border-2 border-dashed border-border rounded-[2.5rem] p-10 flex flex-col items-center justify-center bg-white dark:bg-white/5 hover:border-brand-primary transition-all cursor-pointer overflow-hidden min-h-[250px]">
                {file ? (
                  <div className="text-center">
                    <CheckCircle2
                      size={40}
                      className="text-green-500 mx-auto mb-2"
                    />
                    <p className="text-xs font-bold text-brand-primary uppercase truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-[10px] opacity-40">
                      Click to change file
                    </p>
                  </div>
                ) : (
                  <div className="text-center opacity-40">
                    <UploadCloud size={40} className="mx-auto mb-2" />
                    <p className="text-sm font-bold uppercase">
                      Upload Screenshot
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </section>

            <div className="p-8 bg-brand-warm/50 dark:bg-white/5 rounded-[2.5rem] border border-border">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-40 mb-1">
                    Total Order Value
                  </p>
                  <p className="font-heading text-4xl text-brand-dark dark:text-white">
                    ₦{cartTotal.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-brand-primary">
                    {cart.length} Bulk Items
                  </p>
                </div>
              </div>
              <button
                onClick={handleOrder}
                disabled={loading || !file}
                className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-brand-dark transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <CreditCard size={20} />
                )}
                {loading ? "Processing Order..." : "Confirm & Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
