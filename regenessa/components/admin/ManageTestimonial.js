"use client";
import { useState, useEffect } from "react";
import {
  Upload,
  X,
  Loader2,
  CheckCircle,
  Package,
  Trash2,
  Video,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function ManageTestimonials() {
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({ regimenUsed: "", type: "image" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. FETCH REGISTRY ON LOAD & PAGE CHANGE
  useEffect(() => {
    fetchRegistry();
  }, [currentPage]);

  const fetchRegistry = async () => {
    setFetching(true);
    try {
      // Fetching 3 items per page to match the clinical performance style
      const { data } = await api.get(
        `/testimonials?page=${currentPage}&limit=3`,
      );

      // Handle both paginated object and simple array fallbacks
      const registryItems = data.evidence || (Array.isArray(data) ? data : []);
      setItems(registryItems);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load testimonials");
      setItems([]);
    } finally {
      setFetching(false);
    }
  };

  // 2. UPLOAD LOGIC
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    const isVideo = selected.type.startsWith("video/");
    const sizeInMb = selected.size / (1024 * 1024);

    if (isVideo && sizeInMb > 10)
      return toast.error("Videos must be under 10MB");
    if (!isVideo && sizeInMb > 2)
      return toast.error("Images must be under 2MB");

    setFile(selected);
    setFormData({ ...formData, type: isVideo ? "video" : "image" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select media");
    setLoading(true);

    const data = new FormData();
    data.append("regimenUsed", formData.regimenUsed);
    data.append("type", formData.type);
    data.append("media", file);
    data.append("patientName", "Verified User");
    data.append("message", "Visual Evidence Only");

    try {
      await api.post("/testimonials", data);
      toast.success("Testimonial Saved");
      setFile(null);
      setFormData({ regimenUsed: "", type: "image" });
      fetchRegistry();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE LOGIC
  const handleDelete = async (id) => {
    if (!window.confirm("Permanently remove this evidence from the List?"))
      return;

    try {
      await api.delete(`/testimonials/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Asset deleted successfully");

      // If the current page becomes empty after delete, go back a page
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchRegistry();
      }
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* UPLOAD SECTION */}
      <div className="bg-white p-8 border border-brand-dark/5 shadow-sm rounded-sm">
        <header className="mb-8">
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-2 block">
            Archive New Evidence
          </span>
          <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter">
            Register <span className="text-brand-primary italic">Media.</span>
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary opacity-40">
              <Package size={18} />
            </div>
            <input
              required
              placeholder="Product Name"
              className="w-full p-4 pl-12 bg-brand-warm border-none font-syne text-sm uppercase font-bold focus:ring-1 focus:ring-brand-primary"
              value={formData.regimenUsed}
              onChange={(e) =>
                setFormData({ ...formData, regimenUsed: e.target.value })
              }
            />
          </div>

          <div className="border-2 border-dashed border-brand-dark/10 p-12 text-center relative hover:border-brand-primary/50 bg-brand-warm/30 transition-all">
            <input
              type="file"
              accept="image/*,video/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle size={24} className="text-brand-primary" />
                <span className="font-syne font-bold text-[10px] uppercase tracking-widest">
                  {file.name}
                </span>
              </div>
            ) : (
              <div className="opacity-40">
                <Upload className="mx-auto mb-2 text-brand-primary" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Select Video (10MB) or Image (2MB)
                </p>
              </div>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full py-5 bg-brand-dark text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary transition-all flex items-center justify-center gap-4"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin" size={18} />
                <span>Uploading...</span>
              </div>
            ) : (
              "Save"
            )}
          </button>
        </form>
      </div>

      {/* LIST SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-brand-dark/10 pb-4">
          <h3 className="font-syne font-bold text-lg uppercase tracking-tight">
            Active Testimonials{" "}
            <span className="text-brand-dark/30 font-normal">
              ({items.length} on this page)
            </span>
          </h3>
          {fetching && (
            <Loader2 className="animate-spin text-brand-primary" size={20} />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white border border-brand-dark/5 hover:border-brand-primary/20 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 bg-brand-warm overflow-hidden rounded-sm">
                  {item.type === "video" ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/10">
                      <Video size={20} className="text-brand-primary" />
                    </div>
                  ) : (
                    <Image
                      src={item.mediaUrl}
                      alt={item.regimenUsed}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      sizes="64px"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-syne font-bold text-sm uppercase tracking-tight text-brand-dark">
                    {item.regimenUsed}
                  </h4>
                  <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                    {item.type === "video" ? (
                      <Video size={10} />
                    ) : (
                      <ImageIcon size={10} />
                    )}
                    Verified {item.type} Evidence
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-4 text-brand-dark/20 hover:text-red-600 hover:bg-red-50 transition-all rounded-full"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {!fetching && items.length === 0 && (
            <div className="py-20 text-center border-2 border-dotted border-brand-dark/5">
              <p className="font-jakarta text-xs text-brand-dark/30 uppercase tracking-[0.2em]">
                The list is currently empty.
              </p>
            </div>
          )}
        </div>

        {/* ADMIN PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 border border-brand-dark/10 disabled:opacity-20 hover:bg-brand-warm transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-syne font-bold text-[10px] uppercase tracking-widest">
              Page {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 border border-brand-dark/10 disabled:opacity-20 hover:bg-brand-warm transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
