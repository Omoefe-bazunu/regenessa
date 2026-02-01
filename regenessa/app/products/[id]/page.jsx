"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/api";
import {
  Star,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingCart,
  ChevronRight,
  Loader2,
  X,
  Lock,
  PlayCircle,
  MapPin,
  Info,
} from "lucide-react";
import { toast } from "react-hot-toast";
import ReviewSection from "@/components/ReviewSection";
import RelatedProducts from "@/components/RelatedProducts";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ProductDetails({ params }) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Media State
  const [activeMedia, setActiveMedia] = useState({ type: "image", url: "" });

  const { addToCart } = useCart();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    }
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${productId}`);
      setProduct(data);
      // Initialize media with main image
      setActiveMedia({ type: "image", url: data.imageUrl });
      // Initialize quantity with MOQ
      setQuantity(data.moq || 1);
    } catch (err) {
      toast.error("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (product.stock <= 0) return toast.error("Out of stock");
    if (quantity < (product.moq || 1))
      return toast.error(`Minimum order is ${product.moq}`);

    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-brand-warm dark:bg-brand-dark">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
        <p className="text-sm font-bold uppercase tracking-widest opacity-40">
          Loading Essentials...
        </p>
      </div>
    );
  }

  if (!product) return null;

  // Prepare Gallery (Main + Extra)
  const gallery = [product.imageUrl, ...(product.gallery || [])].filter(
    Boolean,
  );

  return (
    <main className="min-h-screen bg-brand-warm dark:bg-brand-dark pt-32 pb-20 transition-colors duration-500">
      {/* --- LOGIN MODAL (Same as before) --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />
          <div className="relative bg-white dark:bg-brand-dark w-full max-w-md p-10 rounded-[3rem] border border-border shadow-2xl animate-fade-in text-center">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary mb-6">
              <Lock size={28} />
            </div>
            <h3 className="font-heading text-2xl mb-2">
              Authentication Required
            </h3>
            <p className="text-foreground/60 text-sm mb-8">
              Please sign in to place bulk orders.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="w-full py-4 border border-border rounded-2xl font-bold"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-12">
          <Link href="/" className="hover:text-brand-primary">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link href="/products" className="hover:text-brand-primary">
            Catalog
          </Link>
          <ChevronRight size={10} />
          <span className="text-brand-primary truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* LEFT: ENHANCED MEDIA GALLERY */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl border border-border group">
              {activeMedia.type === "video" ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={activeMedia.url || "/placeholder-food.jpg"}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              )}

              <div className="absolute top-8 left-8 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-md px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl text-brand-primary border border-brand-primary/10">
                {product.stock > 0 ? "Available for Supply" : "Restocking Soon"}
              </div>
            </div>

            {/* Thumbnails Swiper */}
            <div className="flex flex-wrap gap-4">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMedia({ type: "image", url: img })}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeMedia.url === img ? "border-brand-primary scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <Image
                    src={img}
                    alt="thumbnail"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
              {product.videoUrl && (
                <button
                  onClick={() =>
                    setActiveMedia({ type: "video", url: product.videoUrl })
                  }
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex items-center justify-center bg-brand-dark transition-all ${activeMedia.type === "video" ? "border-brand-primary scale-110" : "border-transparent opacity-60"}`}
                >
                  <PlayCircle className="text-white" size={32} />
                  <p className="absolute bottom-1 text-[8px] font-bold text-white uppercase">
                    Video
                  </p>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: INFO PANEL */}
          <div className="lg:sticky lg:top-32">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-brand-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-brand-accent text-brand-accent" />
                <span className="text-sm font-bold">
                  {product.avgRating || 0}
                </span>
                <span className="text-sm text-foreground/40 font-bold uppercase tracking-widest text-[10px]">
                  ({product.reviewCount || 0} Verified Reviews)
                </span>
              </div>
            </div>

            <h1 className="font-heading text-5xl lg:text-7xl text-brand-dark dark:text-white mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-10">
              <div className="bg-brand-primary/5 px-6 py-4 rounded-[2rem] border border-brand-primary/10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">
                  Wholesale Rate
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-5xl text-brand-primary">
                    ₦{product.price?.toLocaleString()}
                  </span>
                  <span className="text-sm text-foreground/40 font-bold lowercase">
                    / {product.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* LOGISTICS & MOQ INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-4 p-5 bg-white dark:bg-white/5 rounded-3xl border border-border">
                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-2xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                    Supply Area
                  </p>
                  <p className="text-sm font-bold truncate max-w-[150px]">
                    {product.locations || "Nationwide"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-white dark:bg-white/5 rounded-3xl border border-border">
                <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-2xl">
                  <Info size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                    Min. Order
                  </p>
                  <p className="text-sm font-bold">
                    {product.moq || 1} {product.unit}s
                  </p>
                </div>
              </div>
            </div>

            {/* QUANTITY & CART */}
            <div className="space-y-6 bg-brand-dark/5 dark:bg-white/5 p-8 rounded-[2.5rem] border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                    Adjust Quantity
                  </p>
                  <div className="flex items-center bg-white dark:bg-brand-dark border border-border rounded-2xl p-1.5 w-fit">
                    <button
                      onClick={() =>
                        setQuantity(Math.max(product.moq || 1, quantity - 1))
                      }
                      className="p-3 hover:bg-brand-warm rounded-xl transition-all"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-14 text-center font-bold text-xl">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-brand-warm rounded-xl transition-all"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">
                    Subtotal Price
                  </p>
                  <p className="text-brand-primary text-4xl font-heading">
                    ₦{(product.price * quantity).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full py-6 bg-brand-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl shadow-brand-primary/30 hover:bg-brand-dark hover:-translate-y-1 transition-all disabled:opacity-50 disabled:grayscale"
              >
                <ShoppingCart size={22} />
                Add to Bulk Order
              </button>
            </div>
          </div>
        </div>

        {/* --- TABS SECTION --- */}
        <div className="mt-32">
          <div className="flex gap-12 border-b border-border mb-10">
            {["description", "logistics"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`pb-6 text-xs font-black uppercase tracking-[0.3em] relative transition-all ${activeTab === t ? "text-brand-primary" : "text-foreground/30"}`}
              >
                {t}
                {activeTab === t && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            {activeTab === "description" ? (
              <div className="prose prose-lg dark:prose-invert max-w-4xl opacity-80 leading-relaxed font-medium">
                {product.description ||
                  "Premium wholesale grade produce supplied with strict quality control."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-border">
                {[
                  {
                    label: "Minimum Order",
                    value: `${product.moq || 1} ${product.unit}s`,
                  },
                  {
                    label: "Supply Areas",
                    value: product.locations || "Nationwide",
                  },
                  {
                    label: "Storage Life",
                    value: "Standard shelf life for produce",
                  },
                  {
                    label: "Packaging",
                    value: `Bulk ${product.unit} containers`,
                  },
                ].map((spec, i) => (
                  <div
                    key={i}
                    className="flex flex-col border-b border-border/50 pb-4"
                  >
                    <span className="text-[10px] font-black uppercase opacity-30 tracking-widest mb-1">
                      {spec.label}
                    </span>
                    <span className="font-bold text-brand-dark dark:text-white">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Components */}
        <div className="mt-32 pt-32 border-t border-border">
          <ReviewSection productId={productId} userEmail={user?.email} />
        </div>

        <RelatedProducts
          currentCategory={product.category}
          currentProductId={productId}
        />
      </div>
    </main>
  );
}
