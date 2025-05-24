import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: (
      <svg className="w-12 h-12 text-[#a3e635]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    title: "Create Your Group",
    description: "Set up your chit fund group with customized rules, member limits, and contribution amounts. Invite trusted members to join your secure group."
  },
  {
    step: "02",
    icon: (
      <svg className="w-12 h-12 text-[#a3e635]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
    title: "Make Contributions",
    description: "Members contribute their monthly amounts securely through our platform. Track all payments with automated reminders and transparent records."
  },
  {
    step: "03",
    icon: (
      <svg className="w-12 h-12 text-[#a3e635]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Participate in Auctions",
    description: "Join monthly auctions to bid for the collected fund. Our transparent bidding system ensures fair participation and real-time updates."
  },
  {
    step: "04",
    icon: (
      <svg className="w-12 h-12 text-[#a3e635]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Track & Manage",
    description: "Monitor your group's progress with detailed analytics, payment histories, and automated reports. Stay informed with real-time notifications."
  }
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-16 md:py-24 bg-[#1a2318] relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#1a2318] to-[#181f16] -z-10"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-lg text-[#cbd5c0] max-w-3xl mx-auto">
          Get started with FundEase in just four simple steps. Our streamlined process makes chit fund management effortless and secure.
        </p>
      </motion.div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            className="bg-[#232b1c] rounded-2xl p-6 flex flex-col items-center text-center hover:bg-[#2a3424] transition-all duration-300 hover:border hover:border-[#a3e635]/30 relative"
          >
            {/* Step Number */}
            <div className="absolute -top-4 -right-4 bg-[#a3e635] text-[#181f16] text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
              {step.step}
            </div>
            
            {/* Icon */}
            <div className="mb-6 p-4 bg-[#2a3424] rounded-full">
              {step.icon}
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-[#cbd5c0] text-sm leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Additional Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <p className="text-[#cbd5c0] mb-6">Ready to start managing your chit funds the smart way?</p>
        <Link href="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#a3e635] text-[#181f16] px-8 py-3 rounded-lg font-semibold hover:bg-[#94d82d] transition-colors duration-300"
          >
            Get Started Today
          </motion.button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HowItWorks;
