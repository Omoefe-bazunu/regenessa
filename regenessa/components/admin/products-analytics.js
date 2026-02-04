"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Eye,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  Calendar,
} from "lucide-react";

export default function ProductAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/analytics");
      setAnalytics(data);
    } catch (err) {
      toast.error("Failed to load clinical traffic data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-brand-warm/30 rounded-sm border border-brand-dark/5">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
          Syncing Registry Analytics...
        </p>
      </div>
    );
  }

  if (
    !analytics ||
    !analytics.insights ||
    analytics.insights.totalViews === 0
  ) {
    return (
      <div className="py-20 text-center border border-dashed border-brand-dark/10 rounded-sm bg-brand-warm/30">
        <BarChart3 className="mx-auto text-brand-dark/10 mb-4" size={48} />
        <p className="text-brand-dark/30 font-jakarta font-black text-[10px] uppercase tracking-widest">
          No unique visit data logged in the last 24 hours.
        </p>
      </div>
    );
  }

  const { insights, analytics: rawLogs } = analytics;

  return (
    <div className="space-y-8 animate-page-reveal">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-dark/5 pb-8">
        <div>
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-2 block">
            Clinical Traffic Monitor
          </span>
          <h1 className="font-syne text-4xl font-bold text-brand-dark tracking-tighter">
            Product{" "}
            <span className="text-brand-primary italic">Engagement.</span>
          </h1>
        </div>
        <div className="bg-brand-dark text-white p-6 rounded-sm flex items-center gap-6 shadow-xl">
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">
              Unique Impressions
            </p>
            <p className="text-3xl font-bold font-syne leading-none">
              {insights.totalViews?.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-full">
            <TrendingUp size={24} className="text-brand-primary" />
          </div>
        </div>
      </header>

      {/* TOP VIEWED SECTION */}
      <div className="bg-white p-8 rounded-sm border border-brand-dark/5 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="text-brand-primary" size={20} />
          <h3 className="font-syne font-bold text-lg uppercase tracking-tight">
            Most Consulted Regimens
          </h3>
        </div>

        <div className="space-y-2">
          {insights.topViewedProducts.map((product, idx) => (
            <div
              key={idx}
              className="group flex items-center justify-between p-4 hover:bg-brand-warm/50 transition-all border border-transparent hover:border-brand-dark/5"
            >
              <div className="flex items-center gap-6">
                <span className="font-syne font-black text-brand-primary/20 text-2xl group-hover:text-brand-primary transition-colors">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <div>
                  <p className="font-syne font-bold text-sm text-brand-dark uppercase tracking-tight">
                    {product.name}
                  </p>
                  <p className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-widest">
                    Supplements Registry
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-[8px] font-black text-brand-dark/30 uppercase tracking-widest">
                    Unique Visits
                  </p>
                  <p className="font-syne font-bold text-brand-primary text-xl">
                    {product.count}
                  </p>
                </div>
                <div className="w-24 h-1.5 bg-brand-warm rounded-full overflow-hidden hidden md:block">
                  <div
                    className="h-full bg-brand-primary"
                    style={{
                      width: `${(product.count / insights.totalViews) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: RECENT ACTIVITY LOG SECTION */}
      <div className="bg-white p-8 rounded-sm border border-brand-dark/5 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="text-brand-primary" size={20} />
          <h3 className="font-syne font-bold text-lg uppercase tracking-tight">
            Real-Time Traffic Log
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-dark/5 text-[9px] font-black uppercase tracking-widest text-brand-dark/40">
                <th className="pb-4">Product Name</th>
                <th className="pb-4">Registry ID</th>
                <th className="pb-4 text-right">Observation Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/5">
              {rawLogs.slice(0, 15).map((log) => (
                <tr
                  key={log.id}
                  className="group hover:bg-brand-warm/30 transition-colors"
                >
                  <td className="py-4 text-xs font-bold font-syne text-brand-dark uppercase tracking-tight">
                    {log.productName || "Unknown Supplement"}
                  </td>
                  <td className="py-4 text-[9px] font-bold text-brand-dark/30 uppercase tracking-widest">
                    #{log.productId?.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-brand-primary">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        {log.formattedDate}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="pt-6 text-center">
        <p className="text-[8px] font-jakarta italic text-brand-dark/30 uppercase tracking-[0.2em]">
          Registry synchronized: {new Date().toLocaleTimeString()} • Regenessa
          Registry
        </p>
      </footer>
    </div>
  );
}
