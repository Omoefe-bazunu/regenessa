"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Package,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "Processing":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-600 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );

  return (
    <main className="min-h-screen bg-brand-warm dark:bg-brand-dark pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="font-heading text-4xl mb-12">
          Order <span className="text-brand-primary">History.</span>
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-brand-dark p-20 rounded-[3.5rem] border-2 border-dashed border-border text-center">
            <ShoppingBag
              className="mx-auto mb-6 text-foreground/20"
              size={64}
            />
            <p className="font-bold text-foreground/40 uppercase tracking-widest">
              No orders raised yet.
            </p>
            <Link
              href="/products"
              className="text-brand-primary font-bold mt-4 inline-block hover:underline"
            >
              Start Shopping &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-brand-dark p-8 rounded-[2.5rem] border border-border shadow-sm group hover:border-brand-primary/30 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-foreground/30">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl">
                      ₦{order.totalAmount.toLocaleString()}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-foreground/40 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />{" "}
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Package size={14} /> {order.items.length} Items
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 bg-brand-warm dark:bg-white/5 rounded-xl text-[10px] font-bold border border-border"
                      >
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="px-3 py-1.5 bg-brand-primary/5 text-brand-primary rounded-xl text-[10px] font-bold">
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
