"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  Clock,
} from "lucide-react";
import api from "@/lib/api";

export default function BlogClient() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(
          `/blog?page=${currentPage}&limit=${postsPerPage}`,
        );
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Blog Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  /**
   * 🛠️ FIXED: Decodes HTML entities (like &nbsp;) and strips tags
   * to ensure the excerpt can wrap naturally in the browser.
   */
  const stripHtml = (html) => {
    if (!html) return "";

    // Create a temporary element to let the browser decode entities
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent || "";

    // Clean and truncate
    return text.trim().slice(0, 150) + "...";
  };

  return (
    <main className="min-h-screen bg-brand-warm pb-24">
      {/* HEADER */}
      <section className="bg-brand-section pt-16 pb-12 px-6 md:px-24 border-b border-brand-dark/5">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 mb-8 font-jakarta text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40">
            <Link
              href="/"
              className="hover:text-brand-primary transition-colors"
            >
              Home
            </Link>
            <span>|</span>
            <span className="text-brand-dark">Health Blog</span>
          </nav>

          <h1 className="font-syne text-5xl md:text-8xl font-bold text-brand-dark tracking-tighter leading-[0.85] mb-6">
            Health <span className="text-brand-accent italic">Insights.</span>
          </h1>
          <p className="font-jakarta text-xs text-brand-dark/40 uppercase tracking-widest max-w-lg leading-relaxed">
            Latest updates on regenerative wellness, plant stem cell science,
            and success stories.
          </p>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="px-6 md:px-24 mt-20">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] bg-brand-dark/5 animate-pulse rounded-sm"
                />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {posts.map((post) => (
                  <article key={post.id} className="group cursor-pointer">
                    <Link href={`/blog/${post.slug || post.id}`}>
                      <div className="relative aspect-[16/10] overflow-hidden mb-8 bg-brand-dark/5">
                        <Image
                          src={post.image || "/blog-placeholder.jpg"}
                          alt={post.title}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      </div>

                      <div className="flex items-center gap-4 mb-4 font-jakarta text-[9px] font-black uppercase tracking-widest text-brand-primary">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />{" "}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> 5 Min Read
                        </span>
                      </div>

                      <h2 className="font-syne text-2xl font-bold text-brand-dark group-hover:text-brand-accent transition-colors mb-4 line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="font-jakarta text-sm text-brand-dark/60 leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="inline-flex items-center gap-2 font-jakarta text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark border-b-2 border-brand-primary pb-1 group-hover:gap-4 transition-all">
                        Read Article <ChevronRight size={14} />
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-24 flex items-center justify-between border-t border-brand-dark/10 pt-10">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-3 font-jakarta text-[10px] font-black uppercase tracking-widest text-brand-dark disabled:opacity-20"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span className="font-syne text-sm font-bold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="flex items-center gap-3 font-jakarta text-[10px] font-black uppercase tracking-widest text-brand-dark disabled:opacity-20"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-40 text-center border-t border-brand-dark/5">
              <p className="font-syne text-2xl font-bold text-brand-dark/20 italic">
                No articles published yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
