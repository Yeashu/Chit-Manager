"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import KeyFeatures from "@/components/KeyFeatures";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#181f16] text-white flex flex-col font-[family-name:var(--font-geist-sans)]">
      <Header />
      <HeroSection />
      <KeyFeatures />
      <Testimonials />
      <Footer />
    </div>
  );
}
