'use client';

import React from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import Link from 'next/link';

export default function Home() {
  // Mock data for the dashboard overview
  const dashboardData = {
    totalGroups: 6,
    activeGroups: 5,
    upcomingAuctions: 2,
    totalContributions: '$12,450',
    recentActivity: [
      {
        type: 'member',
        content: 'You were invited to Cooperative Savings Initiative',
        timeAgo: '1 day ago',
      },
      {
        type: 'auction',
        content: 'Community Fund Alpha auction is in 2 days',
        timeAgo: '6 hours ago',
      },
      {
        type: 'payment',
        content: 'Your payment of $200 to Shared Prosperity Group was received',
        timeAgo: '3 days ago',
      },
    ],
    quickActions: [
      { name: 'Create New Group', href: '/CreateGroup', icon: '➕' },
      { name: 'Join Upcoming Auction', href: '/Auctions', icon: '🔨' },
      { name: 'View Payment History', href: '/payments', icon: '💳' },
      { name: 'Invite Members', href: '/Members', icon: '👥' },
    ]
  };

  return (
    <div className="flex min-h-screen bg-[#1c2c1c] text-white">
      <Sidebar activeItem="dashboard" />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button href="/CreateGroup">Create Group</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#2a3a2a] p-6 rounded-lg">
            <div className="text-4xl font-bold mb-2">{dashboardData.totalGroups}</div>
            <div className="text-gray-400">Total Groups</div>
          </div>
          
          <div className="bg-[#2a3a2a] p-6 rounded-lg">
            <div className="text-4xl font-bold mb-2">{dashboardData.activeGroups}</div>
            <div className="text-gray-400">Active Groups</div>
          </div>
          
          <div className="bg-[#2a3a2a] p-6 rounded-lg">
            <div className="text-4xl font-bold mb-2">{dashboardData.upcomingAuctions}</div>
            <div className="text-gray-400">Upcoming Auctions</div>
          </div>
          
          <div className="bg-[#2a3a2a] p-6 rounded-lg">
            <div className="text-4xl font-bold mb-2">{dashboardData.totalContributions}</div>
            <div className="text-gray-400">Total Contributions</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">My Groups</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/GroupDetail/1" className="block">
                <div className="bg-[#2a3a2a] p-4 rounded-lg hover:bg-[#364a36] transition-colors">
                  <div className="mb-3 h-24 bg-[#f8ece0] rounded flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#dbc1a0] rounded-full"></div>
                  </div>
                  <h3 className="font-medium mb-1">Community Fund Alpha</h3>
                  <p className="text-sm text-gray-400">Next auction in 2 days</p>
                </div>
              </Link>
              
              <Link href="/GroupDetail/2" className="block">
                <div className="bg-[#2a3a2a] p-4 rounded-lg hover:bg-[#364a36] transition-colors">
                  <div className="mb-3 h-24 bg-[#f8ece0] rounded flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#dbc1a0] rounded-full"></div>
                  </div>
                  <h3 className="font-medium mb-1">Neighborhood Savings</h3>
                  <p className="text-sm text-gray-400">Next auction in 9 days</p>
                </div>
              </Link>
              
              <Link href="/MyGroups" className="block">
                <div className="bg-[#2a3a2a] p-4 rounded-lg hover:bg-[#364a36] transition-colors flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-3xl mb-2">+</div>
                    <p className="text-sm text-gray-400">View All Groups</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="bg-[#2a3a2a] rounded-lg p-4">
              <ul className="space-y-4">
                {dashboardData.recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'member' ? (
                        <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center">
                          <span className="text-xs">👤</span>
                        </div>
                      ) : activity.type === 'auction' ? (
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-xs">🔨</span>
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center">
                          <span className="text-xs">💸</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-white">{activity.content}</p>
                      <p className="text-sm text-gray-400">{activity.timeAgo}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardData.quickActions.map((action, index) => (
              <Link key={index} href={action.href} className="block">
                <div className="bg-[#2a3a2a] p-4 rounded-lg hover:bg-[#364a36] transition-colors">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{action.icon}</div>
                    <div>{action.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}