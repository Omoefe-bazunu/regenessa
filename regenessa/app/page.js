import AboutSection from "@/components/About";
import CertSlider from "@/components/CertSlider";
import ConsultationCTA from "@/components/ContactSection";
import FAQSection from "@/components/FaqSection";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Reviews from "@/components/Reviews";
import WellnessBar from "@/components/WellnessBar";
import React from "react";

function page() {
  return (
    <div>
      <Hero />
      <WellnessBar />
      <ProductSection />
      <AboutSection />
      <CertSlider />
      <Reviews />
      <FAQSection />
      <ConsultationCTA />
    </div>
  );
}

export default page;
