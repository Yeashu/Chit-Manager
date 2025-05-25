'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import Link from 'next/link';
import { pageAnimations, hoverAnimations } from '@/utils/animations';

export default function Home() {
  // Mock data for the dashboard overview
  const dashboardData = {
    totalGroups: 6,
    activeGroups: 5,
    upcomingAuctions: 2,
    totalContributions: '₹12,450',
    recentActivity: [
      {
        type: 'member',
        content: 'You were invited to Cooperative Savings Initiative',
        timeAgo: '1 day ago',
      },
      {
        type: 'auction',
        content: 'Community Fund Alpha auction is in 2 days',
        timeAgo: '6 hours ago',
      },
      {
        type: 'payment',
        content: 'Your payment of ₹200 to Shared Prosperity Group was received',
        timeAgo: '3 days ago',
      },
    ],
    quickActions: [
      { name: 'Create New Group', href: '/CreateGroup', icon: '➕' },
      { name: 'Join Upcoming Auction', href: '/Auctions', icon: '🔨' },
      { name: 'View Payment History', href: '/payments', icon: '💳' },
      { name: 'Invite Members', href: '/Members', icon: '👥' },
    ]
  };

  return (
    <div className="flex min-h-screen bg-[#181f16] text-white font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <Sidebar activeItem="dashboard" />
      
      <div className="relative flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#a3e635]/10 to-transparent rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-tl from-[#81c784]/10 to-transparent rounded-full filter blur-3xl"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a3e635] to-[#81c784]">
            Dashboard
          </h1>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button href="/CreateGroup">Create Group</Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={pageAnimations.container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { value: dashboardData.totalGroups, label: 'Total Groups' },
            { value: dashboardData.activeGroups, label: 'Active Groups' },
            { value: dashboardData.upcomingAuctions, label: 'Upcoming Auctions' },
            { value: dashboardData.totalContributions, label: 'Total Contributions' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              variants={pageAnimations.item}
              className="bg-[#232b1c] border border-[#2a3424] p-6 rounded-xl hover:border-[#a3e635]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#a3e635]/5"
            >
              <div className="text-4xl font-bold mb-2 text-[#a3e635]">{stat.value}</div>
              <div className="text-[#cbd5c0]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          variants={pageAnimations.container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
        >
          <motion.div 
            variants={pageAnimations.item}
            className="relative"
          >
            <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
            <div className="bg-[#232b1c] border border-[#2a3424] rounded-xl p-6 backdrop-blur-sm">
              <ul className="space-y-5">
                {dashboardData.recentActivity.map((activity, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start group"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'member' ? (
                        <div className="w-9 h-9 rounded-full bg-[#a3e635]/10 flex items-center justify-center group-hover:bg-[#a3e635]/20 transition-colors">
                          <span className="text-[#a3e635] text-sm">👤</span>
                        </div>
                      ) : activity.type === 'auction' ? (
                        <div className="w-9 h-9 rounded-full bg-[#60a5fa]/10 flex items-center justify-center group-hover:bg-[#60a5fa]/20 transition-colors">
                          <span className="text-[#60a5fa] text-sm">🔨</span>
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#a78bfa]/10 flex items-center justify-center group-hover:bg-[#a78bfa]/20 transition-colors">
                          <span className="text-[#a78bfa] text-sm">💸</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-white group-hover:text-[#a3e635] transition-colors">
                        {activity.content}
                      </p>
                      <p className="text-sm text-[#cbd5c0]">{activity.timeAgo}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#a3e635]/10 rounded-full filter blur-xl -z-10"></div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          variants={pageAnimations.item}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold mb-6 text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.quickActions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={hoverAnimations.lift}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link href={action.href}>
                  <div className="bg-[#232b1c] border border-[#2a3424] p-5 rounded-xl hover:border-[#a3e635]/30 transition-all duration-300 group h-full">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                        {action.icon}
                      </div>
                      <div className="font-medium group-hover:text-[#a3e635] transition-colors">
                        {action.name}
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}