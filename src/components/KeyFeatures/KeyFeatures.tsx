import { motion } from "framer-motion";

const features = [
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
];

const KeyFeatures = () => (
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
        {features.map((feature, index) => (
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
);

export default KeyFeatures;
