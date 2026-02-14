"use client";
import { useState, useEffect } from "react";
import {
  Loader2,
  ChevronRight,
  ShoppingBag,
  Plus,
  Info,
  BookOpen,
} from "lucide-react";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addMultipleToCart } = useCart();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await api.get("/packages");
        setPackages(data);
      } catch (err) {
        toast.error("Failed to load clinical packages");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleAddPackage = (pkg) => {
    if (!pkg.products || pkg.products.length === 0) return;

    // Standard Approach: Pass the whole array at once
    addMultipleToCart(pkg.products);

    toast.success(`${pkg.ailmentName} Package added to cart`);
  };
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );

  return (
    <main className="min-h-screen bg-brand-warm pt-12 pb-20 px-6 md:px-24">
      <div className="max-w-7xl mx-auto">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40 mb-12">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <span className="text-brand-dark">Product Packages</span>
        </nav>

        <header className="mb-20">
          <h1 className="font-syne text-5xl lg:text-8xl font-bold text-brand-dark tracking-tighter leading-[0.9]">
            Solution <span className="text-brand-accent italic">Bundles.</span>
          </h1>
          <p className="font-jakarta text-xs text-brand-dark/40 uppercase tracking-widest mt-6 max-w-xl leading-relaxed">
            Curated combinations of products designed to target specific
            challenges.
          </p>
        </header>

        {/* PACKAGE LIST */}
        <div className="space-y-32">
          {packages.map((pkg) => (
            <section key={pkg.id} className="relative">
              {/* SECTION HEADING */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-brand-dark/10 pb-8">
                <div>
                  <h2 className="font-syne text-4xl lg:text-5xl font-bold text-brand-dark tracking-tighter uppercase">
                    {pkg.ailmentName}
                  </h2>
                  <div className="flex items-center gap-3 mt-4 text-[10px] font-black text-brand-primary uppercase tracking-widest">
                    <Info size={14} /> Recommended Products
                  </div>
                </div>

                <button
                  onClick={() => handleAddPackage(pkg)}
                  className="bg-brand-dark text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-primary transition-all flex items-center gap-4 shadow-xl shadow-brand-dark/10"
                >
                  <ShoppingBag size={16} /> Add Full Bundle
                </button>
              </div>
              {/* INSTRUCTIONS BOX */}
              <div className="mb-12 bg-white border-l-4 border-brand-primary p-8 shadow-sm">
                <h5 className="font-syne font-bold text-[10px] uppercase tracking-[0.2em] text-brand-primary mb-3 flex items-center gap-2">
                  <BookOpen size={14} /> Usage INSTRUCTIONS
                </h5>
                <p className="font-jakarta text-sm text-brand-dark/70 leading-relaxed whitespace-pre-wrap">
                  {pkg.instructions}
                </p>
              </div>

              {/* PRODUCTS IN THIS PACKAGE */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pkg.products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-brand-dark/5 p-6 group"
                  >
                    <div className="relative aspect-square mb-6 overflow-hidden bg-brand-warm">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <h4 className="font-syne font-bold text-lg text-brand-dark uppercase tracking-tight">
                      {product.name}
                    </h4>
                    <p className="font-jakarta text-[10px] text-brand-dark/40 mt-1 uppercase tracking-widest">
                      {product.category}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-syne font-bold text-brand-primary">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-[9px] font-black uppercase tracking-widest text-brand-dark/40 hover:text-brand-primary transition-colors flex items-center gap-1"
                      >
                        View Details <Plus size={10} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
