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
  ChevronLeft,
} from "lucide-react";
import api from "@/lib/api";

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeTab, setActiveTab] = useState("video"); // Initialized to Video Stories

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        // Fetch 3 items per page, filtered by 'type' (video or image)
        const { data } = await api.get(
          `/testimonials?page=${currentPage}&limit=3&type=${activeTab}`,
        );
        setItems(data.evidence);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to sync with evidence registry", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [currentPage, activeTab]);

  // Tab Switcher: Resets pagination to Page 1
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-brand-warm pt-12 pb-20 px-6 md:px-24">
      {/* VIDEO PLAYER MODAL */}
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
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40 mb-12">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Home
          </Link>
          <span className="">|</span>
          <span className="text-brand-dark">Visual Registry</span>
        </nav>

        {/* HEADER & TABS */}
        <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div>
            <h1 className="font-syne text-5xl lg:text-8xl font-bold text-brand-dark tracking-tighter leading-[0.9] mb-8">
              Visual <span className="text-brand-accent italic">Evidence.</span>
            </h1>

            <div className="flex gap-4">
              <button
                onClick={() => handleTabChange("video")}
                className={`flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
                  activeTab === "video"
                    ? "bg-brand-primary border-brand-primary text-white shadow-xl scale-105"
                    : "bg-white border-brand-dark/10 text-brand-dark/40 hover:border-brand-primary"
                }`}
              >
                <Video size={14} /> Video Stories
              </button>
              <button
                onClick={() => handleTabChange("image")}
                className={`flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
                  activeTab === "image"
                    ? "bg-brand-primary border-brand-primary text-white shadow-xl scale-105"
                    : "bg-white border-brand-dark/10 text-brand-dark/40 hover:border-brand-primary"
                }`}
              >
                <Camera size={14} /> Image Logs
              </button>
            </div>
          </div>

          <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
            Scanning {activeTab}s • Page {currentPage} of {totalPages}
          </div>
        </header>

        {loading ? (
          <div className="py-40 flex items-center justify-center">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
          </div>
        ) : (
          <>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-brand-dark/5 shadow-sm hover:shadow-2xl transition-all duration-700 group overflow-hidden"
                  >
                    {/* MEDIA CONTAINER */}
                    {item.type === "video" ? (
                      <div
                        className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-black"
                        onClick={() => setActiveVideo(item.mediaUrl)}
                      >
                        <video
                          src={item.mediaUrl}
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

                    {/* DETAILS CONTAINER */}
                    <div className="p-8 bg-white">
                      <h3 className="font-syne font-bold hidden text-xl text-brand-dark uppercase tracking-tighter mb-4 group-hover:text-brand-primary transition-colors">
                        {item.regimenUsed}
                      </h3>
                      <div className="pt-4 border-t border-brand-dark/5">
                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
                          Verified {activeTab} Evidence
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-40 text-center border-t border-brand-dark/5">
                <p className="font-syne text-xl font-bold text-brand-dark/20 uppercase tracking-widest italic">
                  Registry clear for this category.
                </p>
              </div>
            )}

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
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
            )}
          </>
        )}
      </div>
    </main>
  );
}
