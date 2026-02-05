"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import api from "@/lib/api";
import {
  Star,
  Activity,
  Minus,
  Plus,
  ShoppingCart,
  ChevronRight,
  Loader2,
  Lock,
  Dna,
  CheckCircle2,
  Play,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import RelatedProducts from "@/components/RelatedProducts";
import ReviewSection from "@/components/ReviewSection";

export default function ProductDetails({ params }) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  //DATA FETCHING EFFECT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${productId}`);
        setProduct(data);
        setSelectedImage(data.imageUrl);
      } catch (err) {
        // This only fires if the actual API call fails
        toast.error("Product data could not be retrieved");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (product.stockCount <= 0) return toast.error("Out of stock");
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-brand-warm transition-colors duration-500">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
          Loading Data...
        </p>
      </div>
    );
  }

  if (!product) return null;

  // Combine all images for gallery
  const allImages = [product.imageUrl, ...(product.gallery || [])].filter(
    Boolean,
  );

  return (
    <main className="min-h-screen bg-brand-warm pt-12 pb-20 transition-all">
      {/* --- LOGIN MODAL --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-6 backdrop-blur-md bg-brand-dark/40">
          <div className="bg-white p-10 rounded-sm border border-brand-dark/10 shadow-2xl text-center max-w-sm w-full animate-page-reveal">
            <Lock className="mx-auto mb-6 text-brand-primary" size={32} />
            <h3 className="font-syne text-xl font-bold mb-4 uppercase tracking-tight">
              Login Required
            </h3>
            <p className="font-jakarta text-xs text-brand-dark/50 mb-8 leading-relaxed">
              Please sign in to your Regenessa account to purchase suplements
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="py-4 bg-brand-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand-dark transition-all"
              >
                Login
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-[10px] font-black uppercase tracking-widest py-4 border border-brand-dark/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- VIDEO MODAL --- */}
      {showVideo && product.videoUrl && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center px-6 backdrop-blur-md bg-brand-dark/80"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <video
              controls
              autoPlay
              className="w-full h-full"
              src={product.videoUrl}
            >
              Your browser does not support the video tag.
            </video>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 text-white bg-brand-dark/50 hover:bg-brand-dark px-4 py-2 text-xs font-bold uppercase tracking-widest"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40 mb-12 animate-page-reveal">
          <Link href="/" className="hover:text-brand-primary">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link href="/products" className="hover:text-brand-primary">
            Catalog
          </Link>
          <ChevronRight size={10} />
          <span className="text-brand-dark truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* LEFT: IMAGE AREA */}
          <div className="animate-page-reveal space-y-4">
            {/* Main Image Display */}
            <div className="relative aspect-square bg-white border border-brand-dark/5 shadow-2xl overflow-hidden group">
              <Image
                src={
                  selectedImage || product.imageUrl || "/placeholder-bottle.png"
                }
                alt={product.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute top-8 left-8 bg-brand-primary text-white px-5 py-2 text-[10px] font-black uppercase tracking-widest">
                {product.status || "Clinical Grade"}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square bg-white border-2 overflow-hidden transition-all ${
                    selectedImage === img
                      ? "border-brand-primary"
                      : "border-brand-dark/10 hover:border-brand-primary/50"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`View ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}

              {/* Video Thumbnail */}
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="relative aspect-square bg-brand-dark border-2 border-brand-dark/10 hover:border-brand-primary/50 overflow-hidden transition-all flex items-center justify-center group"
                >
                  <Play
                    className="text-white group-hover:scale-110 transition-transform"
                    size={28}
                  />
                  <span className="absolute bottom-2 text-[8px] font-black uppercase tracking-widest text-white">
                    Video
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: CONTENT AREA */}
          <div className="lg:sticky lg:top-32 animate-page-reveal [animation-delay:200ms]">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-brand-accent/20 text-brand-primary px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-brand-primary/10">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-brand-primary text-brand-dark" />
                <span className="text-sm font-bold text-brand-dark">
                  {product.avgRating || "5.0"}
                </span>
              </div>
            </div>

            <h1 className="font-syne text-5xl lg:text-7xl font-bold text-brand-dark mb-4 leading-[0.9] tracking-tighter">
              {product.name}
            </h1>

            <p className="font-jakarta text-base text-brand-dark/50 mb-10 leading-relaxed max-w-lg">
              {product.shortDescription}
            </p>

            <div className="bg-warm border border-brand-dark/5 p-8 mb-10 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mb-2">
                  Price per unit
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="font-syne text-5xl font-bold text-brand-dark">
                    ₦{product.price?.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-brand-dark/30 uppercase tracking-widest">
                    NGN
                  </span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 text-brand-dark">
                <Dna size={120} />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between p-4 bg-brand-dark/5 border border-brand-dark/5 w-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">
                  Quantity
                </span>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="hover:text-brand-primary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-syne font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="hover:text-brand-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-6 bg-brand-dark text-brand-warm font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-brand-dark transition-all duration-500 shadow-xl shadow-brand-primary/20"
              >
                <ShoppingCart size={20} />
                Add to cart
              </button>
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <div className="mt-32 border-t border-brand-dark/10 pt-16">
          <div className="flex gap-12 mb-16 overflow-x-auto no-scrollbar">
            {["overview", "benefits", "clinical focus"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-brand-primary text-brand-dark"
                    : "border-transparent text-brand-dark/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="animate-page-reveal">
            {activeTab === "overview" && (
              <div className="max-w-4xl">
                <p className="font-jakarta text-lg md:text-xl text-brand-dark/70 leading-[1.8]">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "benefits" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.benefits?.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-5 p-8 bg-brand-warm border border-brand-dark/5"
                  >
                    <div className="p-3 bg-brand-dark text-brand-warm shrink-0">
                      <CheckCircle2 size={24} />
                    </div>
                    <p className="font-syne text-lg font-bold text-brand-dark">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "clinical focus" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.targetAilments?.map((ailment, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 p-8 bg-brand-dark text-warm text-center"
                  >
                    <Activity
                      size={24}
                      className="mx-auto text-brand-warm opacity-50"
                    />
                    <span className="font-jakarta text-brand-warm text-[10px] font-black uppercase tracking-widest">
                      {ailment}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- REVIEWS SECTION --- */}
        <div className="mt-12 pt-12 border-t border-brand-dark/10">
          <ReviewSection productId={productId} />
        </div>

        {/* --- RELATED PRODUCTS --- */}
        <RelatedProducts
          currentCategory={product.category}
          currentProductId={product.id}
        />
      </div>
    </main>
  );
}
