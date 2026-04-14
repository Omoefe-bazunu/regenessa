"use client";
import { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

export default function BlogAdminList({ onEdit }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/blog?limit=100");
      setPosts(data.posts);
    } catch (err) {
      console.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure? This will permanently remove this health Blog.",
      )
    ) {
      try {
        await api.delete(`/blog/${id}`);
        setPosts(posts.filter((p) => p.id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  if (loading)
    return (
      <Loader2 className="animate-spin mx-auto mt-20 text-brand-primary" />
    );

  return (
    <div className="mt-12 overflow-hidden border border-brand-dark/5 bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-brand-warm border-b border-brand-dark/5">
          <tr>
            <th className="p-6 font-jakarta text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
              Article
            </th>
            <th className="p-6 font-jakarta text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
              Date
            </th>
            <th className="p-6 font-jakarta text-[10px] font-black uppercase tracking-widest text-brand-dark/40 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-dark/5">
          {posts.map((post) => (
            <tr
              key={post.id}
              className="hover:bg-brand-warm/30 transition-colors"
            >
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 bg-brand-warm overflow-hidden rounded-sm">
                    <img
                      src={post.image}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <span className="font-syne font-bold text-brand-dark">
                    {post.title}
                  </span>
                </div>
              </td>
              <td className="p-6 font-jakarta text-xs text-brand-dark/60">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
              <td className="p-6 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(post)}
                    className="p-2 text-brand-dark/40 hover:text-brand-primary transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-brand-dark/40 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <Link
                    href={`/blog/${post.id}`}
                    target="_blank"
                    className="p-2 text-brand-dark/40 hover:text-brand-accent transition-colors"
                  >
                    <ExternalLink size={18} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
