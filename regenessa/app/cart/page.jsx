"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Lock,
  Loader2,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartLoading } =
    useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <main className="min-h-screen bg-brand-warm dark:bg-brand-dark flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
        <p className="text-sm font-bold uppercase tracking-widest opacity-40">
          Loading...
        </p>
      </main>
    );
  }

  // Don't render anything if not logged in (will redirect)
  if (!user) {
    return null;
  }

  if (cart.length === 0 && !cartLoading) {
    return (
      <main className="min-h-screen bg-brand-warm dark:bg-brand-dark pt-40 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
          <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary">
            <ShoppingBag size={48} />
          </div>
          <h1 className="font-heading text-4xl">Your cart is empty</h1>
          <p className="text-foreground/60">
            Looks like you haven&apos;t added any bulk essentials yet.
          </p>
          <Link
            href="/products"
            className="inline-block px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-xl"
          >
            Browse Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-warm pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <Link
            href="/products"
            className="p-3 bg-white dark:bg-white/5 rounded-full border border-border hover:bg-brand-primary hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-heading text-4xl lg:text-5xl">
            Review <span className="text-brand-primary">Order.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                // FIX: Use item.id as the unique key.
                // Using index as a fallback ensures the console error disappears.
                key={item.id || item.productId}
                className="bg-brand-warm p-6 rounded-[2.5rem] border border-border flex flex-col sm:flex-row items-center gap-6 group"
              >
                <div className="relative h-32 w-32 rounded-3xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl || "/placeholder-food.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-xl mb-1">{item.name}</h3>
                  <p className="text-brand-primary font-bold mb-4">
                    ₦{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-brand-warm dark:bg-white/5 rounded-xl p-1 border border-border">
                      <button
                        onClick={() =>
                          // FIX: Use item.id
                          updateQuantity(
                            item.id || item.productId,
                            item.quantity - 1,
                          )
                        }
                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          // FIX: Use item.id
                          updateQuantity(
                            item.id || item.productId,
                            item.quantity + 1,
                          )
                        }
                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      // FIX: Use item.id
                      onClick={() => removeFromCart(item.id || item.productId)}
                      className="text-red-500 p-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-30 mb-1">
                    Subtotal
                  </p>
                  <p className="font-heading text-2xl">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <aside className="bg-brand-warm p-10 rounded-[3rem] shadow-2xl sticky top-32 border border-border">
            <h3 className="font-heading text-2xl mb-8 text-brand-dark dark:text-white">
              Summary
            </h3>
            <div className="space-y-4 border-b border-border dark:border-white/10 pb-8 mb-8">
              <div className="flex justify-between">
                <span className="text-foreground/60 dark:text-white/60">
                  Items Total
                </span>
                <span className="font-bold text-brand-dark dark:text-white">
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60 dark:text-white/60">
                  Estimated Delivery
                </span>
                <span className="text-brand-primary dark:text-brand-accent font-bold text-sm">
                  Communicated on Delivery
                </span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-10">
              <span className="text-sm text-foreground/60 dark:text-white/60 uppercase font-bold tracking-widest">
                Grand Total
              </span>
              <span className="text-4xl font-heading text-brand-primary dark:text-brand-accent">
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>
            <Link
              href="/checkout"
              className="w-full py-5 bg-brand-dark text-brand-warm rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-brand-primary/20"
            >
              <CreditCard size={20} />
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
