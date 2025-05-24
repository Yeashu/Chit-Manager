'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import Image from 'next/image';
import Link from 'next/link';
import { pageAnimations, hoverAnimations } from '@/utils/animations';

const filterOptions = [
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'all', label: 'All' },
];

// Mock data for groups
const mockGroups = [
  {
    id: '1',
    name: 'Community Fund Alpha',
    memberCount: 12,
    nextAuctionDate: '2024-07-15',
    imagePattern: 'pattern1' as const,
  },
  {
    id: '2',
    name: 'Neighborhood Savings Circle',
    memberCount: 8,
    nextAuctionDate: '2024-08-01',
    imagePattern: 'pattern2' as const,
  },
  {
    id: '3',
    name: 'Shared Prosperity Group',
    memberCount: 15,
    nextAuctionDate: '2024-07-20',
    imagePattern: 'pattern3' as const,
  },
  {
    id: '4',
    name: 'Mutual Aid Collective',
    memberCount: 10,
    nextAuctionDate: '2024-07-25',
    imagePattern: 'pattern4' as const,
  },
  {
    id: '5',
    name: 'Cooperative Savings Initiative',
    memberCount: 14,
    nextAuctionDate: '2024-08-10',
    imagePattern: 'pattern5' as const,
  },
  {
    id: '6',
    name: 'Community Investment Pool',
    memberCount: 9,
    nextAuctionDate: '2024-07-30',
    imagePattern: 'pattern1' as const,
  },
];

export default function MyGroups() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('active');

  // Filter groups based on search query and active filter
  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'all') return matchesSearch;
    
    // In a real app, you would filter by active/completed status
    // This is just a mock implementation
    const isActive = ['1', '2', '3', '4', '5', '6'].includes(group.id);
    const isCompleted = !isActive;
    
    return matchesSearch && 
      ((activeFilter === 'active' && isActive) || 
       (activeFilter === 'completed' && isCompleted));
  });

  return (
    <div className="flex min-h-screen bg-[#181f16] text-white font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <Sidebar activeItem="groups" />
      
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
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a3e635] to-[#81c784] mb-2">
              My Groups
            </h1>
            <p className="text-[#cbd5c0]">Manage and track all your chit fund groups</p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button href="/CreateGroup">Create Group</Button>
          </motion.div>
        </motion.div>
        
        {/* Search and Filter */}
        <motion.div 
          variants={pageAnimations.container}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#232b1c] border border-[#2a3424] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent text-white placeholder-[#6b8066]"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6b8066]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {filterOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => setActiveFilter(option.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === option.id
                      ? 'bg-[#a3e635] text-[#181f16]'
                      : 'bg-[#2a3424] text-[#cbd5c0] hover:bg-[#364a36]'
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={pageAnimations.container}
          initial="hidden"
          animate="show"
        >
          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    variants={pageAnimations.item}
                    whileHover={hoverAnimations.lift}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link href={`/GroupDetail/${group.id}`}>
                      <div className="bg-[#232b1c] border border-[#2a3424] rounded-xl overflow-hidden h-full flex flex-col hover:border-[#a3e635]/30 transition-all duration-300 group">
                        <div className="h-32 bg-gradient-to-r from-[#2a3424] to-[#1a2318] relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-[#a3e635]/10 flex items-center justify-center text-2xl">
                              👥
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-[#a3e635] transition-colors">
                            {group.name}
                          </h3>
                          <div className="mt-4 pt-4 border-t border-[#2a3424] text-sm text-[#cbd5c0]">
                            <div className="flex items-center justify-between mb-2">
                              <span>Members</span>
                              <span className="font-medium">{group.memberCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Next Auction</span>
                              <span className="font-medium text-[#a3e635]">
                                {new Date(group.nextAuctionDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-48 h-48 md:w-64 md:h-64 relative mb-8">
                <div className="absolute inset-0 bg-[#a3e635]/10 rounded-full flex items-center justify-center">
                  <div className="text-6xl md:text-7xl">👥</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">No groups yet</h3>
              <p className="text-[#cbd5c0] max-w-md mb-6">
                You haven't joined or created any groups yet. Start by creating your first group and inviting members to join.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button href="/CreateGroup">Create Your First Group</Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}