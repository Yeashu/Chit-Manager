'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#181f16] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <div className="bg-[#232b1c] rounded-2xl p-8 shadow-xl border border-[#2a3424]">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <span className="bg-[#232b1c] rounded-full w-8 h-8 flex items-center justify-center mr-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="#a3e635" />
                </svg>
              </span>
              <span className="text-xl font-bold">FundEase</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2 text-red-400">Something went wrong</h1>
            <p className="text-[#cbd5c0] text-sm">
              We encountered an error while processing your request.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full bg-[#a3e635] text-[#181f16] font-semibold py-3 px-4 rounded-lg hover:bg-[#b7f36b] transition duration-300 flex items-center justify-center"
            >
              Go to Login
            </Link>
            
            <Link
              href="/"
              className="w-full border border-[#2a3424] text-[#cbd5c0] font-semibold py-3 px-4 rounded-lg hover:bg-[#2a3424] transition duration-300 flex items-center justify-center"
            >
              Go to Home
            </Link>
          </div>
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
