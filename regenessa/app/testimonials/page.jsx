"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Play,
  Loader2,
  Video,
  Camera,
  Star,
  ChevronLeft,
} from "lucide-react";
import api from "@/lib/api";

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        // Fetch 3 items per page
        const { data } = await api.get(
          `/testimonials?page=${currentPage}&limit=3`,
        );
        setItems(data.evidence);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Evidence registry failed to load", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [currentPage]);

  // Handle Scroll to top on page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-brand-warm pt-12 pb-20 px-6 md:px-24">
      {/* VIDEO MODAL remains unchanged */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/95 backdrop-blur-xl"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-sm shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              controls
              autoPlay
              className="w-full h-full object-contain"
              src={activeVideo}
            />
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 text-white bg-brand-primary px-6 py-3 text-[10px] font-black uppercase tracking-widest"
            >
              Close Asset
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40 mb-12">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Home
          </Link>
          <span className="">|</span>
          <span className="text-brand-dark">Product Testimonials</span>
        </nav>

        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-syne text-5xl lg:text-8xl  font-bold text-brand-dark tracking-tighter leading-[0.9]">
              Visual <span className="text-brand-accent italic">Evidence.</span>
            </h1>
            <p className="font-jakarta text-xs text-brand-dark/40 uppercase tracking-widest mt-6 max-w-xl leading-relaxed">
              Displaying 3 verified outcomes per page for clinical focus.
            </p>
          </div>

          {/* TOP PAGINATION INDICATOR */}
          <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
            Page {currentPage} of {totalPages}
          </div>
        </header>

        {loading ? (
          <div className="py-40 flex items-center justify-center">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-brand-dark/5 shadow-sm hover:shadow-2xl transition-all duration-700 group overflow-hidden"
                >
                  {item.type === "video" ? (
                    <div
                      className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-black"
                      onClick={() => setActiveVideo(item.mediaUrl)}
                    >
                      <video
                        src={item.mediaUrl}
                        preload="metadata"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] opacity-60"
                      />
                      <div className="absolute inset-0 bg-brand-dark/30 flex items-center justify-center">
                        <div className="p-6 bg-brand-primary/90 backdrop-blur-sm rounded-full text-white shadow-2xl scale-90 group-hover:scale-110 transition-all duration-500">
                          <Play size={28} className="fill-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={item.mediaUrl}
                        alt={item.regimenUsed}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                      />
                    </div>
                  )}

                  <div className="p-8 bg-white">
                    <h3 className="font-syne font-bold text-xl text-brand-dark uppercase tracking-tighter mb-4 group-hover:text-brand-primary transition-colors">
                      {item.regimenUsed}
                    </h3>
                    <div className="pt-4 border-t border-brand-dark/5">
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
                        Verified Outcome
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* NAVIGATION CONTROLS */}
            <div className="flex items-center justify-center gap-4 pt-12 border-t border-brand-dark/10">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="flex items-center gap-3 px-8 py-4 bg-white border border-brand-dark/10 text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-brand-dark"
              >
                <ChevronLeft size={14} /> Prev
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 text-[10px] font-black border transition-all ${
                      currentPage === i + 1
                        ? "bg-brand-primary border-brand-primary text-white"
                        : "bg-white border-brand-dark/10 text-brand-dark hover:border-brand-primary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="flex items-center gap-3 px-8 py-4 bg-white border border-brand-dark/10 text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-brand-dark"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
