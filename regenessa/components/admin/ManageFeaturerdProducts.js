"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Star, Loader2, Save, GripVertical } from "lucide-react";
import Image from "next/image";

export default function ManageFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [featuredIds, setFeaturedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, featuredRes] = await Promise.all([
        api.get("/products/list"),
        api.get("/featured-products"),
      ]);

      setProducts(productsRes.data);
      setFeaturedIds(featuredRes.data.map((p) => p.id));
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (productId) => {
    if (featuredIds.includes(productId)) {
      setFeaturedIds(featuredIds.filter((id) => id !== productId));
    } else {
      if (featuredIds.length >= 3) {
        return toast.error("Maximum 3 featured products allowed");
      }
      setFeaturedIds([...featuredIds, productId]);
    }
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newIds = [...featuredIds];
    const [moved] = newIds.splice(fromIndex, 1);
    newIds.splice(toIndex, 0, moved);
    setFeaturedIds(newIds);
  };

  const handleSave = async () => {
    if (featuredIds.length === 0) {
      return toast.error("Select at least 1 product");
    }

    setSaving(true);
    try {
      await api.post("/featured-products", { productIds: featuredIds });
      toast.success("Featured products updated!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const getFeaturedProducts = () => {
    return featuredIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="text-brand-primary" size={32} />
          <h1 className="font-heading text-3xl">Featured Products</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || featuredIds.length === 0}
          className="px-6 py-3 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Featured Order (Drag to Reorder) */}
        <div className="bg-white dark:bg-brand-dark p-8 rounded-2xl border border-border">
          <h2 className="font-bold text-lg mb-6">
            Featured Order ({featuredIds.length}/3)
          </h2>

          {featuredIds.length === 0 ? (
            <div className="text-center py-12 opacity-50">
              <p className="text-sm">Select products from the list →</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getFeaturedProducts().map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 bg-brand-warm dark:bg-white/5 rounded-xl"
                >
                  <div className="flex gap-2">
                    <button
                      onClick={() => index > 0 && handleReorder(index, index - 1)}
                      disabled={index === 0}
                      className="text-brand-dark/50 hover:text-brand-primary disabled:opacity-20"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() =>
                        index < featuredIds.length - 1 &&
                        handleReorder(index, index + 1)
                      }
                      disabled={index === featuredIds.length - 1}
                      className="text-brand-dark/50 hover:text-brand-primary disabled:opacity-20"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-sm">{product.name}</p>
                    <p className="text-xs text-brand-primary">
                      Position {index + 1}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggle(product.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: All Products List */}
        <div className="bg-white dark:bg-brand-dark p-8 rounded-2xl border border-border">
          <h2 className="font-bold text-lg mb-6">All Products</h2>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {products.map((product) => {
              const isFeatured = featuredIds.includes(product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => handleToggle(product.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isFeatured
                      ? "bg-brand-primary/10 border-2 border-brand-primary"
                      : "bg-brand-warm dark:bg-white/5 hover:bg-brand-primary/5"
                  }`}
                >
                  <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm">{product.name}</p>
                  </div>

                  {isFeatured && (
                    <Star className="text-brand-primary fill-brand-primary" size={20} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}