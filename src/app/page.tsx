"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#181f16] text-white flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-4 border-b border-[#232b1c] bg-[#181f16]/90 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold flex items-center gap-2">
            <span className="bg-[#232b1c] rounded-full w-6 h-6 flex items-center justify-center">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#a3e635" /></svg>
            </span>
            FundEase
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#" className="hover:text-[#a3e635]">About</a>
          <a href="#" className="hover:text-[#a3e635]">How it Works</a>
          <a href="#" className="hover:text-[#a3e635]">Pricing</a>
        </nav>
        <div className="flex gap-2">
          <Link href="/signup" className="bg-[#a3e635] text-[#181f16] font-semibold px-5 py-2 rounded-full hover:bg-[#b7f36b] transition">Sign Up</Link>
          <Link href="/login" className="bg-[#232b1c] text-white px-5 py-2 rounded-full hover:bg-[#2e3a23] transition">Login</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 md:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#a3e635]/10 to-transparent rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-tl from-[#81c784]/10 to-transparent rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a3e635] to-[#81c784]">
                  Secure, Transparent, and Easy
                </span>
                <br />
                <span className="text-white">Chit Fund Management</span>
              </h1>
              <p className="text-lg md:text-xl text-[#cbd5c0] mb-8 max-w-lg mx-auto md:mx-0">
                Experience the future of chit fund management with enhanced security, real-time transparency, and an intuitive platform that puts you in control.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(163, 230, 53, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#a3e635] text-[#181f16] font-semibold px-8 py-3 rounded-full hover:bg-[#b7f36b] transition-all duration-300"
                >
                  Get Started
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-transparent border-2 border-[#a3e635] text-[#a3e635] font-semibold px-8 py-3 rounded-full hover:bg-[#a3e635]/10 transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-[#232b1c] rounded-2xl p-1 shadow-2xl">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#2a3424] to-[#1a2318] flex items-center justify-center text-[#a3e635]/50">
                    <span className="text-lg">Finance Dashboard Preview</span>
                  </div>
                </div>
                {/* Floating elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-4 bg-[#a3e635] p-3 rounded-xl shadow-lg"
                >
                  <div className="text-[#181f16] font-bold text-sm">
                    <div className="text-xs opacity-70">Total Value</div>
                    <div>$12,450</div>
                  </div>
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 10, 0] }} 
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-lg"
                >
                  <div className="text-[#181f16] font-bold text-sm">
                    <div className="text-xs opacity-70">Active Plans</div>
                    <div>3</div>
                  </div>
                </motion.div>
                {/* Decorative elements */}
                <div className="absolute -z-10 w-32 h-32 bg-[#a3e635]/20 rounded-full -top-10 -left-10"></div>
                <div className="absolute -z-10 w-20 h-20 bg-[#81c784]/20 rounded-full -bottom-5 -right-5"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#181f16] to-[#1a2318] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FundEase?</h2>
            <p className="text-lg text-[#cbd5c0] max-w-3xl mx-auto">Experience the future of chit fund management with our advanced platform.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12 text-[#a3e635]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Enhanced Security",
                description: "Military-grade encryption and multi-factor authentication protect your funds and data with bank-level security measures."
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-[#a3e635]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Complete Transparency",
                description: "Real-time transaction tracking and detailed analytics provide full visibility into every aspect of your chit funds."
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-[#a3e635]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Lightning Fast",
                description: "Our optimized platform ensures quick and seamless management of your chit funds, saving you time and effort."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                className="bg-[#232b1c] rounded-2xl p-8 flex flex-col items-center text-center hover:bg-[#2a3424] transition-all duration-300 hover:border hover:border-[#a3e635]/30"
              >
                <div className="mb-6 p-4 bg-[#2a3424] rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#cbd5c0] text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-[#cbd5c0] max-w-3xl mx-auto">Join the growing community of satisfied users who trust FundEase for their chit fund management needs.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Miller",
                role: "Chit Fund Member",
                avatar: "https://randomuser.me/api/portraits/women/43.jpg",
                testimonial: "FundEase has transformed how I manage my chit funds. The security features give me peace of mind, and the transparency is unmatched.",
                rating: 5
              },
              {
                name: "David Lee",
                role: "Chit Fund Organizer",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                testimonial: "I appreciate the ease of use and the ability to track all transactions in real-time. FundEase is a game-changer for our community.",
                rating: 5
              },
              {
                name: "Emily Chen",
                role: "Chit Fund Member",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                testimonial: "The platform is incredibly intuitive, making it simple to manage my chit funds even on the go. Highly recommended!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#232b1c] rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all duration-300 hover:border hover:border-[#a3e635]/20"
              >
                <div className="relative mb-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#a3e635]/20">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      width={96} 
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#a3e635] w-8 h-8 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#181f16]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 text-[#cbd5c0] text-sm italic">"{testimonial.testimonial}"</p>
                <div>
                  <div className="font-semibold text-[#a3e635]">{testimonial.name}</div>
                  <div className="text-xs text-[#cbd5c0]">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#a3e635]/10 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#81c784]/10 rounded-full filter blur-3xl -z-10"></div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#232b1c] py-6 mt-auto bg-[#181f16] flex flex-col md:flex-row items-center justify-between px-8 text-[#cbd5c0] text-sm gap-2">
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#a3e635]">About</a>
          <a href="#" className="hover:text-[#a3e635]">Help</a>
          <a href="#" className="hover:text-[#a3e635]">Contact</a>
        </div>
        <div className="text-xs">© 2024 FundEase. All rights reserved.</div>
      </footer>
    </div>
  );
}
