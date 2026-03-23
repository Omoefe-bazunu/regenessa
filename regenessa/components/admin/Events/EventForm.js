"use client";
import { useState, useEffect } from "react";
import { Camera, Loader2, X, MousePointer2 } from "lucide-react";
import api from "@/lib/api";
import Image from "next/image";

export default function EventForm({ editingEvent, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    ctaText: "", // Added
    ctaLink: "", // Added
    status: "ongoing",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || "",
        description: editingEvent.description || "",
        date: editingEvent.date || "",
        ctaText: editingEvent.ctaText || "",
        ctaLink: editingEvent.ctaLink || "",
        status: editingEvent.status || "ongoing",
      });
      setPreview(editingEvent.image);
    }
  }, [editingEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (image) data.append("image", image);

    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, data);
      } else {
        await api.post("/events", data);
      }
      onSuccess();
      // Reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        ctaText: "",
        ctaLink: "",
        status: "ongoing",
      });
      setPreview("");
      setImage(null);
    } catch (err) {
      console.error("Event Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 border border-brand-dark/5 space-y-6 sticky top-10 shadow-sm"
    >
      <h2 className="font-syne text-xl font-bold uppercase tracking-tight text-brand-dark">
        {editingEvent ? "Refine Event" : "Create New Event"}
      </h2>

      {/* BANNER UPLOAD */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
          Event Banner (Required)
        </label>
        {preview ? (
          <div className="relative aspect-video w-full border border-brand-dark/10 overflow-hidden">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => {
                setPreview("");
                setImage(null);
              }}
              className="absolute top-2 right-2 p-1.5 bg-brand-primary text-white"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center aspect-video w-full border-2 border-dashed border-brand-dark/10 bg-brand-warm cursor-pointer hover:border-brand-primary transition-all">
            <Camera size={24} className="text-brand-dark/20 mb-2" />
            <span className="text-[9px] font-black uppercase text-brand-dark/30">
              Upload Event Banner
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              required={!editingEvent}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        )}
      </div>

      <input
        type="text"
        placeholder="Event Title"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full bg-brand-warm p-4 text-sm focus:outline-none"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Date (e.g. 25th May)"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full bg-brand-warm p-4 text-sm focus:outline-none"
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full bg-brand-warm p-4 text-[10px] font-black uppercase focus:outline-none"
        >
          <option value="ongoing">Ongoing</option>
          <option value="past">Past</option>
        </select>
      </div>

      <textarea
        rows={3}
        placeholder="Event Description..."
        required
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full bg-brand-warm p-4 text-sm focus:outline-none"
      />

      {/* 🛠️ REQUIRED CTA SECTION */}
      <div className="p-4 bg-brand-warm/50 border border-brand-dark/5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MousePointer2 size={14} className="text-brand-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">
            Call to Action (Required)
          </span>
        </div>
        <input
          type="text"
          placeholder="Button Text (e.g. Register Now)"
          required
          value={formData.ctaText}
          onChange={(e) =>
            setFormData({ ...formData, ctaText: e.target.value })
          }
          className="w-full bg-white p-3 text-xs font-bold border border-brand-dark/5 focus:outline-none"
        />
        <input
          type="url"
          placeholder="Button Link (e.g. https://...)"
          required
          value={formData.ctaLink}
          onChange={(e) =>
            setFormData({ ...formData, ctaLink: e.target.value })
          }
          className="w-full bg-white p-3 text-xs font-jakarta border border-brand-dark/5 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-dark text-white py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-brand-primary transition-all flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" size={16} />
        ) : editingEvent ? (
          "Update Event"
        ) : (
          "Publish Event"
        )}
      </button>
    </form>
  );
}
