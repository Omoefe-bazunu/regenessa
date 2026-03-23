// app/blog/[id]/page.js
import ProductSection from "@/components/ProductSection";
import BlogDetailClient from "./BlogDetailClient";
import api from "@/lib/api";

// 🚀 Dynamic SEO for every health article
export async function generateMetadata({ params }) {
  const { id } = await params; // 🛠️ Fix: Await params before accessing 'id'

  try {
    const { data: post } = await api.get(`/blog/${id}`);
    return {
      title: `${post.title} | REGENESSA Health Insights`,
      description: post.body.replace(/<[^>]*>?/gm, "").slice(0, 160),
      openGraph: {
        title: post.title,
        description: post.body.replace(/<[^>]*>?/gm, "").slice(0, 160),
        images: [{ url: post.image || "/og-blog.jpg" }],
        type: "article",
        publishedTime: post.createdAt,
      },
    };
  } catch (error) {
    return { title: "Blog Insight | REGENESSA" };
  }
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params; // 🛠️ Fix: Await params here as well
  return (
    <>
      <BlogDetailClient id={id} />
      <ProductSection />
    </>
  );
}
