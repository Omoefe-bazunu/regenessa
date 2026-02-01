"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, Plus } from "lucide-react";

const ProductCard = ({ product }) => {
  const displayImage = product.imageUrl || "/placeholder-bottle.png";
  const productId = product.id;

  return (
    <div className="group relative bg-white border border-brand-dark/5 rounded-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/10 hover:-translate-y-1 w-full max-w-sm mx-auto">
      {/* FEATURED BADGE */}
      {product.featured && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-brand-accent text-brand-dark text-[9px] font-black px-4 py-1.5 uppercase tracking-[0.2em] rounded-full shadow-lg">
            Top Rated
          </span>
        </div>
      )}

      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[4/5] bg-[#f1f5f9] overflow-hidden">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />

        {/* PRICE OVERLAY BOX (Bottom Left) */}
        <div className="absolute bottom-0 left-0 z-20 bg-brand-dark px-5 py-3 shadow-xl">
          <span className="text-sm font-syne font-bold text-white tracking-wider">
            ₦{product.price?.toLocaleString()}
          </span>
        </div>

        {/* QUICK ACTION OVERLAY */}
        <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
          <button className="bg-white p-4 rounded-full text-brand-dark hover:bg-brand-accent transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-2xl">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* TEXT CONTENT */}
      <div className="p-8">
        <div className="mb-4">
          <span className="text-[10px] font-jakarta font-black text-brand-primary/50 uppercase tracking-[0.3em] block mb-2">
            {product.category}
          </span>
          <h3 className="font-syne text-xl md:text-2xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
        </div>

        <p className="font-jakarta text-sm text-brand-dark/60 leading-relaxed mb-8 line-clamp-2 min-h-[3rem]">
          {product.shortDescription}
        </p>

        <Link
          href={`/products/${productId}`}
          className="flex items-center justify-center gap-3 w-full py-4 border border-brand-dark/10 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-brand-dark hover:text-white transition-all duration-500 group/btn"
        >
          Explore Science
          <Plus
            size={14}
            className="group-hover/btn:rotate-90 transition-transform duration-300"
          />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
