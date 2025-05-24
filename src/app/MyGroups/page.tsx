'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SearchInput from '@/components/SearchInput';
import FilterButtons from '@/components/FilterButtons';
import GroupCard from '@/components/GroupCard';
import Button from '@/components/Button';
import Image from 'next/image';

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
    <div className="flex min-h-screen bg-[#1c2c1c] text-white">
      <Sidebar activeItem="groups" />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Groups</h1>
          <Button href="/CreateGroup">Create Group</Button>
        </div>
        
        <div className="mb-6">
          <SearchInput 
            placeholder="Search groups" 
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        
        <div className="mb-8">
          <FilterButtons 
            options={filterOptions}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
        
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                memberCount={group.memberCount}
                nextAuctionDate={group.nextAuctionDate}
                imagePattern={group.imagePattern}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 h-64 relative mb-6">
              <Image 
                src="/patterns/empty-state.png" 
                alt="No groups yet" 
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <h3 className="text-xl font-medium mb-2">No groups yet</h3>
            <p className="text-gray-400 mb-6 text-center">
              Start by creating your first group and inviting members to join.
            </p>
            <Button href="/CreateGroup">Create Group</Button>
          </div>
        )}
      </div>
    </div>
  );
}