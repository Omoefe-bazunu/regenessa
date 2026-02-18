// app/products/page.js
import ProductsClient from "./ProductsClient";

// 🚀 Professional Metadata for SEO
export const metadata = {
  title: "Premium Plant Stem Cell Products | REGENESSA",
  description:
    "Explore our catalog of authentic Phytoscience stem cell solutions. Clinical-grade products designed for anti-aging, immunity, and systemic recovery.",
  openGraph: {
    title: "REGENESSA Products Catalog",
    description: "Verified Regenerative Wellness Solutions",
    url: "https://www.regenessa.com/products",
    siteName: "REGENESSA",
    images: [
      {
        url: "https://www.regenessa.com/og-products.png", // Replace with your actual catalog OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_NG",
    type: "website",
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
