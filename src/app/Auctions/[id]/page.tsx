'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import PlaceBidModal from '@/components/PlaceBidModal';
import { getAuctionDetails, closeAuction } from '@/lib/actions/auctionActions';
import { getGroupDetails } from '@/lib/actions/groupActions';
import { useUser } from '@/hooks/useUser';
import type { AuctionWithBids, ChitGroupWithCreator } from '@/types';
import CountdownTimer from '@/components/CountdownTimer';
import { createClient } from '@/utils/supabase/client'; // adjust import as needed

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const { user } = useUser();
  const [auction, setAuction] = useState<AuctionWithBids | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placeBidModalOpen, setPlaceBidModalOpen] = useState(false);
  const [endingAuction, setEndingAuction] = useState(false);
  const [group, setGroup] = useState<ChitGroupWithCreator | null>(null);
  const [totalMembers, setTotalMembers] = useState<number>(0);

  // Fetch auction details
  const loadAuctionDetails = async () => {
    try {
      const response = await getAuctionDetails(id);
      if (response.success && response.data) {
        setAuction(response.data);
      } else {
        setError(response.error || 'Failed to load auction details');
      }
    } catch (err) {
      console.error('Error loading auction details:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch group details when auction is loaded
  useEffect(() => {
    if (auction && auction.group_id) {
      getGroupDetails(auction.group_id).then((res) => {
        if (res.data) setGroup(res.data);
      });
    }
  }, [auction]);

  useEffect(() => {
    loadAuctionDetails();
  }, [id]);

  useEffect(() => {
    async function fetchTotalMembers() {
      if (!auction?.group_id) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from('chit_groups')
        .select('total_members')
        .eq('id', auction.group_id)
        .single();
      if (data && data.total_members) setTotalMembers(Number(data.total_members));
    }
    fetchTotalMembers();
  }, [auction?.group_id]);

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const getCountdown = () => {
    if (!auction) return null;
    
    const now = new Date().getTime();
    const deadline = new Date(auction.deadline).getTime();
    const timeDiff = deadline - now;
    
    if (timeDiff <= 0) return null;
    
    return {
      days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((timeDiff % (1000 * 60)) / 1000)
    };
  };

  const countdown = getCountdown();

  const handleBidSuccess = () => {
    setPlaceBidModalOpen(false);
    // Refresh auction details
    loadAuctionDetails();
  };

  // End auction handler
  const handleEndAuction = async () => {
    if (!auction) return;
    setEndingAuction(true);
    try {
      const response = await closeAuction(auction.id);
      if (response.success) {
        await loadAuctionDetails();
      } else {
        alert(response.error || 'Failed to end auction');
      }
    } catch {
      alert('An unexpected error occurred');
    } finally {
      setEndingAuction(false);
    }
  };

  // Helper: is current user the group leader?
  const isGroupLeader = group && user && group.created_by === user.id;
  const isAuctionOpen = auction && auction.status === 'open';
  const isDeadlinePassed = auction && new Date(auction.deadline) < new Date();

  // Auto-end auction if deadline passed and still open
  useEffect(() => {
    if (isAuctionOpen && isDeadlinePassed) {
      handleEndAuction();
    }
  }, [isAuctionOpen, isDeadlinePassed]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#1c2c1c] text-white">
        <Sidebar activeItem="auctions" />
        <div className="flex-1 p-8">
          <div className="text-center py-8">
            <div className="text-gray-400">Loading auction details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="flex min-h-screen bg-[#1c2c1c] text-white">
        <Sidebar activeItem="auctions" />
        <div className="flex-1 p-8">
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {error || 'Auction not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#1c2c1c] text-white">
      <Sidebar activeItem="auctions" />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <button 
              onClick={() => router.back()}
              className="text-[#a3e635] hover:text-[#81c784] mb-4 flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Auctions
            </button>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a3e635] to-[#81c784]">
              {auction.group_name} - Round {auction.round_number}
            </h1>
            <p className="text-[#cbd5c0] mt-2">
              Auction ID: {id}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {auction.status === 'open' && (
              <Button 
                onClick={() => setPlaceBidModalOpen(true)}
              >
                Place Bid
              </Button>
            )}
            {/* End Auction button for group leader */}
            {isGroupLeader && isAuctionOpen && !isDeadlinePassed && (
              <Button
                variant="danger"
                className="ml-4"
                onClick={handleEndAuction}
                disabled={endingAuction}
              >
                {endingAuction ? 'Ending Auction...' : 'End Auction'}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main auction details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Auction Status */}
            <div className="bg-[#2a3a2a] p-6 rounded-lg border border-[#3a4a3a] hover:border-[#a3e635]/30 transition-colors duration-300">
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#a3e635] to-[#81c784] mb-6">Auction Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#1c2c1c] p-4 rounded-lg border border-[#3a4a3a]">
                  <p className="text-[#cbd5c0] text-sm mb-2">Status</p>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    auction.status === 'closed' ? 'bg-gray-600/20 text-gray-300 border border-gray-500' :
                    auction.status === 'open' ? 'bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]' :
                    'bg-blue-500/20 text-blue-300 border border-blue-500'
                  }`}>
                    {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  </span>
                </div>
                <div className="bg-[#1c2c1c] p-4 rounded-lg border border-[#3a4a3a]">
                  <p className="text-[#cbd5c0] text-sm mb-2">Auction Date</p>
                  <p className="text-white">{new Date(auction.auction_date).toLocaleString()}</p>
                </div>
                <div className="bg-[#1c2c1c] p-4 rounded-lg border border-[#3a4a3a]">
                  <p className="text-[#cbd5c0] text-sm mb-2">Group Contribution</p>
                  <p className="text-xl font-semibold text-[#a3e635]">
                    {formatCurrency(Number(auction.group_contribution) * totalMembers)}
                  </p>
                </div>
                <div className="bg-[#1c2c1c] p-4 rounded-lg border border-[#3a4a3a]">
                  <p className="text-[#cbd5c0] text-sm mb-2">Bidding Deadline</p>
                  <p className="text-white">{new Date(auction.deadline).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            {auction.status === 'open' && countdown && (
              <div className="bg-[#2a3a2a] p-6 rounded-lg border border-green-900">
                <h2 className="text-xl font-semibold text-green-400 mb-4">Time Remaining</h2>
                <CountdownTimer 
                  days={countdown.days}
                  hours={countdown.hours}
                  minutes={countdown.minutes}
                  seconds={countdown.seconds}
                />
              </div>
            )}

            {/* Bidding History */}
            <div className="bg-[#2a3a2a] p-6 rounded-lg border border-green-900">
              <h2 className="text-xl font-semibold text-green-400 mb-4">Bidding History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1c2c1c]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Bidder</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-900">
                    {auction.bids && auction.bids.length > 0 ? (
                      auction.bids.map((bid) => (
                        <tr key={bid.id} className="hover:bg-[#1c2c1c]">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {bid.bidder_name || 'Anonymous'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatCurrency(bid.bid_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(bid.placed_at).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                          No bids placed yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Winner Info */}
            {auction.status === 'closed' && (
              <div className="bg-[#2a3a2a] p-6 rounded-lg border border-green-900">
                <h2 className="text-xl font-semibold text-green-400 mb-4">Auction Winner</h2>
                {auction.winner_id ? (
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Winner:</span> {auction.winner_name}</p>
                    <p><span className="text-gray-400">Winning Bid:</span> {formatCurrency(auction.winner_bid || 0)}</p>
                  </div>
                ) : (
                  <p className="text-gray-400">No winner determined</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {auction.status === 'open' && (
              <div className="bg-[#2a3a2a] p-6 rounded-lg border border-green-900">
                <h2 className="text-xl font-semibold text-green-400 mb-4">Actions</h2>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setPlaceBidModalOpen(true)}
                >
                  Place Bid
                </Button>
              </div>
            )}

            {/* End Auction Button - Group Leader */}
            {isGroupLeader && isAuctionOpen && !isDeadlinePassed && (
              <Button
                variant="danger"
                className="w-full mt-4"
                onClick={handleEndAuction}
                disabled={endingAuction}
              >
                {endingAuction ? 'Ending Auction...' : 'End Auction'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Place Bid Modal */}
      {placeBidModalOpen && (
        <PlaceBidModal
          auctionId={auction.id}
          roundNumber={auction.round_number}
          deadline={auction.deadline}
          isOpen={placeBidModalOpen}
          onClose={() => setPlaceBidModalOpen(false)}
          onBidPlaced={handleBidSuccess}
        />
      )}
    </div>
  );
}

