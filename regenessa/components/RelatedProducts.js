"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import ProductCard from "./productCard";
import { Loader2, PackageSearch } from "lucide-react";

export default function RelatedProducts({ currentCategory, currentProductId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // Fetch all products
        const { data } = await api.get("/products");

        // Filter: Same category, but NOT the current product
        const filtered = data.filter(
          (p) => p.category === currentCategory && p.id !== currentProductId,
        );

        // Limit to top 4 related items
        setProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentCategory) {
      fetchRelated();
    }
  }, [currentCategory, currentProductId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h3 className="font-heading text-3xl text-brand-dark dark:text-white">
            You might also <span className="text-brand-primary">need.</span>
          </h3>
          <p className="text-foreground/40 text-sm mt-2 font-bold uppercase tracking-widest">
            More from {currentCategory}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="animate-fade-in">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
