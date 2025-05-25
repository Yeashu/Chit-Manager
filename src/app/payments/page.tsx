'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import Link from 'next/link';
import { pageAnimations } from '@/utils/animations';
import { getUserPayments } from '@/lib/actions/paymentActions';
import { useUser } from '@/hooks/useUser';
import type { PaymentWithDetails } from '@/types';
import { createClient } from '@/utils/supabase/client';

type PaymentStatus = 'all' | 'completed' | 'pending' | 'profits';

export default function PaymentsPage() {
  const { user } = useUser();
  const [activeFilter, setActiveFilter] = useState<PaymentStatus>('all');
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [profits, setProfits] = useState<PaymentWithDetails[]>([]);

  useEffect(() => {
    if (user?.id) {
      getUserPayments(user.id).then((res) => {
        if (res.success && res.data) {
          setPayments(res.data);
        } else {
          setPayments([]);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    async function fetchProfits() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('type', 'received');

      if (error) {
        console.error('Error fetching profits:', error);
      } else {
        setProfits(data);
      }
    }

    fetchProfits();
  }, []);

  const filteredPayments = activeFilter === 'all'
    ? payments
    : activeFilter === 'profits'
      ? payments.filter(payment => payment.type === 'received')
      : payments.filter(payment => payment.status === activeFilter);

  // Calculate stats from real data
  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalProfits = payments.filter(p => p.type === 'received').reduce((sum, p) => sum + Number(p.amount), 0);

  const getStatusColor = (status: string, type: string) => {
    if (type === 'received') {
      return 'bg-[#34d399]/10 text-[#34d399]'; // Green for profits
    }
    switch (status) {
      case 'completed':
        return 'bg-[#a3e635]/10 text-[#a3e635]';
      case 'pending':
        return 'bg-[#60a5fa]/10 text-[#60a5fa]';
      case 'failed':
        return 'bg-[#f87171]/10 text-[#f87171]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#181f16] text-white font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <Sidebar activeItem="payments" />
      
      <div className="relative flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#a3e635]/10 to-transparent rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-tl from-[#81c784]/10 to-transparent rounded-full filter blur-3xl"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a3e635] to-[#81c784] mb-2">
              Payment History
            </h1>
            <p className="text-[#cbd5c0]">View and manage all your payment transactions</p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button href="/payments/new">
              Make New Payment
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={pageAnimations.container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            {
              title: 'Total Paid', 
              value: `$${totalPaid}`,
              change: `${payments.length > 0 ? ((totalPaid / payments.reduce((sum, p) => sum + Number(p.amount), 0)) * 100).toFixed(1) : '0'}%`,
              isPositive: true,
              icon: '💸'
            },
            { 
              title: 'Pending Payments', 
              value: `$${pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0)}`,
              change: `${pendingPayments.length} pending`,
              isPositive: false,
              icon: '⏳'
            },
            { 
              title: 'Profits', 
              value: `$${totalProfits}`,
              change: `${payments.filter(p => p.type === 'received').length} received`,
              isPositive: true,
              icon: '📈'
            }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              variants={pageAnimations.item}
              className="bg-[#232b1c] border border-[#2a3424] p-6 rounded-xl hover:border-[#a3e635]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#a3e635]/5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#cbd5c0] text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-sm mt-2 ${stat.isPositive ? 'text-[#a3e635]' : 'text-[#f87171]'}`}>{stat.change}</p>
                </div>
                <div className="text-3xl">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div 
          variants={pageAnimations.item}
          className="bg-[#232b1c] border border-[#2a3424] rounded-xl p-4 mb-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#cbd5c0] text-sm">Filter by status:</span>
            {['all', 'completed', 'pending', 'profits'].map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter as PaymentStatus)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-[#a3e635] text-[#181f16]'
                    : 'bg-[#2a3424] text-[#cbd5c0] hover:bg-[#364a36]'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Payments Table */}
        <motion.div 
          variants={pageAnimations.container}
          initial="hidden"
          animate="show"
          className="bg-[#232b1c] border border-[#2a3424] rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a3424] text-left text-[#cbd5c0] text-sm">
                  <th className="p-4 font-medium">Payment ID</th>
                  <th className="p-4 font-medium">Group</th>
                  <th className="p-4 font-medium">Recipient</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a3424]">
                <AnimatePresence>
                  {filteredPayments.map((payment) => (
                    <motion.tr 
                      key={payment.id}
                      variants={pageAnimations.item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="hover:bg-[#2a3424]/50 transition-colors"
                    >
                      <td className="p-4 text-sm font-medium">
                        <Link href={`/payment/${payment.id}`} className="hover:text-[#a3e635] transition-colors">
                          {payment.id}
                        </Link>
                      </td>
                      <td className="p-4 text-sm">{payment.group_name || '-'}</td>
                      <td className="p-4 text-sm">{payment.user_name || payment.user_email || '-'}</td>
                      <td className="p-4 text-sm text-right">${payment.amount}</td>
                      <td className="p-4 text-sm text-[#cbd5c0]">
                        {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '-'}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status, payment.type)}`}>
                          {payment.type === 'received' ? 'Profit' : payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-[#cbd5c0]"
            >
              No payments found matching your criteria.
            </motion.div>
          )}
          
          <div className="border-t border-[#2a3424] p-4 flex justify-between items-center">
            <div className="text-sm text-[#cbd5c0]">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
            <div className="flex gap-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 rounded-lg border border-[#2a3424] hover:bg-[#2a3424] transition-colors"
              >
                Previous
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 rounded-lg border border-[#2a3424] bg-[#2a3424] hover:bg-[#364a36] transition-colors"
              >
                1
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 rounded-lg border border-[#2a3424] hover:bg-[#2a3424] transition-colors"
              >
                Next
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Profits Section - Newly Added */}
        <motion.div 
          variants={pageAnimations.container}
          initial="hidden"
          animate="show"
          className="bg-[#232b1c] border border-[#2a3424] rounded-xl p-6 mt-8"
        >
          <h2 className="text-xl font-semibold mb-4">
            Your Profits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profits.length > 0 ? (
              profits.map((profit) => (
                <div key={profit.id} className="bg-[#2a3424] p-4 rounded-lg border border-[#2a3424] hover:border-[#a3e635]/30 transition-all duration-300">
                  <p className="text-sm text-[#cbd5c0]">
                    User ID: <span className="text-white">{profit.user_id}</span>
                  </p>
                  <p className="text-sm text-[#cbd5c0]">
                    Amount: <span className="text-white">${profit.amount}</span>
                  </p>
                  <p className="text-sm text-[#cbd5c0]">
                    Paid At: <span className="text-white">{profit.paid_at ? new Date(profit.paid_at).toLocaleString() : 'N/A'}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[#cbd5c0] text-sm">
                No profits to display.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
