"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/components/productCard";
import api from "@/lib/api";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConcern, setActiveConcern] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const concerns = [
    "All",
    "Anti-Aging",
    "Vitality",
    "Immunity",
    "Recovery",
    "Cognitive",
  ];

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(
          `/products?page=${currentPage}&limit=${itemsPerPage}`,
        );
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        }
      } catch (err) {
        console.error("Catalog Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Updated Filter Logic: Robust keyword matching for target ailments
  // Updated Filter Logic: Handles both String and Array for targetAilments
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const searchLower = searchQuery.toLowerCase();
      const concernLower = activeConcern.toLowerCase();

      // 1. Basic Search Match
      const matchesSearch =
        p.name.toLowerCase().includes(searchLower) ||
        p.shortDescription?.toLowerCase().includes(searchLower);

      // 2. Advanced Concern Match (Checks Arrays or Strings)
      const matchesConcern =
        activeConcern === "All" ||
        (Array.isArray(p.targetAilments)
          ? // If it's an array, check if any item in the array matches the concern
            p.targetAilments.some((ailment) =>
              ailment.toLowerCase().includes(concernLower),
            )
          : // If it's a string, check normally
            p.targetAilments?.toLowerCase().includes(concernLower)) ||
        p.category?.toLowerCase() === concernLower;

      return matchesSearch && matchesConcern;
    });
  }, [products, searchQuery, activeConcern]);

  return (
    <main className="min-h-screen bg-brand-warm transition-all duration-700">
      {/* HEADER SECTION */}
      <section className="bg-brand-section pt-12 pb-12 px-6 md:px-24 border-b border-brand-dark/5">
        <div className="max-w-7xl mx-auto animate-page-reveal">
          <nav className="flex items-center gap-2 mb-6 font-jakarta text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40">
            <Link href="/" className="transition-colors">
              Home
            </Link>
            <span className="">|</span>
            <span className="text-brand-dark">Products</span>
          </nav>

          <h1 className="font-syne text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter mb-12">
            Products <span className="text-brand-accent">Catalog.</span>
          </h1>

          <div className="flex flex-col gap-8 ">
            {/* SEARCH INPUT */}
            <div className="relative max-w-md w-full group ">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search
                  size={16}
                  className="text-brand-dark/30 group-focus-within:text-brand-dark transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Search concern (e.g., 'Stem Cell')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-warm border border-brand-dark/10 py-4 pl-12 pr-10 rounded-sm font-jakarta text-xs uppercase tracking-widest placeholder:text-brand-dark/20 focus:outline-none focus:border-brand-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-dark/30 hover:text-brand-primary"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* CONCERN FILTER CHIPS */}
            <div className="flex flex-col gap-4">
              <span className="font-jakarta text-[9px] font-black uppercase tracking-[0.3em] text-brand-dark/40">
                Filter by Medical Concern
              </span>
              <div className="flex flex-wrap gap-3">
                {concerns.map((concern) => (
                  <button
                    key={concern}
                    onClick={() => setActiveConcern(concern)}
                    className={`px-6 py-2.5 rounded-sm font-jakarta text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                      activeConcern === concern
                        ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20"
                        : "bg-brand-warm border-brand-dark/10 text-brand-dark/60 hover:border-brand-primary hover:text-brand-primary"
                    }`}
                  >
                    {concern}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS GRID */}
      <section className="py-16 px-6 md:px-24">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[480px] w-full bg-brand-dark/5 animate-pulse rounded-sm"
                />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-start">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="w-full animate-grid-item">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* PAGINATION HIDDEN DURING FILTERING */}
              {!searchQuery && activeConcern === "All" && (
                <div className="mt-24 flex items-center justify-between border-t border-brand-dark/10 pt-10">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="group flex items-center gap-4 font-jakarta text-[11px] font-black uppercase tracking-widest text-brand-dark disabled:opacity-20"
                  >
                    <ChevronLeft
                      size={18}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    Previous
                  </button>
                  <span className="font-syne text-sm font-bold">
                    Page {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={products.length < itemsPerPage}
                    className="group flex items-center gap-4 font-jakarta text-[11px] font-black uppercase tracking-widest text-brand-dark disabled:opacity-20"
                  >
                    Next
                    <ChevronRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-32 text-left border-t border-brand-dark/10">
              <p className="font-syne text-2xl font-bold text-brand-dark/30 italic">
                No clinical matches found for &quot;
                {searchQuery || activeConcern}&quot;.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
