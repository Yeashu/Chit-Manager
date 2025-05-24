import { motion } from "framer-motion";

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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 bg-[#232b1c] rounded-2xl p-1 shadow-2xl">
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-[#2a3424] to-[#1a2318] flex items-center justify-center overflow-hidden">
                <img 
                  src="/finance-dashboard-preview.png" 
                  alt="Finance Dashboard Preview" 
                  className="w-full h-full object-cover opacity-90"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://images.unsplash.com/photo-1554224155-3a58922a22c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                  }}
                />
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
);

export default HeroSection;
