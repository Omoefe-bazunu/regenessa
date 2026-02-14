"use client";
import { useState, useEffect } from "react";
import {
  Upload,
  Trash2,
  Loader2,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function ManageCerts() {
  const [certs, setCerts] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const { data } = await api.get("/certifications");
      setCerts(data);
    } catch (err) {
      toast.error("Failed to load certificates");
    } finally {
      setFetching(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a logo");
    setLoading(true);

    const formData = new FormData();
    formData.append("logo", file);
    formData.append("name", file.name.split(".")[0]); // Default name from filename

    try {
      await api.post("/certifications", formData);
      toast.success("Trust asset added successfully");
      setFile(null);
      fetchCerts();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this certification from the public slider?"))
      return;

    try {
      await api.delete(`/certifications/${id}`);
      setCerts(certs.filter((c) => c.id !== id));
      toast.success("Certification removed");
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12">
      <header className="flex items-center justify-between border-b border-brand-dark/10 pb-6">
        <div>
          <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter">
            Trust{" "}
            <span className="text-brand-primary italic">Certifications.</span>
          </h2>
          <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest mt-1">
            Manage partner and regulatory logos
          </p>
        </div>
        <ShieldCheck className="text-brand-primary" size={32} />
      </header>

      {/* UPLOAD BOX */}
      <div className="bg-white p-8 border border-brand-dark/5 shadow-sm rounded-sm">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-brand-dark/10 p-12 text-center relative bg-brand-warm/30 group hover:border-brand-primary/40 transition-all">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
                <CheckCircle size={24} className="text-brand-primary" />
                <p className="text-xs font-bold uppercase tracking-tight">
                  {file.name}
                </p>
              </div>
            ) : (
              <div className="opacity-40 group-hover:opacity-100 transition-opacity">
                <Upload className="mx-auto mb-2 text-brand-primary" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Click to upload logo
                </p>
              </div>
            )}
          </div>
          <button
            disabled={loading}
            className="w-full py-5 bg-brand-dark text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary transition-all flex items-center justify-center gap-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Publish Certification"
            )}
          </button>
        </form>
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {fetching ? (
          <div className="col-span-full py-10 flex justify-center">
            <Loader2 className="animate-spin text-brand-primary" />
          </div>
        ) : (
          certs.map((cert) => (
            <div
              key={cert.id}
              className="relative group aspect-square bg-white border border-brand-dark/5 rounded-full flex items-center justify-center p-6 shadow-sm"
            >
              <Image
                src={cert.url}
                alt={cert.name || "Certification logo"}
                fill
                className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                sizes="(max-width: 768px) 100px, 150px"
              />

              <button
                onClick={() => handleDelete(cert.id)}
                className="absolute inset-0 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-300 backdrop-blur-sm"
              >
                <Trash2 size={20} />
                <span className="text-[8px] font-black uppercase tracking-widest">
                  Delete
                </span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
