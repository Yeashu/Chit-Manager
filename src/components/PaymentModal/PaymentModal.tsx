'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import { recordPayment, getGroupPayments } from '@/lib/actions/paymentActions';
import type { RecordPaymentFormData } from '@/types';
import type { PaymentWithDetails } from '@/types';
import { useUser } from '@/hooks/useUser';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  monthlyContribution: number;
  onPaymentMade?: () => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  groupId,
  monthlyContribution,
  onPaymentMade 
}: PaymentModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);

  // Fetch group payments when modal opens
  useEffect(() => {
    if (isOpen && groupId) {
      getGroupPayments(groupId).then((res) => {
        if (res.success && res.data) {
          setPayments(res.data);
        } else {
          setPayments([]);
        }
      });
    }
  }, [isOpen, groupId]);

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      if (!user?.id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }
      const paymentData: RecordPaymentFormData = {
        user_id: user.id, // Now linked to current user
        group_id: groupId,
        amount: monthlyContribution,
        type: 'contribution',
        status: 'completed',
        paid_at: new Date().toISOString()
      };

      const response = await recordPayment(paymentData);
      
      if (response.success) {
        alert(response.message || 'Payment processed successfully!');
        onPaymentMade?.();
        onClose();
      } else {
        setError(response.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
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
              <h2 className="text-xl font-bold text-white">Make Payment</h2>
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

            <div className="space-y-4">
              <div className="bg-[#1c2c1c] rounded-lg p-4 border border-[#3a4a3a]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Monthly Contribution</span>
                  <span className="text-white font-bold text-lg">${monthlyContribution}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Due date: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 text-green-500"
                      disabled={loading}
                    />
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-white">Credit/Debit Card</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 text-green-500"
                      disabled={loading}
                    />
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-white">Bank Transfer</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-[#1c2c1c] rounded-lg p-4 border border-[#3a4a3a]">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Secure Payment</h4>
                    <p className="text-xs text-gray-400">
                      Your payment is processed securely using bank-grade encryption.
                    </p>
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
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Pay $${monthlyContribution}`
                  )}
                </Button>
              </div>

              {payments.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-2">Recent Payments</h3>
                  <div className="bg-[#1c2c1c] rounded-lg p-4 border border-[#3a4a3a] max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left text-gray-400 font-medium pb-2">User</th>
                          <th className="text-left text-gray-400 font-medium pb-2">Amount</th>
                          <th className="text-left text-gray-400 font-medium pb-2">Date</th>
                          <th className="text-left text-gray-400 font-medium pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p.id}>
                            <td className="py-1 text-white">{p.user_name || p.user_email || 'User'}</td>
                            <td className="py-1 text-[#a3e635]">${p.amount}</td>
                            <td className="py-1 text-gray-300">{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : '-'}</td>
                            <td className="py-1">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${p.status === 'completed' ? 'bg-green-700 text-green-200' : p.status === 'pending' ? 'bg-yellow-700 text-yellow-200' : 'bg-red-700 text-red-200'}`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
