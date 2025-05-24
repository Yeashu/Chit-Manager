'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import { pageAnimations, hoverAnimations } from '@/utils/animations';

// Mock data for reports
const mockReports = [
  {
    id: 'rep-001',
    title: 'Monthly Contribution Summary',
    type: 'contribution',
    date: '2023-06-30',
    group: 'Community Fund Alpha',
    status: 'generated',
  },
  {
    id: 'rep-002',
    title: 'Auction Results - June 2023',
    type: 'auction',
    date: '2023-06-28',
    group: 'Neighborhood Savings',
    status: 'generated',
  },
  {
    id: 'rep-003',
    title: 'Member Activity Report',
    type: 'member',
    date: '2023-06-25',
    group: 'All Groups',
    status: 'generated',
  },
  {
    id: 'rep-004',
    title: 'Financial Statement Q2 2023',
    type: 'financial',
    date: '2023-06-20',
    group: 'All Groups',
    status: 'pending',
  },
  {
    id: 'rep-005',
    title: 'Defaulters List - June 2023',
    type: 'defaulters',
    date: '2023-06-15',
    group: 'Shared Prosperity Group',
    status: 'generated',
  },
];

type ReportType = 'all' | 'contribution' | 'auction' | 'member' | 'financial' | 'defaulters';

export default function ReportsPage() {
  const [activeFilter, setActiveFilter] = useState<ReportType>('all');
  const [dateRange, setDateRange] = useState('this-month');

  const filteredReports = activeFilter === 'all' 
    ? mockReports 
    : mockReports.filter(report => report.type === activeFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'bg-[#a3e635]/10 text-[#a3e635]';
      case 'pending':
        return 'bg-[#60a5fa]/10 text-[#60a5fa]';
      case 'failed':
        return 'bg-[#f87171]/10 text-[#f87171]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return '💰';
      case 'auction':
        return '🔨';
      case 'member':
        return '👥';
      case 'financial':
        return '📊';
      case 'defaulters':
        return '⚠️';
      default:
        return '📄';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#181f16] text-white font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <Sidebar activeItem="reports" />
      
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
              Reports
            </h1>
            <p className="text-[#cbd5c0]">Generate and view detailed reports for your chit fund groups</p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button>
              📊 Generate New Report
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
              title: 'Total Reports', 
              value: '24',
              change: '+5 this month',
              isPositive: true,
              icon: '📋'
            },
            { 
              title: 'Generated This Month', 
              value: '8',
              change: '+2 from last month',
              isPositive: true,
              icon: '📈'
            },
            { 
              title: 'Pending Generation', 
              value: '3',
              change: 'Scheduled',
              isPositive: false,
              icon: '⏳'
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
                  <p className={`text-sm mt-2 ${stat.isPositive ? 'text-[#a3e635]' : 'text-[#f87171]'}`}>
                    {stat.change}
                  </p>
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
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-[#cbd5c0] text-sm block mb-1">Report Type:</span>
              <div className="flex flex-wrap gap-2">
                {['all', 'contribution', 'auction', 'member', 'financial', 'defaulters'].map((filter) => (
                  <motion.button
                    key={filter}
                    onClick={() => setActiveFilter(filter as ReportType)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeFilter === filter
                        ? 'bg-[#a3e635] text-[#181f16]'
                        : 'bg-[#2a3424] text-[#cbd5c0] hover:bg-[#364a36]'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1).replace(/-/g, ' ')}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="ml-auto">
              <span className="text-[#cbd5c0] text-sm block mb-1">Date Range:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-[#2a3424] border border-[#364a36] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#a3e635]/50 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this-week">This Week</option>
                <option value="last-week">Last Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Reports List */}
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
                  <th className="p-4 font-medium">Report</th>
                  <th className="p-4 font-medium">Group</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a3424]">
                <AnimatePresence>
                  {filteredReports.map((report) => (
                    <motion.tr 
                      key={report.id}
                      variants={pageAnimations.item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="hover:bg-[#2a3424]/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{getTypeIcon(report.type)}</span>
                          <div>
                            <div className="font-medium">{report.title}</div>
                            <div className="text-xs text-[#cbd5c0] mt-1">
                              <span className={`px-2 py-0.5 rounded-full ${getStatusColor(report.status)}`}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{report.group}</td>
                      <td className="p-4 text-sm text-[#cbd5c0]">
                        {new Date(report.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-[#cbd5c0] hover:text-[#a3e635] transition-colors"
                            title="View"
                          >
                            👁️
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-[#cbd5c0] hover:text-[#60a5fa] transition-colors"
                            title="Download"
                          >
                            ⬇️
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-[#cbd5c0] hover:text-[#f87171] transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {filteredReports.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-[#cbd5c0]"
            >
              No reports found matching your criteria.
            </motion.div>
          )}
          
          <div className="border-t border-[#2a3424] p-4 flex justify-between items-center">
            <div className="text-sm text-[#cbd5c0]">
              Showing {filteredReports.length} of {mockReports.length} reports
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
      </div>
    </div>
  );
}
