'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import { recordPayment } from '@/lib/actions/paymentActions';
import { getMyGroups } from '@/lib/actions/groupActions';
import { fetchGroupAuctions } from '@/lib/actions/auctionActions';
import { useUser } from '@/hooks/useUser';
import type { ChitGroup, Auction } from '@/types';

export default function NewPaymentPage() {
  const { user } = useUser();
  const router = useRouter();
  const [groups, setGroups] = useState<ChitGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ChitGroup | null>(null);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [amount, setAmount] = useState('');
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      getMyGroups().then((res) => {
        if (res.data) {
          setGroups(res.data);
        } else {
          setError(res.error || 'Failed to fetch groups');
        }
      });
    }
  }, [user]);

  const handleGroupChange = async (groupId: string) => {
    const group = groups.find((g) => g.id === groupId) || null;
    setSelectedGroup(group);
    setSelectedAuction(null);
    setAuctions([]);
    if (group) {
      setAmount(group.monthly_contribution.toString());
      const res = await fetchGroupAuctions(groupId);
      if (res.data) {
        setAuctions(res.data);
      } else {
        setError(res.error || 'Failed to fetch auctions');
      }
    }
  };

  const handlePayment = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    if (!selectedGroup) {
      setError('Please select a group');
      return;
    }

    if (!selectedAuction) {
      setError('Please select an auction');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await recordPayment({
        user_id: user.id,
        group_id: selectedGroup.id,
        auction_id: selectedAuction.id,
        amount: parseFloat(amount),
        type: 'contribution',
        status: 'completed',
        paid_at: new Date().toISOString(),
      });

      if (response.success) {
        alert(response.message || 'Payment successful!');
        router.push('/payments');
      } else {
        setError(response.error || 'Payment failed');
      }
    } catch (err) {
      console.error('Error making payment:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181f16] text-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#232b1c] p-6 rounded-xl border border-[#2a3424] w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Make a New Payment</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#cbd5c0] mb-2">Select Group</label>
            <select
              value={selectedGroup?.id || ''}
              onChange={(e) => handleGroupChange(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1c2c1c] border border-[#2a3424] text-white"
            >
              <option value="" disabled>
                Select a group
              </option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} (Contribution: ${group.monthly_contribution})
                </option>
              ))}
            </select>
          </div>
          {selectedGroup && (
            <div>
              <label className="block text-sm font-medium text-[#cbd5c0] mb-2">Select Auction</label>
              <select
                value={selectedAuction?.id || ''}
                onChange={(e) => setSelectedAuction(auctions.find((a) => a.id === e.target.value) || null)}
                className="w-full p-3 rounded-lg bg-[#1c2c1c] border border-[#2a3424] text-white"
              >
                <option value="" disabled>
                  Select an auction
                </option>
                {auctions.map((auction) => (
                  <option key={auction.id} value={auction.id}>
                    Round {auction.round_number} (Ends: {new Date(auction.end_date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#cbd5c0] mb-2">Amount</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!useCustomAmount}
                className="flex-1 p-3 rounded-lg bg-[#1c2c1c] border border-[#2a3424] text-white"
                placeholder="Enter Amount"
              />
              <label className="flex items-center text-sm text-[#cbd5c0]">
                <input
                  type="checkbox"
                  checked={useCustomAmount}
                  onChange={(e) => {
                    setUseCustomAmount(e.target.checked);
                    if (!e.target.checked && selectedGroup) {
                      setAmount(selectedGroup.monthly_contribution.toString());
                    }
                  }}
                  className="mr-2"
                />
                Custom Amount
              </label>
            </div>
          </div>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/payments')}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
