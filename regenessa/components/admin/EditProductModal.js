"use client";
import React from "react";
import Image from "next/image";
import { X, Save, Loader2, UploadCloud, Film, Tag } from "lucide-react";

export default function EditProductModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onUpdate,
  loading,
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
          {/* MAIN IMAGE */}
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

          {/* GALLERY + VIDEO */}
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

            {/* PRICE + STOCK */}
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
              <input
                type="number"
                value={formData?.stockCount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, stockCount: e.target.value })
                }
                className={inputClass}
                placeholder="Stock Count"
              />
            </div>

            <select
              value={formData?.status || "In Stock"}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className={inputClass}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Pre-Order">Pre-Order</option>
            </select>

            {/* ─── SET DEAL FIELDS ─── */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={formData?.setQuantity || ""}
                onChange={(e) =>
                  setFormData({ ...formData, setQuantity: e.target.value })
                }
                className={inputClass}
                placeholder="Set Quantity (e.g. 5)"
              />
              <input
                type="number"
                value={formData?.setPrice || ""}
                onChange={(e) =>
                  setFormData({ ...formData, setPrice: e.target.value })
                }
                className={inputClass}
                placeholder="Set Price (₦)"
              />
            </div>

            {/* Live set deal preview */}
            {formData?.setQuantity && formData?.setPrice && (
              <div className="flex items-center gap-2 px-4 py-3 bg-brand-primary/5 border border-brand-primary/20 rounded-xl">
                <Tag size={13} className="text-brand-primary shrink-0" />
                <p className="text-[11px] font-bold text-brand-primary">
                  Buying {formData.setQuantity}+ units → ₦
                  {Number(formData.setPrice).toLocaleString()} each
                </p>
              </div>
            )}

            <label className="flex items-center gap-3 px-5 py-4 bg-brand-warm dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl cursor-pointer">
              <input
                type="checkbox"
                checked={formData?.featured || false}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 accent-brand-primary"
              />
              <span className="text-sm font-medium dark:text-white">
                Featured Product
              </span>
            </label>

            <textarea
              rows="2"
              value={formData?.shortDescription || ""}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              className={inputClass + " resize-none"}
              placeholder="Short Description"
            />
            <textarea
              rows="4"
              value={formData?.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={inputClass + " resize-none"}
              placeholder="Full Description"
            />
            <textarea
              rows="3"
              value={
                Array.isArray(formData?.benefits)
                  ? formData.benefits.join(", ")
                  : formData?.benefits || ""
              }
              onChange={(e) =>
                setFormData({ ...formData, benefits: e.target.value })
              }
              className={inputClass + " resize-none"}
              placeholder="Benefits (comma-separated)"
            />
            <textarea
              rows="3"
              value={
                Array.isArray(formData?.targetAilments)
                  ? formData.targetAilments.join(", ")
                  : formData?.targetAilments || ""
              }
              onChange={(e) =>
                setFormData({ ...formData, targetAilments: e.target.value })
              }
              className={inputClass + " resize-none"}
              placeholder="Target Ailments (comma-separated)"
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
