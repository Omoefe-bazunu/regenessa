"use client";
import { useState, useEffect } from "react";
import { Star, Quote, Loader2, MessageSquare } from "lucide-react";
import api from "@/lib/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeReviews = async () => {
      try {
        console.log("🔍 Fetching reviews from: /reviews/product/all");
        const { data } = await api.get("/reviews/product/all");

        console.log("✅ Raw data received:", data);
        console.log("📊 Total reviews:", data.length);

        // Filter for high ratings and shuffle to keep the home page fresh
        const featured = data
          .filter((rev) => rev.rating >= 3)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3); // Show top 3

        console.log("⭐ Featured reviews (rating >= 4):", featured);
        console.log("📝 Setting reviews state with:", featured.length, "items");

        setReviews(featured);
      } catch (err) {
        console.error("❌ Failed to fetch testimonials:", err);
        console.error("Error response:", err.response);
      } finally {
        console.log("✔️ Loading complete, setting loading to false");
        setLoading(false);
      }
    };

    fetchHomeReviews();
  }, []);

  console.log("🎨 Render - Loading:", loading, "Reviews:", reviews);

  return (
    <section className="py-24 bg-brand-warm/30 dark:bg-brand-dark transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="text-brand-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">
          Testimonials
        </span>
        <h2 className="font-heading text-4xl lg:text-5xl mb-16 dark:text-white">
          Trusted by <span className="text-brand-primary">Customers</span>{" "}
          <br />
          Across the Nation.
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 opacity-30 flex flex-col items-center">
            <MessageSquare size={48} className="mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">
              Waiting for first customer reviews...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-border relative flex flex-col items-start text-left shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in"
              >
                <Quote className="absolute top-8 right-8 text-brand-primary/10 w-12 h-12" />

                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? "fill-brand-accent text-brand-accent"
                          : "text-gray-200 dark:text-white/10"
                      }
                    />
                  ))}
                </div>

                <p className="text-foreground/80 dark:text-white/70 leading-relaxed mb-8 italic text-sm">
                  &quot;{review.statement}&quot;
                </p>

                <div className="mt-auto flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-sm">
                    {review.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-heading text-lg text-brand-dark dark:text-white leading-none mb-1">
                      {review.fullName}
                    </h4>
                    <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                      Verified Buyer •{" "}
                      {new Date(review.createdAt).toLocaleDateString(
                        undefined,
                        { month: "short", year: "numeric" },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
