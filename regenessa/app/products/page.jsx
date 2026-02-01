"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductSection from "@/components/ProductSection";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching Regenessa products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main>
      {/* Passing the fetched products to your component */}
      <ProductSection products={products} isLoading={loading} />
    </main>
  );
}
