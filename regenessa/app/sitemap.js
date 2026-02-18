import api from "@/lib/api";

export default async function sitemap() {
  const baseUrl = "https://www.regenessa.com";

  // 1. Static Routes
  const staticRoutes = [
    "",
    "/products",
    "/packages",
    "/contact",
    "/orders",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 1.0,
  }));

  try {
    // 2. Dynamic Product Routes
    const { data: products } = await api.get("/products");
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`, // or product.slug
      lastModified: product.updatedAt || new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    // 3. Dynamic Package Routes
    const { data: packages } = await api.get("/packages");
    const packageRoutes = packages.map((pkg) => ({
      url: `${baseUrl}/packages/${pkg.id}`,
      lastModified: pkg.updatedAt || new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.9,
    }));

    return [...staticRoutes, ...productRoutes, ...packageRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes; // Fallback to static routes if API fails
  }
}
