"use client";
import { useState } from "react";
import { LayoutDashboard, PlusCircle, PenTool } from "lucide-react";
import BlogAdminList from "./BlogList";
import BlogForm from "./AddBlogPost";

export default function BlogAdminDashboard() {
  const [activeTab, setActiveTab] = useState("list");
  const [postToEdit, setPostToEdit] = useState(null);

  // Transition to edit mode
  const handleEditInitiated = (post) => {
    setPostToEdit(post);
    setActiveTab("form");
  };

  // Reset after successful publish/update
  const handleFormSuccess = () => {
    setPostToEdit(null);
    setActiveTab("list");
  };

  return (
    <main className="min-h-screen bg-brand-warm pt-12 pb-24 px-6 md:px-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="font-syne text-5xl font-bold text-brand-dark tracking-tighter uppercase">
            Blog <span className="text-brand-accent italic">Control.</span>
          </h1>
          <p className="font-jakarta text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mt-4">
            Manage your clinical articles and regenerative health Blogs.
          </p>
        </header>

        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab("list");
              setPostToEdit(null);
            }}
            className={`flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeTab === "list"
                ? "bg-brand-dark text-white shadow-xl scale-105"
                : "bg-white border-brand-dark/10 text-brand-dark/40 hover:border-brand-primary"
            }`}
          >
            <LayoutDashboard size={14} /> Blogs Library
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeTab === "form"
                ? "bg-brand-primary text-white shadow-xl scale-105"
                : "bg-white border-brand-dark/10 text-brand-dark/40 hover:border-brand-primary"
            }`}
          >
            {postToEdit ? <PenTool size={14} /> : <PlusCircle size={14} />}
            {postToEdit ? "Edit Blog" : "Write New Blog"}
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="mt-12">
          {activeTab === "list" ? (
            <BlogAdminList onEdit={handleEditInitiated} />
          ) : (
            <BlogForm editingPost={postToEdit} onSuccess={handleFormSuccess} />
          )}
        </div>
      </div>
    </main>
  );
}
