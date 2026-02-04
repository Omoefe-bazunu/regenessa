import AboutSection from "@/components/About";
import ConsultationCTA from "@/components/ContactSection";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Reviews from "@/components/Reviews";
import WellnessBar from "@/components/WellnessBar";
// import RecentProducts from "@/components/RecentProducts";
// import Contact from "@/components/Contact";
// import Reviews from "@/components/Reviews";
import React from "react";

function page() {
  return (
    <div>
      <Hero />
      <WellnessBar />
      <ProductSection />
      <AboutSection />
      <Reviews />
      <ConsultationCTA />
    </div>
  );
}

export default page;
