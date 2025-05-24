'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import { placeBid } from '@/lib/actions/auctionActions';

interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  auctionId: string;
  roundNumber: number;
  deadline: string;
  onBidPlaced?: () => void;
}

export default function PlaceBidModal({ 
  isOpen, 
  onClose, 
  auctionId, 
  roundNumber,
  deadline,
  onBidPlaced 
}: PlaceBidModalProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await placeBid(auctionId, amount);
      
      if (response.success) {
        alert(response.message || 'Bid placed successfully!');
        setBidAmount('');
        onBidPlaced?.();
        onClose();
      } else {
        setError(response.error || 'Failed to place bid');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setBidAmount('');
      setError('');
      onClose();
    }
  };

  const isDeadlinePassed = new Date(deadline) < new Date();

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
              <h2 className="text-xl font-bold text-white">Place Bid - Round {roundNumber}</h2>
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

            {isDeadlinePassed ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Bidding Closed</h3>
                <p className="text-gray-400 mb-6">The bidding deadline for this auction has passed.</p>
                <Button onClick={handleClose} className="w-full">
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Bid Amount ($)
                  </label>
                  <input
                    id="bidAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1c2c1c] border border-[#3a4a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your bid amount"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="bg-[#1c2c1c] rounded-lg p-4 border border-[#3a4a3a]">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">Bidding Rules</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• The lowest bid wins the auction</li>
                        <li>• Winner receives the total fund minus their bid</li>
                        <li>• All bids are final once submitted</li>
                        <li>• Deadline: {new Date(deadline).toLocaleString()}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

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
                    disabled={loading || !bidAmount}
                    className="flex-1"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Placing Bid...
                      </div>
                    ) : (
                      'Place Bid'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
