"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Share2,
  ChevronLeft,
  Facebook,
  Twitter,
  Linkedin,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  CalendarDays,
} from "lucide-react";
import api from "@/lib/api";

export default function BlogDetailClient({ id }) {
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [liked, setLiked] = React.useState(false);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/blog/${id}`);
        setPost(data);
      } catch (err) {
        console.error("Failed to load article", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );

  if (!post) return null;

  // Sanitize body HTML saved from Quill editor:
  // - Removes empty <p><br></p> paragraphs Quill inserts as spacers
  // - Replaces all remaining <br> tags (including mid-word line breaks) with a space
  // - Collapses any double spaces left behind
  const cleanBody = post.body
    .replace(/&nbsp;/g, " ") // ← THIS is the real fix — convert &nbsp; to normal spaces
    .replace(/<p><br\s*\/?><\/p>/g, "") // remove Quill empty paragraphs
    .replace(/<br\s*\/?>/g, " ") // replace <br> with space
    .replace(/\s{2,}/g, " ") // collapse double spaces
    .trim();

  return (
    <main
      className="min-h-screen bg-brand-warm pb-12"
      style={{ overflowX: "clip" }}
    >
      {/* 1. STICKY HEADER */}
      <div className="bg-white/80 backdrop-blur-md border-b border-brand-dark/5 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <Link
            href="/blog"
            className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 hover:text-brand-primary flex items-center gap-2 transition-all"
          >
            <ChevronLeft size={16} /> Blogs Feed
          </Link>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-brand-warm text-brand-dark/40 hover:text-brand-primary transition-all"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* 2. ARTICLE */}
      <article
        style={{
          maxWidth: "56rem",
          width: "100%",
          margin: "4rem auto 0",
          padding: "0 1.5rem",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <header className="mb-12 space-y-8">
          <div className="inline-block bg-brand-primary text-white px-4 py-1 rounded-sm font-jakarta text-[10px] font-black uppercase tracking-[0.2em]">
            Health Blog
          </div>

          <h1 className="font-syne text-4xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[0.95] italic">
            {post.title}
          </h1>

          <div className="flex items-center gap-8 pt-4">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-brand-warm">
                <Image
                  src={post.authorImage || "/default-author.jpg"}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-dark font-syne">
                  {post.author}
                </p>
                <p className="text-[9px] text-brand-dark/30 uppercase tracking-widest font-black">
                  Contributor
                </p>
              </div>
            </div>
            <div className="h-10 w-px bg-brand-dark/10" />
            <div className="flex items-center gap-2 text-brand-dark/40 text-[10px] font-black uppercase tracking-widest">
              <CalendarDays size={14} className="text-brand-accent" />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* HERO IMAGE */}
        <div className="relative aspect-video mb-4 overflow-hidden shadow-2xl rounded-sm border border-brand-dark/5 group">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
        </div>
        <p className="text-[9px] text-brand-dark/30 text-right font-black uppercase tracking-widest mb-16 italic">
          Source: {post.imageSource}{" "}
          {post.imageLink && (
            <a href={post.imageLink} className="underline ml-1">
              Ref.
            </a>
          )}
        </p>

        {/* CONTENT BLOCK
            - Styled via .blog-content-area in globals.css
            - cleanBody strips Quill's rogue <br> tags before rendering
        */}
        <div
          className="blog-content-area mb-24"
          dangerouslySetInnerHTML={{ __html: cleanBody }}
        />

        {/* ENGAGEMENT GRID */}
        <div className="grid grid-cols-2 gap-4 p-8 bg-white border border-brand-dark/5 mb-24 shadow-sm">
          <button
            onClick={() => setLiked(true)}
            className="flex items-center justify-center gap-3 bg-brand-warm/50 h-16 font-jakarta text-[10px] font-black uppercase tracking-widest transition-all hover:bg-green-50 hover:text-green-600 border border-transparent hover:border-green-200"
          >
            <ThumbsUp
              size={18}
              className={liked ? "fill-green-500 text-green-500" : ""}
            />{" "}
            Useful ({post.likes || 0})
          </button>
          <button className="flex items-center justify-center gap-3 bg-brand-warm/50 h-16 font-jakarta text-[10px] font-black uppercase tracking-widest transition-all hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200">
            <ThumbsDown size={18} /> Not Helpful
          </button>
        </div>

        {/* SHARE FOOTER */}
        <footer className="border-t border-brand-dark/10 pt-12 text-center">
          <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/20 mb-8">
            Share this Clinical Blog
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleShare}
              className="p-4 bg-white border border-brand-dark/5 hover:bg-brand-primary hover:text-white transition-all"
            >
              <Facebook size={20} />
            </button>
            <button
              onClick={handleShare}
              className="p-4 bg-white border border-brand-dark/5 hover:bg-brand-primary hover:text-white transition-all"
            >
              <Twitter size={20} />
            </button>
            <button
              onClick={handleShare}
              className="p-4 bg-white border border-brand-dark/5 hover:bg-brand-primary hover:text-white transition-all"
            >
              <Linkedin size={20} />
            </button>
          </div>
        </footer>
      </article>
    </main>
  );
}
