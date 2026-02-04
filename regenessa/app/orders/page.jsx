"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Image from "next/image";
import {
  Package,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  MapPin,
  CreditCard,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(data);
    } catch (err) {
      console.error("Fetch orders failed", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Processing":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Completed":
        return "bg-brand-primary/10 text-brand-primary border-brand-primary/20";
      case "Rejected":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm dark:bg-brand-dark">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );

  return (
    <main className="min-h-screen bg-brand-warm  pt-8 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 animate-page-reveal">
          <nav className="flex items-center justify-center gap-2 mb-12 font-jakarta text-[9px] font-black uppercase tracking-[0.3em] text-brand-dark/40">
            <Link href="/" className="hover:text-brand-dark">
              Home
            </Link>
            <span>|</span>
            <span className="text-brand-dark">Order History</span>
          </nav>
          <h1 className="font-syne text-4xl md:text-6xl font-bold text-center text-brand-dark dark:text-white tracking-tighter">
            Your <span className="text-brand-accent">Orders</span>
          </h1>
        </header>

        {orders.length === 0 ? (
          <div className="bg-brand-warm p-20 rounded-sm border border-dashed border-brand-dark/10 text-center animate-page-reveal">
            <ShoppingBag
              className="mx-auto mb-6 text-brand-dark/10"
              size={64}
            />
            <p className="font-jakarta font-bold text-brand-dark/40 uppercase tracking-widest text-sm">
              No orders raised yet.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-brand-dark text-warm font-black text-[10px] uppercase tracking-widest hover:bg-brand-dark transition-all"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              return (
                <div
                  key={order.id}
                  className={`bg-brand-warm border transition-all duration-500 rounded-sm overflow-hidden ${
                    isExpanded
                      ? "border-brand-primary/30 shadow-2xl"
                      : "border-brand-dark/5 hover:border-brand-primary/20"
                  }`}
                >
                  {/* COMPACT HEADER */}
                  <div
                    onClick={() => toggleOrder(order.id)}
                    className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-6 ">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black opacity-30 tracking-widest uppercase mb-1">
                          REF: {order.id.slice(-8).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-3">
                          <h3 className="font-syne font-bold text-lg text-brand-dark dark:text-white leading-none">
                            ₦{order.totalAmount.toLocaleString()}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${getStatusStyle(
                              order.status,
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="hidden md:flex flex-col items-end">
                        <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">
                          Order Date
                        </span>
                        <span className="text-xs font-bold text-brand-dark/60 dark:text-white/60">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div
                        className={`p-2 rounded-full transition-all duration-300 ${
                          isExpanded
                            ? "bg-brand-primary text-white scale-110"
                            : "bg-brand-dark/5 text-brand-dark/40 group-hover:bg-brand-primary/10"
                        }`}
                      >
                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* EXPANDABLE BODY */}
                  {isExpanded && (
                    <div className="p-8 border-t border-brand-dark/5 bg-[#FDFDFD] dark:bg-brand-dark/20 animate-in slide-in-from-top-4 duration-500">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* LEFT: Shipping Details */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 text-brand-primary">
                            <MapPin size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Shipping Destination
                            </span>
                          </div>
                          <div className="p-5 bg-white dark:bg-white/5 rounded-sm border border-brand-dark/5">
                            <p className="font-syne font-bold text-brand-dark dark:text-white mb-2">
                              {order.shippingDetails.fullName}
                            </p>
                            <p className="font-jakarta text-xs text-brand-dark/50 dark:text-white/50 leading-relaxed">
                              {order.shippingDetails.address},{" "}
                              {order.shippingDetails.city} <br />
                              {order.shippingDetails.state} •{" "}
                              {order.shippingDetails.phone}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-brand-primary pt-2">
                            <CreditCard size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Transaction Info
                            </span>
                          </div>
                          <div className="bg-brand-warm/30 dark:bg-white/5 p-4 rounded-sm border border-brand-dark/5">
                            <p className="text-[8px] font-black opacity-30 uppercase mb-1">
                              Flutterwave Reference
                            </p>
                            <p className="text-[10px] font-bold break-all text-brand-dark/70 dark:text-white/70 tracking-tight">
                              {order.transactionId}
                            </p>
                          </div>
                        </div>

                        {/* RIGHT: Ordered Items */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-brand-primary">
                            <Package size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Order Details
                            </span>
                          </div>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-brand-dark/5 rounded-sm"
                              >
                                <div className="relative h-14 w-14 bg-brand-warm rounded-sm overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.imageUrl || "/placeholder.png"}
                                    alt={item.name}
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-syne font-bold text-xs uppercase tracking-tight text-brand-dark dark:text-white truncate">
                                    {item.name}
                                  </h4>
                                  <p className="font-jakarta text-[10px] text-brand-primary font-black mt-1">
                                    {item.quantity} Unit(s) • ₦
                                    {item.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 pt-6 border-t border-brand-dark/5 text-center">
                        <p className="text-[8px] font-jakarta italic text-brand-dark/30 dark:text-white/20 uppercase tracking-widest">
                          Thank you for choosing Regenessa for your regenerative
                          wellness journey.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
