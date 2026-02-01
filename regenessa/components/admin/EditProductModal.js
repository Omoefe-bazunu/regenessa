"use client";
import React from "react";
import Image from "next/image";
import { X, Save, Loader2, UploadCloud, Film, ImageIcon } from "lucide-react";

export default function EditProductModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onUpdate,
  loading,
  UNIT_OPTIONS,
  inputClass,
  mainImage,
  setMainImage,
  extraImage1,
  setExtraImage1,
  extraImage2,
  setExtraImage2,
  videoFile,
  setVideoFile,
}) {
  // CRITICAL: Block rendering if formData is not yet populated
  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white dark:bg-brand-dark h-full shadow-2xl p-8 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl dark:text-white">Edit Product</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-brand-dark dark:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onUpdate} className="space-y-5">
          {/* Main Image Safe-Guard */}
          <div className="relative h-44 border-2 border-dashed border-border rounded-2xl bg-gray-50 overflow-hidden group">
            <Image
              src={
                mainImage
                  ? URL.createObjectURL(mainImage)
                  : formData?.imageUrl || "/placeholder.png"
              }
              alt="Preview"
              fill
              className="object-contain p-2"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <UploadCloud className="text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* Extra Media Grid - NOW WITH 3 SLOTS */}
          <div className="grid grid-cols-3 gap-4">
            <div className="relative h-24 border border-dashed border-border rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
              <Image
                src={
                  extraImage1
                    ? URL.createObjectURL(extraImage1)
                    : formData?.gallery?.[0] || "/placeholder.png"
                }
                alt=""
                fill
                className="object-cover opacity-40"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setExtraImage1(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="relative h-24 border border-dashed border-border rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
              <Image
                src={
                  extraImage2
                    ? URL.createObjectURL(extraImage2)
                    : formData?.gallery?.[1] || "/placeholder.png"
                }
                alt=""
                fill
                className="object-cover opacity-40"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setExtraImage2(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="relative h-24 border border-dashed border-border rounded-xl bg-gray-50 flex items-center justify-center">
              {videoFile || formData?.videoUrl ? (
                <Film className="text-brand-primary" />
              ) : (
                <Film className="opacity-20" />
              )}
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4">
            <input
              value={formData?.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
              placeholder="Product Name"
            />
            <input
              value={formData?.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={inputClass}
              placeholder="Category"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={formData?.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={inputClass}
                placeholder="Price (₦)"
              />
              <select
                value={formData?.unit || "bag"}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className={inputClass}
              >
                {UNIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={formData?.stock || ""}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className={inputClass}
                placeholder="Stock"
              />
              <input
                type="number"
                value={formData?.moq || ""}
                onChange={(e) =>
                  setFormData({ ...formData, moq: e.target.value })
                }
                className={inputClass}
                placeholder="MOQ"
              />
            </div>
            <input
              value={formData?.locations || ""}
              onChange={(e) =>
                setFormData({ ...formData, locations: e.target.value })
              }
              className={inputClass}
              placeholder="Supply Locations"
            />
            <textarea
              rows="4"
              value={formData?.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={inputClass + " resize-none"}
              placeholder="Description"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}{" "}
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
