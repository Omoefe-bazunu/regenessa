"use client";
import React, { useState, useEffect } from "react";
import { Star, Trash2, Edit3, MessageSquare, Send, X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [form, setForm] = useState({ rating: 5, statement: "" });

  useEffect(() => {
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
    if (!user) return toast.error("Please login to review");

    try {
      if (editingId) {
        await api.put(`/reviews/${editingId}`, form);
        toast.success("Review updated");
      } else {
        await api.post(`/reviews/product/${productId}`, {
          ...form,
          fullName: user.fullName || user.name,
          email: user.email,
        });
        toast.success("Review submitted");
      }
      setForm({ rating: 5, statement: "" });
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Review removed");
      fetchReviews();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="animate-page-reveal">
      <div className="flex items-center gap-4 mb-12">
        <MessageSquare className="text-brand-primary" size={24} />
        <h2 className="font-syne text-3xl font-bold text-brand-dark">
          Product Reviews<span className="text-brand-accent">.</span>
        </h2>
      </div>

      {/* REVIEW FORM */}
      {user && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white border border-brand-dark/5 p-8 shadow-sm"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 mb-4">
            {editingId
              ? "Modify your feedback"
              : "Share your clinical experience"}
          </p>

          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
              >
                <Star
                  size={20}
                  className={
                    star <= form.rating
                      ? "fill-brand-primary text-brand-primary"
                      : "text-brand-dark/10"
                  }
                />
              </button>
            ))}
          </div>

          <textarea
            value={form.statement}
            onChange={(e) => setForm({ ...form, statement: e.target.value })}
            placeholder="Describe the cellular changes or vitality improvements you noticed..."
            className="w-full bg-brand-warm/50 border border-brand-dark/10 p-4 font-jakarta text-sm focus:outline-none focus:border-brand-primary min-h-[120px] mb-4"
            required
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-brand-primary text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand-dark transition-all"
            >
              {editingId ? "Update Review" : "Post Review"} <Send size={14} />
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ rating: 5, statement: "" });
                }}
                className="text-[10px] font-black uppercase tracking-widest px-8 py-3 border border-brand-dark/10"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* REVIEWS LIST */}
      <div className="space-y-8">
        {loading ? (
          <p className="animate-pulse">Loading Reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="group border-l-2 border-brand-primary/10 pl-8 py-2 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="fill-brand-primary text-brand-primary"
                      />
                    ))}
                  </div>
                  <h4 className="font-syne font-bold text-brand-dark">
                    {rev.fullName}
                  </h4>
                </div>

                {user?.email === rev.email && (
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(rev.id);
                        setForm({
                          rating: rev.rating,
                          statement: rev.statement,
                        });
                        window.scrollTo({ top: 400, behavior: "smooth" });
                      }}
                      className="text-brand-dark/40 hover:text-brand-primary transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="text-brand-dark/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <p className="font-jakarta text-sm text-brand-dark/60 leading-relaxed max-w-2xl">
                {rev.statement}
              </p>
              <span className="block mt-4 text-[9px] font-black text-brand-dark/20 uppercase tracking-widest">
                {new Date(rev.createdAt).toLocaleDateString()} • Verified
                Product
              </span>
            </div>
          ))
        ) : (
          <p className="text-brand-dark/30 italic">
            No testimonials yet for this formulation.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
