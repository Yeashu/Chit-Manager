'use client';

import { useState, useEffect } from 'react';
import { initiatePayment } from '@/lib/razorpay';

type Plan = {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  recommended: boolean;
};

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    duration: 'month',
    features: [
      'Up to 5 groups',
      'Basic analytics',
      'Email support',
      '5GB storage'
    ],
    recommended: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    duration: 'month',
    features: [
      'Up to 20 groups',
      'Advanced analytics',
      'Priority support',
      '50GB storage',
      'API access'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    duration: 'month',
    features: [
      'Unlimited groups',
      'Advanced analytics',
      '24/7 support',
      '1TB storage',
      'API access',
      'Custom features'
    ],
    recommended: false
  }
];

export default function SubscriptionPlans() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: Plan) => {
    if (loading) return;
    
    setLoading(true);
    setSelectedPlan(plan.id);

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
          setLoading(false);
          setSelectedPlan(null);
        },
        onClose: () => {
          setLoading(false);
          setSelectedPlan(null);
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mt-3 text-lg text-gray-600">Select the plan that works best for you</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`relative p-6 rounded-lg border-2 ${
                plan.recommended 
                  ? 'border-indigo-600 bg-indigo-50 scale-105' 
                  : 'border-gray-200 bg-white hover:border-indigo-300'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-center mb-4">{plan.name}</h3>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold">₹{plan.price}</span>
                <span className="text-gray-600">/{plan.duration}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading && selectedPlan === plan.id}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  plan.recommended
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                } ${
                  loading && selectedPlan === plan.id ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading && selectedPlan === plan.id ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
