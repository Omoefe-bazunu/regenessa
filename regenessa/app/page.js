import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import WellnessBar from "@/components/WellnessBar";
// import RecentProducts from "@/components/RecentProducts";
// import About from "@/components/About";
// import Contact from "@/components/Contact";
// import Reviews from "@/components/Reviews";
import React from "react";

function page() {
  return (
    <div>
      <Hero />
      <WellnessBar />
      <ProductSection />
      {/* <RecentProducts />
      <About />
      <Reviews />
      <Contact /> */}
    </div>
  );
}

export default page;
