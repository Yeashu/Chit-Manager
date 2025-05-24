'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#181f16] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#232b1c] rounded-2xl p-8 shadow-xl border border-[#2a3424]">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <span className="bg-[#232b1c] rounded-full w-8 h-8 flex items-center justify-center mr-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="#a3e635" />
                </svg>
              </span>
              <span className="text-xl font-bold">FundEase</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
            <p className="text-[#cbd5c0] text-sm">Join thousands of users managing their chit funds with ease</p>
          </div>

          <form className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-[#cbd5c0] mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 bg-[#1a2318] border border-[#2a3424] rounded-lg text-white placeholder-[#4a5a46] focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent transition"
                placeholder="John Doe"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-[#cbd5c0] mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-[#1a2318] border border-[#2a3424] rounded-lg text-white placeholder-[#4a5a46] focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-[#cbd5c0] mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 bg-[#1a2318] border border-[#2a3424] rounded-lg text-white placeholder-[#4a5a46] focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[#cbd5c0] mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 bg-[#1a2318] border border-[#2a3424] rounded-lg text-white placeholder-[#4a5a46] focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-2"
            >
              <button
                type="submit"
                className="w-full bg-[#a3e635] text-[#181f16] font-semibold py-3 px-4 rounded-lg hover:bg-[#b7f36b] transition duration-300"
              >
                Create Account
              </button>
            </motion.div>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm text-[#cbd5c0]"
          >
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[#a3e635] hover:underline">
              Sign in
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#a3e635]/10 to-transparent rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-tl from-[#81c784]/10 to-transparent rounded-full filter blur-3xl"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
