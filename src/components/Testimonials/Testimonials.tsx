import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
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
];

const Testimonials = () => (
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
        {testimonials.map((testimonial, index) => (
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
);

export default Testimonials;
