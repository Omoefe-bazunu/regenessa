"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Image from "next/image"; // Added for product images
import {
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Calendar,
  Loader2,
  Eye,
  Package,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/admin/all");
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/admin/status/${orderId}`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-8">
        {orders.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
            <p className="text-foreground/30 font-bold uppercase tracking-widest">
              No orders to manage
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-brand-dark p-8 rounded-[3rem] border border-border shadow-sm hover:border-brand-primary/20 transition-all"
            >
              <div className="flex flex-col xl:flex-row justify-between gap-10">
                {/* 1. ORDER SUMMARY & CUSTOMER */}
                <div className="space-y-6 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold opacity-30 tracking-tighter">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border ${
                          order.status === "Pending"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : order.status === "Completed"
                              ? "bg-green-50 text-green-600 border-green-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground/40 italic">
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-brand-warm/50 dark:bg-white/5 rounded-2xl border border-border">
                      <p className="text-[10px] font-bold uppercase opacity-40 mb-3 tracking-widest">
                        Customer Details
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm text-brand-dark dark:text-white">
                          <User size={14} className="text-brand-primary" />
                          {order.shippingDetails.fullName}
                        </div>
                        <p className="text-xs opacity-60 ml-6 leading-relaxed">
                          {order.shippingDetails.address},{" "}
                          {order.shippingDetails.city} <br />
                          {order.shippingDetails.phone}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 bg-brand-warm/50 dark:bg-white/5 rounded-2xl border border-border">
                      <p className="text-[10px] font-bold uppercase opacity-40 mb-3 tracking-widest">
                        Financial Summary
                      </p>
                      <h4 className="font-heading text-3xl text-brand-primary">
                        ₦{order.totalAmount.toLocaleString()}
                      </h4>
                      <p className="text-[10px] font-bold opacity-40 mt-1 uppercase">
                        Payment: {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* PRODUCT IMAGE LIST */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">
                      Items to Pack
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-3 bg-white dark:bg-white/5 border border-border rounded-2xl group hover:border-brand-primary/30 transition-all"
                        >
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-border flex-shrink-0">
                            <Image
                              src={item.imageUrl || "/placeholder-food.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs truncate dark:text-white">
                              {item.name}
                            </p>
                            <p className="text-[10px] opacity-60">
                              {item.quantity} {item.unit} @ ₦
                              {item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. ADMIN VERIFICATION PANEL */}
                <div className="xl:w-80 space-y-6">
                  <div className="p-6 bg-brand-dark text-white rounded-[2.5rem] shadow-xl space-y-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-4">
                        Payment Verification
                      </p>
                      {order.paymentProofUrl ? (
                        <a
                          href={order.paymentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-brand-primary transition-all group"
                        >
                          <span className="font-bold text-sm">
                            View Receipt
                          </span>
                          <Eye
                            size={18}
                            className="text-brand-accent group-hover:text-white"
                          />
                        </a>
                      ) : (
                        <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 text-center text-xs font-bold">
                          No Receipt Uploaded
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                        Action Center
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => updateStatus(order.id, "Processing")}
                          className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl hover:bg-blue-600 transition-all gap-1 group"
                          title="Processing"
                        >
                          <Clock size={16} />
                          <span className="text-[8px] font-bold uppercase">
                            Work
                          </span>
                        </button>
                        <button
                          onClick={() => updateStatus(order.id, "Completed")}
                          className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl hover:bg-green-600 transition-all gap-1"
                          title="Complete"
                        >
                          <CheckCircle2 size={16} />
                          <span className="text-[8px] font-bold uppercase">
                            Ship
                          </span>
                        </button>
                        <button
                          onClick={() => updateStatus(order.id, "Rejected")}
                          className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl hover:bg-red-600 transition-all gap-1"
                          title="Reject"
                        >
                          <XCircle size={16} />
                          <span className="text-[8px] font-bold uppercase">
                            Void
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
