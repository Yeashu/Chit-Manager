'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SearchInput from '@/components/SearchInput';
import FilterButtons from '@/components/FilterButtons';
import MemberCard from '@/components/MemberCard';
import Button from '@/components/Button';

const filterOptions = [
  { id: 'online', label: 'Online' },
  { id: 'paid', label: 'Paid' },
  { id: 'pending', label: 'Pending' },
];

// Mock data for members
const mockMembers = [
  {
    id: '1',
    name: 'Sophia Clark',
    avatarUrl: '/avatars/avatar1.png',
    trustScore: 95,
    paymentStatus: 'Paid' as const,
  },
  {
    id: '2',
    name: 'Ethan Miller',
    avatarUrl: '/avatars/avatar2.png',
    trustScore: 88,
    paymentStatus: 'Pending' as const,
  },
  {
    id: '3',
    name: 'Olivia Davis',
    avatarUrl: '/avatars/avatar3.png',
    trustScore: 92,
    paymentStatus: 'Paid' as const,
  },
  {
    id: '4',
    name: 'Noah Wilson',
    avatarUrl: '/avatars/avatar4.png',
    trustScore: 75,
    paymentStatus: 'Overdue' as const,
  },
  {
    id: '5',
    name: 'Ava Thompson',
    avatarUrl: '/avatars/avatar5.png',
    trustScore: 98,
    paymentStatus: 'Paid' as const,
  },
  {
    id: '6',
    name: 'Liam Garcia',
    avatarUrl: '/avatars/avatar6.png',
    trustScore: 80,
    paymentStatus: 'Paid' as const,
  },
];

export default function Members() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('online');

  // Filter members based on search query and active filter
  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'online') return matchesSearch;
    
    // Filter by payment status
    return matchesSearch && (
      (activeFilter === 'paid' && member.paymentStatus === 'Paid') ||
      (activeFilter === 'pending' && member.paymentStatus === 'Pending')
    );
  });

  return (
    <div className="flex min-h-screen bg-[#1c2c1c] text-white">
      <Sidebar activeItem="members" />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Members</h1>
          <Button>Invite New Members</Button>
        </div>
        
        <div className="mb-6">
          <SearchInput 
            placeholder="Search members" 
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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              name={member.name}
              avatarUrl={member.avatarUrl}
              trustScore={member.trustScore}
              paymentStatus={member.paymentStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
