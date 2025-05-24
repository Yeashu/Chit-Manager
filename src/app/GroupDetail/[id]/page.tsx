'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import { getGroupDetails, updateGroup, deleteGroup } from '@/lib/actions/groupActions';
import { getGroupMembers, removeMemberFromGroup, updateMemberRole, leaveGroup } from '@/lib/actions/memberActions';
import type { ChitGroupWithCreator, MemberWithUser } from '@/types';
import { useRouter } from 'next/navigation';

interface GroupDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default function GroupDetail({ params }: GroupDetailProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [groupData, setGroupData] = useState<ChitGroupWithCreator | null>(null);
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch group details and members
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch group details
        const groupResponse = await getGroupDetails(id);
        if (!groupResponse.data) {
          setError(groupResponse.error || 'Failed to fetch group details');
          return;
        }
        setGroupData(groupResponse.data);

        // Fetch group members
        const membersResponse = await getGroupMembers(id);
        if (membersResponse.success && membersResponse.data) {
          setMembers(membersResponse.data);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching group data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    
    try {
      setActionLoading(true);
      const response = await leaveGroup(id);
      
      if (response.success) {
        alert(response.message);
        router.push('/MyGroups');
      } else {
        alert(response.error);
      }
    } catch (err) {
      alert('Failed to leave group');
      console.error('Error leaving group:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      setActionLoading(true);
      const response = await removeMemberFromGroup(id, memberId);
      
      if (response.success) {
        // Remove member from local state
        setMembers(prev => prev.filter(m => m.id !== memberId));
        alert(response.message);
      } else {
        alert(response.error);
      }
    } catch (err) {
      alert('Failed to remove member');
      console.error('Error removing member:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#1c2c1c] text-white">
        <Sidebar activeItem="groups" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading group details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !groupData) {
    return (
      <div className="flex min-h-screen bg-[#1c2c1c] text-white">
        <Sidebar activeItem="groups" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Group not found'}</p>
            <Button onClick={() => router.push('/MyGroups')}>
              Back to My Groups
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#1c2c1c] text-white">
      <Sidebar activeItem="groups" />
      
      <div className="flex-1">
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white mr-3">
                {groupData.name.charAt(0)}
              </div>
              <h1 className="text-2xl font-bold">{groupData.name}</h1>
            </div>
          </div>
          <div className="text-sm text-gray-400 mb-6">
            {groupData.status} • {members.length} Members • Duration: {groupData.duration_months} months
          </div>
          
          <div className="border-b border-gray-700 mb-6">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`mr-6 py-3 border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`mr-6 py-3 border-b-2 ${
                  activeTab === 'members'
                    ? 'border-green-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Members
              </button>
              <button
                onClick={() => setActiveTab('auctions')}
                className={`mr-6 py-3 border-b-2 ${
                  activeTab === 'auctions'
                    ? 'border-green-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Auctions
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`mr-6 py-3 border-b-2 ${
                  activeTab === 'payments'
                    ? 'border-green-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Payments
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`mr-6 py-3 border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-green-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
          
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Group Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#2a3a2a] rounded-lg p-4">
                  <div className="text-gray-400 mb-1">Monthly Contribution</div>
                  <div className="text-xl font-bold">${groupData.monthly_contribution}</div>
                  <div className="text-sm text-gray-400">Per member contribution</div>
                  <div className="mt-4 h-24 bg-[#f8ece0] rounded-lg flex items-center justify-center">
                    <Image 
                      src="/patterns/coins.png" 
                      alt="Fund visualization" 
                      width={80} 
                      height={80}
                    />
                  </div>
                </div>
                
                <div className="bg-[#2a3a2a] rounded-lg p-4">
                  <div className="text-gray-400 mb-1">Total Members</div>
                  <div className="text-xl font-bold">{members.length} / {groupData.total_members}</div>
                  <div className="text-sm text-gray-400">Current vs target members</div>
                  <div className="mt-4 h-24 bg-[#f8ece0] rounded-lg flex items-center justify-center">
                    <Image 
                      src="/patterns/savings.png" 
                      alt="Members visualization" 
                      width={80} 
                      height={80}
                    />
                  </div>
                </div>
                
                <div className="bg-[#2a3a2a] rounded-lg p-4">
                  <div className="text-gray-400 mb-1">Duration</div>
                  <div className="text-xl font-bold">{groupData.duration_months} months</div>
                  <div className="text-sm text-gray-400">Total duration of the chit</div>
                  <div className="mt-4 h-24 bg-[#f8ece0] rounded-lg flex items-center justify-center">
                    <Image 
                      src="/patterns/auction.png" 
                      alt="Duration visualization" 
                      width={80} 
                      height={80}
                    />
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Group Information</h2>
              <div className="bg-[#2a3a2a] rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">Description</div>
                    <div className="text-white">{groupData.description || 'No description provided'}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Created by</div>
                    <div className="text-white">{groupData.creator_name || groupData.creator_email}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Status</div>
                    <div className={`inline-block px-2 py-1 rounded text-sm ${
                      groupData.status === 'active' ? 'bg-green-600' :
                      groupData.status === 'pending' ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}>
                      {groupData.status.charAt(0).toUpperCase() + groupData.status.slice(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Created</div>
                    <div className="text-white">{new Date(groupData.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex mt-6 space-x-4">
                <Button>Invite Members</Button>
                <Button variant="secondary">Schedule Auction</Button>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="text-red-500 border-red-500 hover:bg-red-500/10"
                  onClick={handleLeaveGroup}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Leaving...' : 'Leave Group'}
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === 'members' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Members ({members.length})</h2>
                <Button>Invite Member</Button>
              </div>
              
              <div className="bg-[#2a3a2a] rounded-lg p-4">
                {members.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No members found</p>
                ) : (
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-[#1c2c1c] rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white mr-3">
                            {member.user.full_name?.charAt(0) || member.user.email.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {member.user.full_name || member.user.email}
                            </div>
                            <div className="text-sm text-gray-400">
                              {member.user.email} • {member.role}
                            </div>
                            {member.joined_at && (
                              <div className="text-xs text-gray-500">
                                Joined {new Date(member.joined_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            member.role === 'admin' ? 'bg-blue-600' : 'bg-gray-600'
                          }`}>
                            {member.role}
                          </span>
                          
                          {member.role !== 'admin' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                              disabled={actionLoading}
                              className="text-red-400 border-red-400 hover:bg-red-400/10"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab !== 'overview' && activeTab !== 'members' && (
            <div className="py-8 text-center text-gray-400">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab content will be available soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
