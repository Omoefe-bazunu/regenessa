"use client";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  User,
} from "lucide-react";
import api from "@/lib/api";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function BlogForm({ editingPost, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    imageSource: "",
    imageLink: "",
    author: "REGENESSA Editorial",
    body: "",
  });
  const [image, setImage] = useState(null);
  const [authorImage, setAuthorImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [authorPreview, setAuthorPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || "",
        slug: editingPost.slug || "",
        excerpt: editingPost.excerpt || "",
        imageSource: editingPost.imageSource || "",
        imageLink: editingPost.imageLink || "",
        author: editingPost.author || "REGENESSA Editorial",
        body: editingPost.body || "",
      });
      setPreview(editingPost.image);
      setAuthorPreview(editingPost.authorImage);
    }
  }, [editingPost]);

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData({ ...formData, title, slug });
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    [],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanBody = formData.body
      .replace(/&nbsp;/g, " ") // ← ADD THIS FIRST
      .replace(/<p><br\s*\/?><\/p>/g, "")
      .replace(/<br\s*\/?>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "body") {
        data.append("body", cleanBody);
      } else {
        data.append(key, formData[key]);
      }
    });

    if (image) data.append("image", image);
    if (authorImage) data.append("authorImage", authorImage);

    try {
      if (editingPost) {
        await api.put(`/blog/${editingPost.id}`, data);
      } else {
        await api.post("/blog", data);
      }
      setStatus({
        type: "success",
        message: "Blog posted successfully.",
      });
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setStatus({ type: "error", message: "Sync failed. Check connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border border-brand-dark/5 shadow-sm mt-12 mb-20">
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* SECTION 1: VISUAL ASSETS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
              Featured Image
            </label>
            <div className="relative aspect-video bg-brand-warm border-2 border-dashed border-brand-dark/10 flex items-center justify-center cursor-pointer overflow-hidden">
              {preview ? (
                <>
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview("");
                    }}
                    className="absolute top-2 right-2 bg-brand-primary p-1 text-white"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center">
                  <Camera size={24} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
              Author Image
            </label>
            <div className="relative h-32 w-32 bg-brand-warm border-2 border-dashed border-brand-dark/10 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
              {authorPreview ? (
                <>
                  <Image
                    src={authorPreview}
                    alt="Author"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAuthorImage(null);
                      setAuthorPreview("");
                    }}
                    className="absolute inset-0 bg-brand-dark/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center">
                  <User size={24} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      setAuthorImage(e.target.files[0]);
                      setAuthorPreview(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: CORE METADATA */}
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Article Title"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full bg-transparent border-b border-brand-dark/10 py-4 font-syne text-4xl font-bold focus:outline-none focus:border-brand-primary"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="URL Slug (e.g. liver-health-tips)"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full bg-brand-warm p-4 text-xs font-bold border border-brand-dark/5 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Author Name"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="w-full bg-brand-warm p-4 text-xs font-bold border border-brand-dark/5 focus:outline-none"
            />
          </div>
          <textarea
            rows={3}
            placeholder="Excerpt: Short summary for the blog card..."
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            className="w-full bg-brand-warm p-4 text-sm border border-brand-dark/5 focus:outline-none leading-relaxed"
          />
        </div>

        {/* SECTION 3: COPYRIGHT & SOURCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-brand-warm border border-brand-dark/5">
          <input
            type="text"
            placeholder="Image Source (e.g. Getty Images)"
            value={formData.imageSource}
            onChange={(e) =>
              setFormData({ ...formData, imageSource: e.target.value })
            }
            className="bg-white p-3 text-[10px] font-black uppercase tracking-widest border border-brand-dark/5 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Image Link (Optional)"
            value={formData.imageLink}
            onChange={(e) =>
              setFormData({ ...formData, imageLink: e.target.value })
            }
            className="bg-white p-3 text-[10px] font-black uppercase tracking-widest border border-brand-dark/5 focus:outline-none"
          />
        </div>

        {/* SECTION 4: CONTENT */}
        <div className="min-h-[400px]">
          <ReactQuill
            theme="snow"
            value={formData.body}
            onChange={(c) => setFormData({ ...formData, body: c })}
            modules={modules}
            className="h-full font-jakarta"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-dark text-white py-6 font-jakarta text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-primary transition-all flex items-center justify-center gap-4"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={16} />
          ) : editingPost ? (
            "Update Blog"
          ) : (
            "Add Post"
          )}
        </button>
      </form>
    </div>
  );
}
