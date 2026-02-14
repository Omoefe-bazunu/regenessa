"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  ShoppingBag,
  Loader2,
  CreditCard,
  MapPin,
  User,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart, getEffectivePrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    if (!user) {
      toast.error("Please login to checkout");
      router.push("/login");
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/products");
    }
  }, [user, cart, router]);

  // ─── Uses effective pricing (set deal aware) ───
  const totalAmount = cart.reduce(
    (sum, item) => sum + getEffectivePrice(item) * item.quantity,
    0,
  );

  const handleInputChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (
      !shippingDetails.fullName ||
      !shippingDetails.email ||
      !shippingDetails.phone ||
      !shippingDetails.address ||
      !shippingDetails.city ||
      !shippingDetails.state
    ) {
      return toast.error("Please fill in all required fields");
    }

    setLoading(true);

    try {
      const { data } = await api.post("/payment/initialize", {
        amount: totalAmount,
        email: shippingDetails.email,
        name: shippingDetails.fullName,
        phone: shippingDetails.phone,
      });

      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          items: cart,
          totalAmount,
          shippingDetails,
          tx_ref: data.tx_ref,
        }),
      );

      window.location.href = data.link;
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment initialization failed");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-5 py-4 bg-white border border-brand-dark/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm";

  return (
    <main className="min-h-screen bg-brand-warm pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <div className="flex items-center gap-3 mb-12">
          <ShoppingBag className="text-brand-primary" size={32} />
          <h1 className="font-syne text-4xl md:text-5xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT: Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white p-8 rounded-2xl border border-brand-dark/5 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <User className="text-brand-primary" size={24} />
                  <h2 className="font-syne text-2xl font-bold">
                    Contact Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingDetails.fullName}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingDetails.email}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingDetails.phone}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="+234 800 000 0000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-8 rounded-2xl border border-brand-dark/5 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-brand-primary" size={24} />
                  <h2 className="font-syne text-2xl font-bold">
                    Shipping Address
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingDetails.address}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingDetails.city}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Lagos"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingDetails.state}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Lagos State"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/50 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingDetails.postalCode}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="100001"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-brand-primary text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-brand-dark transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Proceed to Payment
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white p-8 rounded-2xl border border-brand-dark/5 shadow-sm">
              <h2 className="font-syne text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => {
                  const effectivePrice = getEffectivePrice(item);
                  const isSetDeal =
                    Number(item.setPrice) &&
                    Number(item.setQuantity) &&
                    item.quantity >= Number(item.setQuantity);

                  return (
                    <div
                      key={item.id || item.productId}
                      className="flex items-center gap-4 pb-4 border-b border-brand-dark/5"
                    >
                      <div className="relative w-16 h-16 bg-brand-warm rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.imageUrl || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-brand-dark/50">
                          Qty: {item.quantity}
                        </p>
                        {isSetDeal && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary">
                            Set Deal Applied
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm block">
                          ₦{(effectivePrice * item.quantity).toLocaleString()}
                        </span>
                        {isSetDeal && (
                          <span className="text-xs text-brand-dark/30 line-through">
                            ₦
                            {(
                              Number(item.price) * item.quantity
                            ).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 pt-6 border-t border-brand-dark/10">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-dark/50">Subtotal</span>
                  <span className="font-bold">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-dark/50">Shipping</span>
                  <span className="font-bold text-brand-primary">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-brand-dark/10">
                  <span>Total</span>
                  <span className="text-brand-primary">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-6 bg-brand-accent/10 rounded-xl border border-brand-primary/20">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="text-brand-primary shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-1">
                    Secure Payment
                  </p>
                  <p className="text-xs text-brand-dark/60 leading-relaxed">
                    Your payment is processed securely via Flutterwave. We never
                    store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
