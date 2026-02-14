"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  HelpCircle,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ManageFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    const { data } = await api.get("/faqs");
    setFaqs(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/faqs/${editingId}`, formData);
        toast.success("FAQ updated");
      } else {
        await api.post("/faqs", formData);
        toast.success("FAQ added");
      }
      setFormData({ question: "", answer: "", category: "General" });
      setEditingId(null);
      fetchFaqs();
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (faq) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* FORM SECTION */}
      <div className="bg-white p-8 border border-brand-dark/5 shadow-sm rounded-sm">
        <h2 className="font-syne font-bold text-xl uppercase mb-6 flex items-center gap-2">
          {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
          {editingId ? "Update" : "Add"}{" "}
          <span className="text-brand-primary italic">Question.</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Enter Question"
            className="w-full p-4 bg-brand-warm border-none font-bold text-sm uppercase"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
          />
          <textarea
            required
            placeholder="Enter Detailed Answer"
            className="w-full p-4 bg-brand-warm border-none text-sm min-h-[120px]"
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
          />
          <div className="flex gap-4">
            <button
              disabled={loading}
              className="flex-1 py-4 bg-brand-dark text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : editingId ? (
                "Save Changes"
              ) : (
                "Publish FAQ"
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    question: "",
                    answer: "",
                    category: "General",
                  });
                }}
                className="px-6 bg-red-50 text-red-600 font-bold text-[10px] uppercase tracking-widest"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST SECTION */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white p-6 border border-brand-dark/5 flex justify-between items-start group"
          >
            <div className="flex-1 pr-10">
              <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1 block">
                {faq.category}
              </span>
              <h4 className="font-syne font-bold text-brand-dark uppercase tracking-tight mb-2">
                {faq.question}
              </h4>
              <p className="text-xs text-brand-dark/40 line-clamp-2">
                {faq.answer}
              </p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEdit(faq)}
                className="p-3 text-brand-dark/40 hover:text-brand-primary hover:bg-brand-warm rounded-full transition-all"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => api.delete(`/faqs/${faq.id}`).then(fetchFaqs)}
                className="p-3 text-brand-dark/40 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
