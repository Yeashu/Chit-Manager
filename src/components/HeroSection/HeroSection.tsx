import { motion } from "framer-motion";
import Image from "next/image";

const HeroSection = () => (
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
            </span><br />
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
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
          whileHover={{ 
            scale: 1.05, 
            y: -10,
            transition: { duration: 0.3 }
          }}
          className="relative transform-gpu"
        >
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#a3e635]/30 to-[#81c784]/30 rounded-3xl filter blur-xl scale-110 animate-pulse"></div>
          
          <div className="relative z-10 bg-gradient-to-br from-[#232b1c] to-[#1a2318] rounded-3xl p-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_80px_rgba(163,230,53,0.15)]">
            <div className="relative aspect-video rounded-2xl overflow-hidden scale-110 origin-center">
                <div className="w-full h-full bg-gradient-to-br from-[#2a3424] to-[#1a2318] flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/finance-dashboard-preview.png" 
                    alt="Finance Dashboard Preview" 
                    fill
                    className="object-cover opacity-95 hover:opacity-100 transition-opacity duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://images.unsplash.com/photo-1554224155-3a58922a22c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                </div>
            </div>
            
            {/* Enhanced floating elements with bigger scale */}
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.1 }}
              className="absolute -top-6 -right-6 bg-gradient-to-r from-[#a3e635] to-[#94d82d] p-4 rounded-2xl shadow-[0_15px_35px_rgba(163,230,53,0.4)] scale-110"
            >
              <div className="text-[#181f16] font-bold">
                <div className="text-xs opacity-80">Total Value</div>
                <div className="text-lg">$12,450</div>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 12, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              whileHover={{ scale: 1.1 }}
              className="absolute -bottom-6 -left-6 bg-gradient-to-r from-white to-gray-100 p-4 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.3)] scale-110"
            >
              <div className="text-[#181f16] font-bold">
                <div className="text-xs opacity-70">Active Plans</div>
                <div className="text-lg">3</div>
              </div>
            </motion.div>
            
            {/* Enhanced decorative elements */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -z-10 w-40 h-40 bg-gradient-to-r from-[#a3e635]/30 to-[#81c784]/30 rounded-full -top-16 -left-16 filter blur-2xl"
            ></motion.div>
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute -z-10 w-32 h-32 bg-gradient-to-l from-[#81c784]/25 to-[#a3e635]/25 rounded-full -bottom-10 -right-10 filter blur-xl"
            ></motion.div>
            
            {/* Additional glow rings */}
            <div className="absolute -z-20 inset-0 rounded-3xl bg-gradient-to-r from-[#a3e635]/20 to-[#81c784]/20 scale-125 filter blur-3xl"></div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
