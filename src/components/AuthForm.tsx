'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type AuthFormProps = {
  type: 'login' | 'signup';
};

export default function AuthForm({ type }: AuthFormProps) {
  const isLogin = type === 'login';
  const title = isLogin ? 'Welcome Back' : 'Create an Account';
  const subtitle = isLogin 
    ? 'Sign in to your account to continue' 
    : 'Join thousands of users managing their chit funds with ease';
  const buttonText = isLogin ? 'Sign In' : 'Create Account';
  const footerText = isLogin ? "Don't have an account?" : 'Already have an account?';
  const footerLink = isLogin ? '/signup' : '/login';
  const footerLinkText = isLogin ? 'Sign up' : 'Sign in';

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
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-[#cbd5c0] text-sm">{subtitle}</p>
          </div>

          <form className="space-y-6">
            {!isLogin && (
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
            )}

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isLogin ? 0.1 : 0.2 }}
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
              transition={{ delay: isLogin ? 0.2 : 0.3 }}
            >
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-[#cbd5c0]">
                  Password
                </label>
                {isLogin && (
                  <Link href="/forgot-password" className="text-xs text-[#a3e635] hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                className="w-full px-4 py-3 bg-[#1a2318] border border-[#2a3424] rounded-lg text-white placeholder-[#4a5a46] focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </motion.div>

            {!isLogin && (
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
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isLogin ? 0.3 : 0.5 }}
              className="pt-2"
            >
              <button
                type="submit"
                className="w-full bg-[#a3e635] text-[#181f16] font-semibold py-3 px-4 rounded-lg hover:bg-[#b7f36b] transition duration-300 flex items-center justify-center"
              >
                {buttonText}
              </button>
            </motion.div>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: isLogin ? 0.4 : 0.6 }}
            className="mt-6 text-center text-sm text-[#cbd5c0]"
          >
            {footerText}{' '}
            <Link href={footerLink} className="font-medium text-[#a3e635] hover:underline">
              {footerLinkText}
            </Link>
          </motion.div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a3424]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#232b1c] text-[#cbd5c0]">Or continue with</span>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isLogin ? 0.5 : 0.7 }}
            className="grid grid-cols-2 gap-3"
          >
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-[#2a3424] rounded-lg shadow-sm bg-[#1a2318] text-sm font-medium text-[#cbd5c0] hover:bg-[#232b1c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#232b1c] focus:ring-[#a3e635]/50 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.16 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-[#2a3424] rounded-lg shadow-sm bg-[#1a2318] text-sm font-medium text-[#cbd5c0] hover:bg-[#232b1c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#232b1c] focus:ring-[#a3e635]/50 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </button>
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
