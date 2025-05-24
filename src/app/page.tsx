"use client";

import { useEffect } from 'react';
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import KeyFeatures from "@/components/KeyFeatures";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  // Smooth scroll handling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = 80; // Height of your fixed header
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without scrolling
          window.history.pushState(null, '', targetId);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#181f16] text-white flex flex-col font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="pt-16"> {/* Add padding to account for fixed header */}
        <HeroSection />
        <KeyFeatures />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}