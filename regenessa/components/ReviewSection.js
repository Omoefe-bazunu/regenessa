"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Star,
  Trash2,
  Edit3,
  MessageSquare,
  Loader2,
  X,
  Lock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ReviewSection({ productId, userEmail }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ rating: 5, statement: "" });

  // Get user name from storage
  const [userName, setUserName] = useState("Guest User");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUserName(JSON.parse(savedUser).fullName);
    }
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/product/${productId}`);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      toast.error("Please login to leave a review");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        // Matches router.put("/:reviewId")
        await api.put(`/reviews/${editingId}`, form);
        toast.success("Review updated");
        setEditingId(null); // Clear editing state
      } else {
        // Matches router.post("/product/:productId")
        await api.post(`/reviews/product/${productId}`, {
          ...form,
          fullName: userName,
          email: userEmail,
        });
        toast.success("Review posted");
      }

      // Reset form to defaults
      setForm({ rating: 5, statement: "" });

      // Refresh reviews list
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.error || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure?")) return;
    try {
      // This now matches router.delete("/:reviewId")
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error("Delete failed");
    }
  };
  const startEdit = (review) => {
    setEditingId(review.id);
    setForm({ rating: review.rating, statement: review.statement });
    const element = document.getElementById("review-form");
    if (element) {
      window.scrollTo({ top: element.offsetTop - 120, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-brand-primary" />
      </div>
    );

  return (
    <div className=" space-y-12 border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-3xl text-brand-dark dark:text-white">
          Customer Feedback
        </h3>
        <div className="bg-brand-primary/5 px-4 py-2 rounded-full border border-brand-primary/10">
          <p className="text-sm font-bold text-brand-primary">
            {reviews.length} Reviews
          </p>
        </div>
      </div>

      {/* Review Form / Login Guard */}
      <div
        id="review-form"
        className="bg-white dark:bg-brand-dark p-8 rounded-[2.5rem] border border-border shadow-sm"
      >
        {!userEmail ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-brand-warm rounded-full flex items-center justify-center mx-auto text-brand-primary">
              <Lock size={20} />
            </div>
            <p className="text-sm font-bold opacity-60">
              You must be logged in to post a review.
            </p>
            <Link
              href="/login"
              className="text-brand-primary font-bold hover:underline inline-block"
            >
              Login Now &rarr;
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">
                {editingId ? "Edit your review" : "Leave a review"}
              </h4>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ rating: 5, statement: "" });
                  }}
                  className="text-xs font-bold text-red-500 flex items-center gap-1"
                >
                  <X size={14} /> Cancel Edit
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setForm({ ...form, rating: num })}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    size={28}
                    className={
                      num <= form.rating
                        ? "fill-brand-accent text-brand-accent"
                        : "text-border"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              required
              value={form.statement}
              onChange={(e) => setForm({ ...form, statement: e.target.value })}
              placeholder="How was the quality? Mention stones, swell, or delivery speed..."
              className="w-full p-5 bg-brand-warm dark:bg-white/5 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary min-h-[120px]"
            />

            <button
              disabled={submitting}
              className="px-8 py-4 bg-brand-primary text-white rounded-xl font-bold flex items-center gap-3 hover:bg-brand-dark transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <MessageSquare size={20} />
              )}
              {editingId ? "Update Review" : "Post Review"}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-8 bg-brand-warm/30 dark:bg-white/5 rounded-[2rem] border border-border transition-all hover:border-brand-primary/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary">
                  {rev.fullName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-bold text-brand-dark dark:text-white">
                    {rev.fullName}
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < rev.rating
                            ? "fill-brand-accent text-brand-accent"
                            : "text-border"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              {rev.email === userEmail && (
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(rev)}
                    className="p-2 hover:bg-brand-primary/10 rounded-lg transition-colors text-foreground/40 hover:text-brand-primary"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-foreground/40 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-foreground/70 leading-relaxed italic">
              &quot;{rev.statement}&quot;
            </p>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-30 mt-4">
              {new Date(rev.createdAt).toLocaleDateString("en-NG", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
