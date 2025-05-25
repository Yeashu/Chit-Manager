'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import InviteMemberModal from '@/components/InviteMemberModal';
import ScheduleAuctionModal from '@/components/ScheduleAuctionModal';
import PlaceBidModal from '@/components/PlaceBidModal';
import PaymentModal from '@/components/PaymentModal';
import { getGroupDetails, updateGroup, deleteGroup } from '@/lib/actions/groupActions';
import { getGroupMembers, removeMemberFromGroup, updateMemberRole, leaveGroup } from '@/lib/actions/memberActions';
import { getGroupAuctions } from '@/lib/actions/auctionActions';
import { getGroupPayments } from '@/lib/actions/paymentActions';
import { createClient } from '@/utils/supabase/client';
import type { ChitGroupWithCreator, MemberWithUser, Auction, Payment } from '@/types';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

interface GroupDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default function GroupDetail({ params }: GroupDetailProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [groupData, setGroupData] = useState<ChitGroupWithCreator | null>(null);
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch group details and members
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch group details and check admin status
        const [groupResponse, membersResponse] = await Promise.all([
          getGroupDetails(id),
          getGroupMembers(id)
        ]);

        if (!groupResponse.data) {
          setError(groupResponse.error || 'Failed to fetch group details');
          return;
        }
        setGroupData(groupResponse.data);

        if (membersResponse.success && membersResponse.data) {
          setMembers(membersResponse.data);
          
          // Check if current user is admin
          if (user) {
            const currentMember = membersResponse.data.find(m => m.user.id === user.id);
            setIsAdmin(currentMember?.role === 'admin');
          }
        }

        // Fetch group auctions
        const auctionsResponse = await getGroupAuctions(id);
        if (auctionsResponse.success && auctionsResponse.data) {
          setAuctions(auctionsResponse.data);
        }

        // Fetch group payments
        const paymentsResponse = await getGroupPayments(id);
        if (paymentsResponse.success && paymentsResponse.data) {
          setPayments(paymentsResponse.data);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching group data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch after user is loaded
    if (!userLoading) {
      fetchData();
    }
  }, [id, user, userLoading]);

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
              
              {/* Recent Activity */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="bg-[#2a3a2a] rounded-lg p-4">
                  <div className="space-y-3">
                    {auctions.slice(0, 3).map((auction) => (
                      <div key={auction.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-white text-sm">Auction Round {auction.round_number}</div>
                            <div className="text-gray-400 text-xs">{auction.status}</div>
                          </div>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date(auction.auction_date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    
                    {payments.slice(0, 2).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            payment.type === 'contribution' ? 'bg-green-600' : 'bg-blue-600'
                          }`}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-white text-sm">{payment.type} - ${payment.amount}</div>
                            <div className="text-gray-400 text-xs">{payment.status}</div>
                          </div>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'Pending'}
                        </div>
                      </div>
                    ))}
                    
                    {auctions.length === 0 && payments.length === 0 && (
                      <div className="text-center py-4 text-gray-400">
                        No recent activity
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex mt-6 space-x-4">
                {isAdmin && (
                  <>
                    <Button onClick={() => setShowInviteModal(true)}>Invite Members</Button>
                    <Button variant="secondary" onClick={() => setShowAuctionModal(true)}>Schedule Auction</Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setShowPaymentModal(true)}>Make Payment</Button>
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
                {isAdmin && (
                  <Button onClick={() => setShowInviteModal(true)}>Invite Member</Button>
                )}
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
                            {member.user.name?.charAt(0) || member.user.email.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {member.user.name || member.user.email}
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
          
          {activeTab === 'auctions' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Auctions ({auctions.length})</h2>
                <Button onClick={() => setShowAuctionModal(true)}>Schedule Auction</Button>
              </div>
              
              <div className="bg-[#2a3a2a] rounded-lg p-4">
                {auctions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">No auctions scheduled yet</div>
                    <Button onClick={() => setShowAuctionModal(true)}>Schedule First Auction</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {auctions.map((auction) => (
                      <div key={auction.id} className="flex items-center justify-between p-4 bg-[#1c2c1c] rounded-lg border border-[#3a4a3a]">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold">R{auction.round_number}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">Round {auction.round_number}</div>
                            <div className="text-sm text-gray-400">
                              Auction: {new Date(auction.auction_date).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400">
                              Deadline: {new Date(auction.deadline).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            auction.status === 'scheduled' ? 'bg-yellow-600/20 text-yellow-400' :
                            auction.status === 'open' ? 'bg-green-600/20 text-green-400' :
                            auction.status === 'closed' ? 'bg-gray-600/20 text-gray-400' :
                            'bg-red-600/20 text-red-400'
                          }`}>
                            {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                          </span>
                          
                          {auction.winner_id && (
                            <div className="text-right">
                              <div className="text-sm text-gray-400">Winner</div>
                              <div className="text-white font-medium">${auction.winner_bid}</div>
                            </div>
                          )}
                          
                          {auction.status === 'open' && (
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => {
                                setSelectedAuction(auction);
                                setShowBidModal(true);
                              }}
                            >
                              Place Bid
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

          {activeTab === 'payments' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Payments ({payments.length})</h2>
                <Button href="/payments/new">Make New Payment</Button>
              </div>
              
              <div className="bg-[#2a3a2a] rounded-lg p-4">
                {payments.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No payments recorded yet. <a href="/payments/new" className="text-green-500 hover:underline">Make a new payment</a>.</p>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-[#1c2c1c] rounded-lg border border-[#3a4a3a]">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            payment.type === 'contribution' ? 'bg-green-600' :
                            payment.type === 'payout' ? 'bg-blue-600' : 'bg-gray-600'
                          }`}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d={payment.type === 'contribution' ? "M12 4v16m8-8H4" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                            </svg>
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'Pending'}
                            </div>
                            {payment.auction_id && (
                              <div className="text-sm text-gray-400">Auction payout</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-white font-bold">${payment.amount}</div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            payment.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                            payment.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-red-600/20 text-red-400'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'members' && activeTab !== 'auctions' && activeTab !== 'payments' && (
            <div className="py-8 text-center text-gray-400">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab content will be available soon.
            </div>
          )}
        </div>

        {/* Invite Member Modal */}
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          groupId={id}
          onInviteSuccess={async () => {
            // Refresh members list after successful invitation
            const membersResponse = await getGroupMembers(id);
            if (membersResponse.success && membersResponse.data) {
              setMembers(membersResponse.data);
            }
          }}
        />

        {/* Schedule Auction Modal */}
        <ScheduleAuctionModal
          isOpen={showAuctionModal}
          onClose={() => setShowAuctionModal(false)}
          groupId={id}
          onAuctionCreated={async () => {
            // Refresh auctions list after successful creation
            const auctionsResponse = await getGroupAuctions(id);
            if (auctionsResponse.success && auctionsResponse.data) {
              setAuctions(auctionsResponse.data);
            }
          }}
        />

        {/* Place Bid Modal */}
        {selectedAuction && (
          <PlaceBidModal
            isOpen={showBidModal}
            onClose={() => {
              setShowBidModal(false);
              setSelectedAuction(null);
            }}
            auctionId={selectedAuction.id}
            roundNumber={selectedAuction.round_number}
            deadline={selectedAuction.deadline}
            onBidPlaced={async () => {
              // Refresh auctions list after successful bid
              const auctionsResponse = await getGroupAuctions(id);
              if (auctionsResponse.success && auctionsResponse.data) {
                setAuctions(auctionsResponse.data);
              }
            }}
          />
        )}

        {/* Payment Modal */}
        {groupData && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            groupId={id}
            monthlyContribution={groupData.monthly_contribution}
            onPaymentMade={async () => {
              // Refresh payments list after successful payment
              const paymentsResponse = await getGroupPayments(id);
              if (paymentsResponse.success && paymentsResponse.data) {
                setPayments(paymentsResponse.data);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
