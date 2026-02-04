"use client";
import { useState, useEffect } from "react";
import { Star, Quote, Loader2, MessageSquare, CheckCircle } from "lucide-react";
import api from "@/lib/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeReviews = async () => {
      try {
        const { data } = await api.get("/reviews/product/all");
        // Featured filter: 3+ stars, randomized for variety
        const featured = data
          .filter((rev) => rev.rating >= 3)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        setReviews(featured);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeReviews();
  }, []);

  return (
    <section className="py-16 bg-brand-section border-t border-slate-100 transition-colors duration-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-8 animate-page-reveal">
          <span className="text-brand-primary dark:text-brand-accent font-jakarta font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
            Social Proof
          </span>
          <h2 className="font-syne text-4xl lg:text-6xl font-bold text-brand-dark dark:text-white leading-[1.1] tracking-tighter">
            Real Stories of <br />
            <span className="text-brand-accent">Regenerative</span> Success.
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2
              className="animate-spin text-brand-primary dark:text-brand-accent"
              size={40}
            />
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-24 bg-white/50 dark:bg-white/5 border border-dashed border-brand-dark/10 rounded-sm flex flex-col items-center animate-page-reveal">
            <MessageSquare size={48} className="mb-6 text-brand-primary/20" />
            <p className="font-jakarta font-bold uppercase tracking-[0.2em] text-[10px] text-brand-dark/40 dark:text-white/40">
              Loading Testimonials...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-testimonial-stagger">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="group bg-brand-warm p-10 rounded-sm border border-brand-dark/5 dark:border-white/5 relative flex flex-col items-start text-left hover-lift"
              >
                {/* DECORATIVE QUOTE */}
                <Quote className="absolute top-10 right-10 text-brand-primary/5 dark:text-white/5 w-16 h-16 transition-transform group-hover:scale-110" />

                <div className="flex gap-1.5 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < review.rating
                          ? "fill-brand-accent text-brand-accent"
                          : "text-gray-100 dark:text-white/10"
                      }
                    />
                  ))}
                </div>

                <p className="font-jakarta text-brand-dark leading-[1.8] mb-10 text-sm italic relative z-10">
                  &quot;{review.statement}&quot;
                </p>

                <div className="mt-auto flex items-center gap-4 border-t border-brand-dark/5 dark:border-white/5 pt-8 w-full">
                  <div className="w-12 h-12 rounded-full bg-brand-primary/10 dark:bg-brand-accent/10 flex items-center justify-center font-syne font-black text-brand-primary dark:text-brand-accent text-sm border border-brand-primary/5">
                    {review.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-syne font-bold text-base text-brand-dark dark:text-white mb-1">
                      {review.fullName}
                    </h4>
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        size={10}
                        className="text-brand-primary dark:text-brand-accent"
                      />
                      <p className="text-[9px] font-black text-brand-primary dark:text-brand-accent uppercase tracking-widest">
                        Verified Client •{" "}
                        {new Date(review.createdAt).toLocaleDateString(
                          undefined,
                          { month: "short", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM CTA */}
        <div className="mt-20 text-center animate-page-reveal [animation-delay:600ms]">
          <p className="font-jakarta text-xs text-brand-dark/40 dark:text-white/40 mb-2">
            Regenessa: Improving quality of life through plant stem cell therapy
          </p>
        </div>
      </div>
    </section>
  );
}
