"use client";
import { useState, useEffect } from "react";
import {
  Package,
  Trash2,
  CheckCircle,
  Loader2,
  BookOpen,
  Search,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ManagePackages() {
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [formData, setFormData] = useState({
    ailmentName: "",
    instructions: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [prodRes, packRes] = await Promise.all([
        api.get("/products"),
        api.get("/packages"),
      ]);
      setProducts(prodRes.data);
      setPackages(packRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  const toggleProduct = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (selectedProductIds.length === 0)
      return toast.error("Select at least one product");
    setLoading(true);

    try {
      await api.post("/packages", {
        ...formData,
        productIds: selectedProductIds,
      });
      toast.success("Package Created");
      setFormData({ ailmentName: "", instructions: "" });
      setSelectedProductIds([]);
      fetchInitialData();
    } catch (err) {
      toast.error("Creation failed");
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="bg-white p-8 border border-brand-dark/5 shadow-sm">
        <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter mb-8">
          Curate <span className="text-brand-primary italic">Bundle.</span>
        </h2>

        <form onSubmit={handleCreate} className="space-y-6">
          <input
            required
            placeholder="AILMENT NAME (e.g. ARTHRITIS)"
            className="w-full p-4 bg-brand-warm border-none font-syne font-bold uppercase focus:ring-1 focus:ring-brand-primary"
            value={formData.ailmentName}
            onChange={(e) =>
              setFormData({ ...formData, ailmentName: e.target.value })
            }
          />

          <textarea
            required
            placeholder="USAGE INSTRUCTIONS (e.g. Dosage, timing, and dietary tips)"
            className="w-full p-4 bg-brand-warm border-none font-jakarta text-sm min-h-[120px] focus:ring-1 focus:ring-brand-primary"
            value={formData.instructions}
            onChange={(e) =>
              setFormData({ ...formData, instructions: e.target.value })
            }
          />

          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-dark/5 pb-2">
              <Search size={14} className="text-brand-dark/30" />
              <input
                placeholder="Search products to add..."
                className="bg-transparent border-none text-[10px] uppercase font-bold tracking-widest w-full outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto p-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={`p-4 border cursor-pointer transition-all relative ${
                    selectedProductIds.includes(product.id)
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-brand-dark/5 hover:border-brand-dark/20"
                  }`}
                >
                  <p className="font-syne font-bold text-[10px] uppercase leading-tight pr-4">
                    {product.name}
                  </p>
                  {selectedProductIds.includes(product.id) && (
                    <CheckCircle
                      size={14}
                      className="text-brand-primary absolute top-2 right-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-6 bg-brand-dark text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-brand-primary transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Save Bundle"
            )}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-syne font-bold uppercase tracking-widest text-brand-dark/40 text-xs">
          Clinical Inventory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white p-6 border border-brand-dark/5 flex items-start justify-between group"
            >
              <div>
                <h4 className="font-syne font-bold text-lg text-brand-dark uppercase tracking-tight">
                  {pkg.ailmentName}
                </h4>
                <p className="text-[9px] font-black text-brand-primary uppercase mt-1 tracking-widest">
                  {pkg.products.length} Products Linked
                </p>
                <div className="mt-3 flex items-start gap-2 text-brand-dark/40 italic">
                  <BookOpen size={12} className="mt-1" />
                  <p className="text-[10px] font-jakarta line-clamp-2">
                    {pkg.instructions}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  api.delete(`/packages/${pkg.id}`).then(fetchInitialData)
                }
                className="p-2 text-brand-dark/10 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
