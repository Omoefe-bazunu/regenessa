"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Calendar,
  Loader2,
  Package,
  ShieldCheck,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track which card is open

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/admin/all");
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load clinical orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/admin/status/${orderId}`, { status: newStatus });
      toast.success(`Order set to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error("Status synchronization failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );

  return (
    <div className="space-y-4 animate-page-reveal">
      {orders.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-brand-dark/10 rounded-sm bg-brand-warm/30">
          <Package className="mx-auto text-brand-dark/10 mb-4" size={48} />
          <p className="text-brand-dark/30 font-jakarta font-black text-[10px] uppercase tracking-widest">
            No clinical orders pending in the registry.
          </p>
        </div>
      ) : (
        orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          return (
            <div
              key={order.id}
              className={`bg-white dark:bg-brand-dark border transition-all duration-300 rounded-sm overflow-hidden ${
                isExpanded
                  ? "border-brand-primary/30 shadow-xl"
                  : "border-brand-dark/5 hover:bg-brand-warm/30"
              }`}
            >
              {/* --- COMPACT HEADER (Visible always) --- */}
              <div
                onClick={() => toggleOrder(order.id)}
                className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black opacity-30 tracking-widest uppercase">
                      REF: {order.id.slice(-8).toUpperCase()}
                    </span>
                    <h4 className="font-syne font-bold text-sm text-brand-dark dark:text-white uppercase">
                      {order.shippingDetails.fullName}
                    </h4>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${
                      order.status === "Pending"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : order.status === "Completed"
                        ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                        : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">
                      Value
                    </span>
                    <span className="font-syne font-bold text-brand-primary">
                      ₦{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="hidden lg:flex flex-col items-end">
                    <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">
                      Date
                    </span>
                    <span className="text-xs font-medium text-brand-dark/50">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div
                    className={`p-2 rounded-full transition-colors ${
                      isExpanded
                        ? "bg-brand-primary text-white"
                        : "bg-brand-dark/5"
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

              {/* --- EXPANDABLE BODY (Full Details) --- */}
              {isExpanded && (
                <div className="p-8 border-t border-brand-dark/5 bg-[#FDFDFD] dark:bg-brand-dark/20 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col xl:flex-row justify-between gap-10">
                    {/* 1. CONTENT AREA */}
                    <div className="space-y-8 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Destination */}
                        <div className="p-6 bg-white dark:bg-white/5 rounded-sm border border-brand-dark/5 shadow-sm">
                          <p className="text-[9px] font-black uppercase text-brand-primary mb-4 tracking-[0.2em]">
                            Shipping Destination
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 font-syne font-bold text-base text-brand-dark dark:text-white">
                              <User size={14} className="text-brand-primary" />
                              {order.shippingDetails.fullName}
                            </div>
                            <p className="font-jakarta text-xs text-brand-dark/60 dark:text-white/60 leading-relaxed ml-7">
                              {order.shippingDetails.address},{" "}
                              {order.shippingDetails.city} <br />
                              {order.shippingDetails.state} •{" "}
                              {order.shippingDetails.phone}
                            </p>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="p-6 bg-white dark:bg-white/5 rounded-sm border border-brand-dark/5 shadow-sm">
                          <p className="text-[9px] font-black uppercase text-brand-primary mb-4 tracking-[0.2em]">
                            Verification Details
                          </p>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <ShieldCheck
                                size={14}
                                className="text-brand-primary"
                              />
                              <p className="text-xs font-bold text-brand-dark dark:text-white">
                                Gateway:{" "}
                                {order.paymentMethod || "Flutterwave Verified"}
                              </p>
                            </div>
                            <div className="bg-brand-warm/30 p-3 rounded-sm">
                              <p className="text-[8px] font-black opacity-40 uppercase mb-1">
                                Transaction Ref
                              </p>
                              <p className="text-[10px] font-bold break-all opacity-80">
                                {order.transactionId || "Clinical-ID-Pending"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-primary ml-1">
                          Stem Cell Regimen Items
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-brand-dark/5 rounded-sm hover:border-brand-primary/20 transition-all"
                            >
                              <div className="relative h-16 w-16 rounded-sm overflow-hidden border border-brand-dark/5 flex-shrink-0">
                                <Image
                                  src={item.imageUrl || "/placeholder.png"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-syne font-bold text-sm truncate text-brand-dark dark:text-white uppercase tracking-tight">
                                  {item.name}
                                </p>
                                <p className="font-jakarta text-[10px] font-bold text-brand-primary">
                                  QTY: {item.quantity} • ₦
                                  {item.price.toLocaleString()} unit
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 2. SIDEBAR ACTION PANEL */}
                    <div className="xl:w-80">
                      <div className="p-8 bg-brand-dark text-white rounded-sm shadow-2xl h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-8 text-brand-accent">
                            <CreditCard size={16} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                              Workflow Control
                            </p>
                          </div>

                          <div className="space-y-3">
                            <button
                              onClick={() =>
                                updateStatus(order.id, "Processing")
                              }
                              className="w-full flex items-center justify-center gap-3 py-4 bg-white/10 hover:bg-blue-600 transition-all rounded-sm border border-white/5 group"
                            >
                              <Clock
                                size={14}
                                className="group-hover:scale-110 transition-transform"
                              />
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                Processing
                              </span>
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(order.id, "Completed")
                              }
                              className="w-full flex items-center justify-center gap-3 py-4 bg-white/10 hover:bg-brand-primary transition-all rounded-sm border border-white/5 group"
                            >
                              <CheckCircle2
                                size={14}
                                className="group-hover:scale-110 transition-transform"
                              />
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                Completed
                              </span>
                            </button>
                            <button
                              onClick={() => updateStatus(order.id, "Rejected")}
                              className="w-full flex items-center justify-center gap-3 py-4 bg-white/10 hover:bg-red-600 transition-all rounded-sm border border-white/5 group"
                            >
                              <XCircle
                                size={14}
                                className="group-hover:scale-110 transition-transform"
                              />
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                Reject
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="mt-12 pt-6 border-t border-white/10">
                          <p className="text-[8px] font-jakarta italic text-white/30 text-center uppercase tracking-widest">
                            Regenessa Registry
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
