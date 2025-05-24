'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SearchInput from '@/components/SearchInput';
import FilterButtons from '@/components/FilterButtons';
import MemberCard from '@/components/MemberCard';
import Button from '@/components/Button';
import InviteMemberModal from '@/components/InviteMemberModal';
import { getAllUserMembers, getMemberPaymentStatus } from '@/lib/actions/memberActions';
import type { MemberWithUser } from '@/types';

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'paid', label: 'Paid' },
  { id: 'pending', label: 'Pending' },
  { id: 'overdue', label: 'Overdue' },
];

interface MemberWithPaymentStatus extends MemberWithUser {
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  trustScore: number;
  group_name?: string;
}

export default function Members() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [members, setMembers] = useState<MemberWithPaymentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Load members on component mount
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllUserMembers();
      if (response.success && response.data) {
        // Fetch payment status for each member
        const membersWithStatus = await Promise.all(
          response.data.map(async (member) => {
            const paymentResponse = await getMemberPaymentStatus(member.user_id);
            const paymentStatus = paymentResponse.success ? 
              paymentResponse.data?.status || 'Pending' : 'Pending';
            
            return {
              ...member,
              paymentStatus,
              trustScore: Math.floor(Math.random() * 40) + 60, // Generate random trust score 60-100
              group_name: (member as any).group_name
            };
          })
        );
        
        setMembers(membersWithStatus);
      } else {
        setError(response.error || 'Failed to load members');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Filter members based on search query and active filter
  const filteredMembers = members.filter((member) => {
    const matchesSearch = (member.user.name || member.user.email)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    
    // Filter by payment status
    return matchesSearch && (
      (activeFilter === 'paid' && member.paymentStatus === 'Paid') ||
      (activeFilter === 'pending' && member.paymentStatus === 'Pending') ||
      (activeFilter === 'overdue' && member.paymentStatus === 'Overdue')
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
