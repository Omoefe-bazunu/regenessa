"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "./productCard";
import api from "@/lib/api";
import { Dna, Loader2 } from "lucide-react";

const RelatedProducts = ({ currentCategory, currentProductId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // GATEKEEPER: Don't fetch if category is missing or hasn't loaded yet
    if (!currentCategory || currentCategory === "") return;

    const fetchRelated = async () => {
      try {
        setLoading(true);

        // Ensure the category is encoded properly for the URL
        const encodedCategory = encodeURIComponent(currentCategory);
        const { data } = await api.get(`/products?category=${encodedCategory}`);

        if (Array.isArray(data)) {
          const filtered = data
            .filter((p) => p.id !== currentProductId)
            .slice(0, 3);
          setRelated(filtered);
        }
      } catch (err) {
        // This will now catch the error without crashing the UI
        console.error(
          "Related products fetch failed:",
          err.response?.data || err.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentCategory, currentProductId]); // Dependencies

  // Render nothing if there's no data and we aren't loading
  if (!loading && related.length === 0) return null;

  return (
    <section className="mt-12 pt-24 border-t border-brand-dark/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <Dna className="text-brand-primary opacity-50" size={20} />
            <span className="font-jakarta text-[11px] font-black uppercase tracking-[0.4em] text-brand-accent block">
              Synergistic Care
            </span>
          </div>
          <h2 className="font-syne text-3xl md:text-4xl font-bold text-brand-dark leading-[1.1]">
            Complementary <br /> Clinical Regimens.
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-start">
        {loading
          ? [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[400px] w-full bg-brand-dark/5 animate-pulse rounded-sm"
              />
            ))
          : related.map((product) => (
              <div key={product.id} className="w-full animate-grid-item">
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
