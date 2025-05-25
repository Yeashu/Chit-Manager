'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import { createAuction } from '@/lib/actions/auctionActions';
import type { CreateAuctionFormData } from '@/types';

interface ScheduleAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onAuctionCreated?: () => void;
}

export default function ScheduleAuctionModal({ 
  isOpen, 
  onClose, 
  groupId, 
  onAuctionCreated 
}: ScheduleAuctionModalProps) {
  const [formData, setFormData] = useState<CreateAuctionFormData>({
    round_number: 1,
    auction_date: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.auction_date || !formData.deadline) {
      setError('Please fill in all required fields');
      return;
    }

    const auctionDate = new Date(formData.auction_date);
    const deadlineDate = new Date(formData.deadline);
    const now = new Date();

    if (auctionDate <= now) {
      setError('Auction date must be in the future');
      return;
    }

    if (deadlineDate <= auctionDate) {
      setError('Deadline must be after the auction date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await createAuction(groupId, formData);
      
      if (response.success) {
        alert(response.message || 'Auction scheduled successfully!');
        setFormData({
          round_number: 1,
          auction_date: '',
          deadline: ''
        });
        onAuctionCreated?.();
        onClose();
      } else {
        setError(response.error || 'Failed to schedule auction');
      }
    } catch (error) {
      console.error('Error scheduling auction:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        round_number: 1,
        auction_date: '',
        deadline: ''
      });
      setError('');
      onClose();
    }
  };

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Minimum 1 hour from now
    return formatDateTimeLocal(now);
  };

  const getMinDeadline = () => {
    if (formData.auction_date) {
      const auctionDate = new Date(formData.auction_date);
      auctionDate.setHours(auctionDate.getHours() + 1); // Minimum 1 hour after auction
      return formatDateTimeLocal(auctionDate);
    }
    return getMinDateTime();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#2a3a2a] rounded-2xl p-6 w-full max-w-md border border-[#3a4a3a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Schedule Auction</h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="round_number" className="block text-sm font-medium text-gray-300 mb-2">
                  Round Number
                </label>
                <input
                  id="round_number"
                  type="number"
                  min="1"
                  value={formData.round_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, round_number: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 bg-[#1c2c1c] border border-[#3a4a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="auction_date" className="block text-sm font-medium text-gray-300 mb-2">
                  Auction Date & Time
                </label>
                <input
                  id="auction_date"
                  type="datetime-local"
                  value={formData.auction_date}
                  min={getMinDateTime()}
                  onChange={(e) => setFormData(prev => ({ ...prev, auction_date: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#1c2c1c] border border-[#3a4a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-2">
                  Bidding Deadline
                </label>
                <input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  min={getMinDeadline()}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#1c2c1c] border border-[#3a4a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="bg-[#1c2c1c] rounded-lg p-4 border border-[#3a4a3a]">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Auction Guidelines</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Members can place bids before the deadline</li>
                      <li>• The lowest bid wins the auction</li>
                      <li>• Winner receives the fund amount minus their bid</li>
                      <li>• All members continue monthly contributions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.auction_date || !formData.deadline}
                  className="flex-1"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Scheduling...
                    </div>
                  ) : (
                    'Schedule Auction'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
