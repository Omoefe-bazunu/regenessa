"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/productCard";
import api from "@/lib/api";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Using the api instance with interceptors and base URL
        const response = await api.get("/products");

        // Firestore map in your controller returns a direct array
        console.log("Regenessa API Response:", response.data);

        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.warn("Expected array but received:", typeof response.data);
          setProducts([]);
        }
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="bg-section-offset py-12 px-6 md:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <span className="font-jakarta text-[11px] font-black uppercase tracking-[0.4em] text-brand-accent mb-4 block">
              Regenessa Solutions
            </span>
            <h2 className="font-syne text-3xl md:text-4xl font-bold text-brand-dark mb-6 leading-[1.1]">
              Clinical Formulations for <br /> Cellular Longevity.
            </h2>
          </div>

          <Link
            href="/products"
            className="group flex items-center gap-2 font-jakarta text-[11px] font-black uppercase tracking-widest text-brand-dark hover:text-brand-primary transition-all"
          >
            <span className="border-b-2 border-brand-accent pb-1 group-hover:border-brand-primary transition-colors">
              View Full Catalog
            </span>
          </Link>
        </div>

        {/* LOADING SHIMMER OR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[400px] bg-foreground/5 animate-pulse rounded-sm"
              />
            ))
          ) : error ? (
            <div className="col-span-full py-20 text-center border border-dashed border-red-200 bg-red-50 rounded-sm">
              <p className="font-jakarta text-xs text-red-500 uppercase tracking-widest">
                System Error: {error}
              </p>
            </div>
          ) : products.length > 0 ? (
            products.map((item) => <ProductCard key={item.id} product={item} />)
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-foreground/10">
              <p className="font-jakarta text-sm text-foreground/40 uppercase tracking-widest">
                No clinical formulations found.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
