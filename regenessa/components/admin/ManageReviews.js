"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  Trash2,
  Plus,
  Star,
  Loader2,
  Search,
  X,
  MessageSquare,
} from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    fullName: "",
    email: "",
    rating: 5,
    statement: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews/product/all");
      setReviews(data);
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products/list");
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Delete this review? This will update product ratings."))
      return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Review deleted!");
      fetchReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.fullName || !formData.statement) {
      return toast.error("Please fill all required fields");
    }

    setSubmitting(true);
    try {
      await api.post(`/reviews/product/${formData.productId}`, {
        fullName: formData.fullName,
        email: formData.email,
        rating: formData.rating,
        statement: formData.statement,
      });

      toast.success("Review added successfully!");
      setShowAddModal(false);
      setFormData({
        productId: "",
        fullName: "",
        email: "",
        rating: 5,
        statement: "",
      });
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.statement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || "Unknown Product";
  };

  const inputClass =
    "w-full px-5 py-4 bg-brand-warm dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-brand-primary" size={32} />
          <h1 className="font-heading text-3xl">Manage Reviews</h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-all w-fit"
        >
          <Plus size={20} /> Add Review
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-dark/30"
          size={20}
        />
        <input
          type="text"
          placeholder="Search reviews by name, email, or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-5 py-4 bg-white dark:bg-brand-dark border border-border rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-primary" size={40} />
        </div>
      ) : (
        <div className="bg-white dark:bg-brand-dark rounded-xl border border-border overflow-hidden">
          {/* Mobile: Scrollable wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-brand-warm/50 border-b border-border text-[10px] uppercase font-bold opacity-50">
                <tr>
                  <th className="px-4 md:px-8 py-4">Product</th>
                  <th className="px-4 md:px-8 py-4">Customer</th>
                  <th className="px-4 md:px-8 py-4">Rating</th>
                  <th className="px-4 md:px-8 py-4">Review</th>
                  <th className="px-4 md:px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-12 text-center opacity-50"
                    >
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr
                      key={review.id}
                      className="border-b border-border/50 hover:bg-brand-warm/10 transition-colors"
                    >
                      <td className="px-4 md:px-8 py-4">
                        <span className="font-bold text-sm line-clamp-2">
                          {getProductName(review.productId)}
                        </span>
                      </td>
                      <td className="px-4 md:px-8 py-4">
                        <div>
                          <p className="font-bold text-sm whitespace-nowrap">
                            {review.fullName}
                          </p>
                          <p className="text-xs opacity-50 truncate max-w-[150px]">
                            {review.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 md:px-8 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? "fill-brand-primary text-brand-primary"
                                  : "text-brand-dark/20"
                              }
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 md:px-8 py-4">
                        <p className="text-sm line-clamp-2 max-w-xs">
                          {review.statement}
                        </p>
                      </td>
                      <td className="px-4 md:px-8 py-4 text-right">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          aria-label="Delete review"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile scroll hint */}
          {filteredReviews.length > 0 && (
            <div className="md:hidden p-4 text-center border-t border-border">
              <p className="text-xs text-brand-dark/40 font-medium">
                ← Swipe to see all columns →
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-md bg-brand-dark/40">
          <div className="bg-white dark:bg-brand-dark p-10 rounded-3xl border border-border shadow-2xl max-w-2xl w-full animate-page-reveal max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading text-2xl dark:text-white">
                Add New Review
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">
                  Select Product *
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData({ ...formData, productId: e.target.value })
                  }
                  className={inputClass}
                  required
                >
                  <option value="">Choose a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className={inputClass}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={
                          rating <= formData.rating
                            ? "fill-brand-primary text-brand-primary"
                            : "text-brand-dark/20"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">
                  Review Statement *
                </label>
                <textarea
                  rows="4"
                  value={formData.statement}
                  onChange={(e) =>
                    setFormData({ ...formData, statement: e.target.value })
                  }
                  className={inputClass + " resize-none"}
                  placeholder="Write the review here..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 border border-border rounded-2xl font-bold hover:bg-brand-warm dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Add Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
