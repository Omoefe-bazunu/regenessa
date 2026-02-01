"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/api";
import EditProductModal from "./EditProductModal";
import {
  Plus,
  ListFilter,
  Trash2,
  Edit3,
  Loader2,
  Image as ImageIcon,
  UploadCloud,
  Film,
  MapPin,
} from "lucide-react";
import { toast } from "react-hot-toast";

const UNIT_OPTIONS = ["kg", "tubers", "basket", "sack", "bag", "rubber"];

export default function ManageProducts() {
  const [tab, setTab] = useState("list");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // New State
  const [timeLeft, setTimeLeft] = useState(null); // New State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Separate File States
  const [mainImage, setMainImage] = useState(null);
  const [extraImage1, setExtraImage1] = useState(null);
  const [extraImage2, setExtraImage2] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    unit: "bag",
    stock: "",
    moq: "1",
    locations: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (tab === "list") fetchProducts();
  }, [tab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      unit: "bag",
      stock: "",
      moq: "1",
      locations: "",
      description: "",
      status: "active",
    });
    setMainImage(null);
    setExtraImage1(null);
    setExtraImage2(null);
    setVideoFile(null);
    setCurrentProduct(null);
    setUploadProgress(0);
    setTimeLeft(null);
  };

  // Helper function for Upload Progress logic
  const uploadConfig = (startTime) => ({
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      setUploadProgress(percentCompleted);

      // Estimate time left
      const elapsedTime = (Date.now() - startTime) / 1000;
      if (percentCompleted > 0) {
        const totalTime = (elapsedTime * 100) / percentCompleted;
        const remaining = Math.round(totalTime - elapsedTime);
        setTimeLeft(remaining > 0 ? remaining : 0);
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage) return toast.error("Main image is compulsory");
    setLoading(true);
    const startTime = Date.now();

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) =>
        formDataToSend.append(key, formData[key]),
      );
      formDataToSend.append("mainImage", mainImage);
      if (extraImage1) formDataToSend.append("extraImage1", extraImage1);
      if (extraImage2) formDataToSend.append("extraImage2", extraImage2);
      if (videoFile) formDataToSend.append("video", videoFile);

      await api.post("/products", formDataToSend, uploadConfig(startTime));

      toast.success("Product created!");
      setTab("list");
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const startTime = Date.now();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "id") formDataToSend.append(key, formData[key]);
      });

      if (mainImage) formDataToSend.append("mainImage", mainImage);
      if (extraImage1) formDataToSend.append("extraImage1", extraImage1);
      if (extraImage2) formDataToSend.append("extraImage2", extraImage2);
      if (videoFile) formDataToSend.append("video", videoFile);

      await api.put(
        `/products/${currentProduct.id}`,
        formDataToSend,
        uploadConfig(startTime),
      );

      toast.success("Updated!");
      setIsEditModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted!");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const inputClass =
    "w-full px-5 py-4 bg-brand-warm dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm text-brand-dark dark:text-white placeholder:opacity-30";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-4 p-1.5 bg-brand-warm dark:bg-white/5 w-fit rounded-2xl border border-border">
        <button
          onClick={() => setTab("list")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${tab === "list" ? "bg-white dark:bg-brand-dark shadow-md text-brand-primary" : "text-foreground/40"}`}
        >
          <ListFilter size={18} /> View All
        </button>
        <button
          onClick={() => setTab("add")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${tab === "add" ? "bg-white dark:bg-brand-dark shadow-md text-brand-primary" : "text-foreground/40"}`}
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {tab === "add" ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-brand-dark p-8 md:p-10 rounded-[2.5rem] border border-border shadow-sm space-y-8 max-w-6xl mx-auto"
        >
          {/* Progress Indicator Overlay */}
          {loading && uploadProgress > 0 && (
            <div className="fixed inset-0 z-[110] bg-brand-dark/60 backdrop-blur-md flex items-center justify-center p-6">
              <div className="bg-white dark:bg-brand-dark w-full max-w-md p-8 rounded-3xl border border-white/10 text-center shadow-2xl">
                <Loader2
                  className="animate-spin text-brand-primary mx-auto mb-4"
                  size={40}
                />
                <h3 className="font-heading text-xl mb-2 dark:text-white">
                  Uploading Product...
                </h3>
                <div className="w-full bg-brand-warm dark:bg-white/10 h-3 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-brand-primary h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60 dark:text-white">
                  <span>{uploadProgress}% Completed</span>
                  {timeLeft !== null && (
                    <span>Approx. {timeLeft}s remaining</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Media Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative h-40 border-2 border-dashed border-brand-primary/30 rounded-2xl flex items-center justify-center bg-brand-warm/30 overflow-hidden">
              {mainImage ? (
                <Image
                  src={URL.createObjectURL(mainImage)}
                  alt="Main"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center text-brand-primary">
                  <UploadCloud className="mx-auto" />
                  <p className="text-[8px] font-bold uppercase mt-1">Main*</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMainImage(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="relative h-40 border border-dashed border-border rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
              {extraImage1 ? (
                <Image
                  src={URL.createObjectURL(extraImage1)}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <ImageIcon className="opacity-20" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setExtraImage1(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="relative h-40 border border-dashed border-border rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
              {extraImage2 ? (
                <Image
                  src={URL.createObjectURL(extraImage2)}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <ImageIcon className="opacity-20" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setExtraImage2(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="relative h-40 border border-dashed border-border rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
              {videoFile ? (
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
              placeholder="Product Name"
            />
            <input
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={inputClass}
              placeholder="Category"
            />
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className={inputClass}
              placeholder="Price (₦)"
            />
            <select
              value={formData.unit}
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
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className={inputClass}
              placeholder="Stock"
            />
            <input
              type="number"
              value={formData.moq}
              onChange={(e) =>
                setFormData({ ...formData, moq: e.target.value })
              }
              className={inputClass}
              placeholder="MOQ"
            />
          </div>
          <input
            required
            value={formData.locations}
            onChange={(e) =>
              setFormData({ ...formData, locations: e.target.value })
            }
            className={inputClass}
            placeholder="Supply Locations"
          />
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={inputClass + " resize-none"}
            placeholder="Description..."
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Plus />} Save
            Product
          </button>
        </form>
      ) : (
        <div className="bg-white dark:bg-brand-dark rounded-[2.5rem] border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-brand-warm/50 border-b border-border text-[10px] uppercase font-bold opacity-50">
              <tr>
                <th className="px-8 py-4">Product</th>
                <th className="px-8 py-4 text-center">Price</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr
                  key={prod.id}
                  className="border-b border-border/50 hover:bg-brand-warm/10 transition-colors"
                >
                  <td className="px-8 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden relative">
                      {prod.imageUrl && (
                        <Image
                          src={prod.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="font-bold text-sm">{prod.name}</span>
                  </td>
                  <td className="px-8 py-4 text-center text-sm font-medium">
                    ₦{prod.price?.toLocaleString()}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => {
                        setFormData({ ...prod });
                        setCurrentProduct(prod);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg mr-2 transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isEditModalOpen && currentProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            resetForm();
          }}
          formData={formData}
          setFormData={setFormData}
          onUpdate={handleUpdate}
          loading={loading}
          UNIT_OPTIONS={UNIT_OPTIONS}
          inputClass={inputClass}
          mainImage={mainImage}
          setMainImage={setMainImage}
          extraImage1={extraImage1}
          setExtraImage1={setExtraImage1}
          extraImage2={extraImage2}
          setExtraImage2={setExtraImage2}
          videoFile={videoFile}
          setVideoFile={setVideoFile}
          uploadProgress={uploadProgress} // Pass progress to modal
          timeLeft={timeLeft} // Pass time to modal
        />
      )}
    </div>
  );
}
