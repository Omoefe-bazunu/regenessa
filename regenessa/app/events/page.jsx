"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  X,
  Maximize2,
  Loader2,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

export default function EventsClient() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Gallery Slideshow State
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/events");
        setEvents(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter Logic: Strictly separates regular events from the gallery vault
  const filteredEvents = events.filter((e) => {
    if (activeTab === "ongoing") return e.status === "ongoing";
    if (activeTab === "past") return e.status === "past";
    if (activeTab === "gallery archives")
      return e.gallery && e.gallery.length > 0;
    return false;
  });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );

  return (
    <main className="min-h-screen bg-brand-warm pb-32 overflow-x-hidden">
      {/* HEADER SECTION */}
      <section className="pt-8 pb-12 px-6 md:px-24 bg-brand-section border-b border-brand-dark/5">
        <div className="max-w-7xl mx-auto">
          {/* BREADCRUMB */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40 mb-12">
            <Link
              href="/"
              className="hover:text-brand-primary transition-colors"
            >
              Home
            </Link>
            <span className="">|</span>
            <span className="text-brand-dark">Events</span>
          </nav>
          <h1 className="font-syne text-5xl md:text-8xl font-bold text-brand-dark tracking-tighter uppercase leading-[0.85] mb-12">
            REGENESSA <span className="text-brand-accent italic">Events.</span>
          </h1>

          <div className="flex gap-8 border-b border-brand-dark/10">
            {["ongoing", "past", "gallery archives"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab
                    ? "text-brand-primary"
                    : "text-brand-dark/30 hover:text-brand-dark"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary animate-in fade-in slide-in-from-left-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS GRID */}
      <section className="px-6 md:px-24 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredEvents.map((event) =>
            activeTab === "gallery archives" ? (
              /* 🖼️ GALLERY CARD UI */
              <div
                key={event.id}
                onClick={() => {
                  setSelectedGallery(event.gallery);
                  setCurrentSlide(0);
                }}
                className="group cursor-pointer relative aspect-square bg-brand-dark overflow-hidden shadow-2xl border border-brand-dark/5"
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent">
                  <p className="text-[10px] font-black text-brand-warm uppercase tracking-widest mb-2">
                    {event.date}
                  </p>
                  <p className="text-xl font-bold text-brand-warm font-syne mb-4 leading-tight">
                    {event.title}
                  </p>
                  <div className="flex items-center gap-2 text-brand-accent text-[9px] font-black uppercase tracking-widest">
                    <Layers size={14} /> {event.gallery.length} More Photos
                  </div>
                </div>
              </div>
            ) : (
              /* 🗓️ REGULAR EVENT CARD UI (Ongoing/Past) */
              <article
                key={event.id}
                className="bg-white border border-brand-dark/5 flex flex-col group"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden bg-brand-dark/5 cursor-zoom-in"
                  onClick={() => setFullscreenImage(event.image)}
                >
                  <Image
                    src={event.image || "/placeholder.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <Maximize2 className="text-white" size={24} />
                  </div>
                </div>

                <div className="p-10 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 mb-4 font-jakarta text-[10px] font-black uppercase tracking-widest text-brand-primary">
                    <Calendar size={14} /> {event.date}
                  </div>
                  <h3 className="font-syne text-2xl font-bold text-brand-dark mb-4 leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-sm text-brand-dark/60 font-jakarta leading-relaxed mb-10 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="mt-auto">
                    <a
                      href={event.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-brand-dark text-white py-4 font-black uppercase tracking-widest text-[9px] hover:bg-brand-primary transition-all shadow-lg shadow-brand-dark/5"
                    >
                      {event.ctaText || "View Event"}
                    </a>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      {/* 🛠️ FULLSCREEN MODAL (Single Image) */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[200] bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          onClick={() => setFullscreenImage(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-all">
            <X size={40} />
          </button>
          <div className="relative w-full h-full max-w-6xl">
            <Image
              src={fullscreenImage}
              alt="Fullscreen View"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* 🛠️ GALLERY SLIDESHOW (Multi Image) */}
      {selectedGallery && (
        <div className="fixed inset-0 z-[250] bg-brand-dark flex flex-col items-center justify-center p-6 md:p-12">
          <button
            onClick={() => setSelectedGallery(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-all"
          >
            <X size={40} />
          </button>

          <div className="relative w-full h-full max-w-5xl flex items-center mt-12 justify-center">
            <div className="relative w-full h-full">
              <Image
                src={selectedGallery[currentSlide]}
                alt="Gallery Slide"
                fill
                className="object-contain animate-in fade-in zoom-in-95 duration-500"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(
                  (p) =>
                    (p - 1 + selectedGallery.length) % selectedGallery.length,
                );
              }}
              className="absolute left-0 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((p) => (p + 1) % selectedGallery.length);
              }}
              className="absolute right-0 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          <div className="mt-8 flex gap-2">
            {selectedGallery.map((_, i) => (
              <div
                key={i}
                className={`h-1 transition-all ${
                  i === currentSlide
                    ? "w-12 bg-brand-accent"
                    : "w-4 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
