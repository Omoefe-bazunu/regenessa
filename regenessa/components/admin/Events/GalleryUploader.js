"use client";
import { useState } from "react";
import { Upload, X, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function GalleryUploader({ events, onUpdate }) {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Filter events that need gallery archives (usually Past events)
  const availableEvents = events.filter((e) => e.status === "past");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Enforce the 10-image limit
    const totalFiles = files.slice(0, 10);
    setNewFiles(totalFiles);
    setPreviews(totalFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleUpload = async () => {
    if (!selectedEventId || newFiles.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    // We only send the gallery files to the update route
    newFiles.forEach((file) => formData.append("gallery", file));

    try {
      await api.put(`/events/${selectedEventId}`, formData);
      alert("Gallery Evidence Updated Successfully");
      setNewFiles([]);
      setPreviews([]);
      onUpdate(); // Refresh the parent list
    } catch (err) {
      console.error("Gallery Sync Error:", err);
      alert("Failed to sync gallery images.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white border border-brand-dark/5 p-8 animate-in fade-in duration-500">
      <div className="max-w-3xl">
        <h2 className="font-syne text-2xl font-bold text-brand-dark mb-2">
          Gallery <span className="text-brand-accent italic">Uploader.</span>
        </h2>
        <p className="font-jakarta text-[10px] text-brand-dark/40 uppercase tracking-widest mb-8">
          Upload up to 10 high-resolution images for past event archives.
        </p>

        {/* 1. SELECT EVENT */}
        <div className="mb-8">
          <label className="block text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mb-3">
            Target Event
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full bg-brand-warm border border-brand-dark/5 p-4 text-sm font-bold focus:outline-none focus:border-brand-primary transition-all"
          >
            <option value="">Select a Past Event...</option>
            {availableEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} ({event.date})
              </option>
            ))}
          </select>
        </div>

        {/* 2. DROPZONE / UPLOAD */}
        <div className="space-y-6">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-brand-dark/10 bg-brand-warm cursor-pointer hover:border-brand-primary transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-brand-dark/20 mb-3" />
              <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest">
                Select up to 10 Images
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={!selectedEventId}
            />
          </label>

          {/* 3. PREVIEW GRID */}
          {previews.length > 0 && (
            <div className="grid grid-cols-5 gap-4 py-6 border-y border-brand-dark/5">
              {previews.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square bg-brand-dark/5 group"
                >
                  <img
                    src={url}
                    className="object-cover w-full h-full"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <span className="text-[8px] text-white font-bold uppercase">
                      Image {idx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. ACTION */}
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedEventId || newFiles.length === 0}
            className="w-full bg-brand-dark text-white p-6 font-jakarta text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-primary transition-all flex items-center justify-center gap-3 disabled:opacity-20"
          >
            {isUploading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            {isUploading ? "Saving..." : "Save to Gallery"}
          </button>
        </div>
      </div>
    </div>
  );
}
