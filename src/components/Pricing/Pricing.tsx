import { motion } from "framer-motion";
import { initiatePayment } from "@/lib/razorpay";
import { useState } from "react";

const plans = [
  {
    name: 'Starter',
    price: 0,
    description: 'Perfect for individuals getting started with chit funds',
    features: [
      'Up to 2 active chit groups',
      'Basic analytics',
      'Email support',
      'Mobile app access'
    ],
    popular: false
  },
  {
    name: 'Pro',
    price: 9.99,
    description: 'Ideal for small chit fund groups and communities',
    features: [
      'Up to 10 active chit groups',
      'Advanced analytics',
      'Priority email & chat support',
      'Mobile app access',
      'Custom reports',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 49.99,
    description: 'For large chit fund organizations',
    features: [
      'Unlimited chit groups',
      'Advanced analytics & insights',
      '24/7 dedicated support',
      'Custom integrations',
      'Dedicated account manager',
      'SLA & priority support'
    ],
    popular: false
  }
];

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (loading) return;
    setLoading(plan.name);

    try {
      await initiatePayment({
        amount: plan.price,
        description: `Subscription for ${plan.name} Plan`,
        onSuccess: (response) => {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          window.location.href = '/dashboard';
        },
        onError: (error) => {
          alert(`Payment failed: ${error?.description || 'Unknown error'}`);
          setLoading(null);
        },
        onClose: () => {
          setLoading(null);
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gradient-to-b from-[#1a2318] to-[#181f16] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#a3e635] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#81c784] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-[#4ade80] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-[#cbd5c0] max-w-3xl mx-auto">Choose the perfect plan for your chit fund management needs. No hidden fees, cancel anytime.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-[#232b1c] border ${
                plan.popular ? 'border-[#a3e635]' : 'border-[#2a3424]'
              } rounded-xl p-8 flex flex-col h-full`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#a3e635] text-[#181f16] text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-[#cbd5c0] mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-[#cbd5c0]">/month</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-[#a3e635] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#cbd5c0]">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.name}
                className={`mt-auto w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-[#a3e635] text-[#181f16] hover:bg-[#b7f36b]'
                    : 'bg-[#2a3424] text-white hover:bg-[#3a4532]'
                } ${loading === plan.name ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading === plan.name ? 'Processing...' : plan.popular ? 'Get Started' : 'Choose Plan'}
              </button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center text-[#cbd5c0]">
          <p>Need a custom solution? <a href="#contact" className="text-[#a3e635] hover:underline">Contact our sales team</a></p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
