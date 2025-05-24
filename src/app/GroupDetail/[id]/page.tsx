'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';

interface GroupDetailProps {
  params: {
    id: string;
  };
}

export default function GroupDetail({ params }: GroupDetailProps) {
  const { id } = params;
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for the group details
  const groupData = {
    id,
    name: 'Chit Fund Group Alpha',
    status: 'Active',
    memberCount: 12,
    nextAuction: '2 days',
    totalFund: '$12,000',
    contributionsCollected: '$8,000',
    recentActivity: [
      {
        type: 'member',
        content: 'Member Sarah joined the group',
        timeAgo: '2 days ago',
      },
      {
        type: 'auction',
        content: 'Auction held successfully',
        timeAgo: '1 week ago',
      },
      {
        type: 'payment',
        content: 'Contributions collected for the month',
        timeAgo: '2 weeks ago',
      },
    ],
  };

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
            {groupData.status} • {groupData.memberCount} Members • Next Auction: {groupData.nextAuction}
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
                  <div className="text-gray-400 mb-1">Total Fund</div>
                  <div className="text-xl font-bold">{groupData.totalFund}</div>
                  <div className="text-sm text-gray-400">Total amount in the fund</div>
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
                  <div className="text-gray-400 mb-1">Contributions Collected</div>
                  <div className="text-xl font-bold">{groupData.contributionsCollected}</div>
                  <div className="text-sm text-gray-400">Amount contributed by members</div>
                  <div className="mt-4 h-24 bg-[#f8ece0] rounded-lg flex items-center justify-center">
                    <Image 
                      src="/patterns/savings.png" 
                      alt="Contributions visualization" 
                      width={80} 
                      height={80}
                    />
                  </div>
                </div>
                
                <div className="bg-[#2a3a2a] rounded-lg p-4">
                  <div className="text-gray-400 mb-1">Next Auction</div>
                  <div className="text-xl font-bold">{groupData.nextAuction}</div>
                  <div className="text-sm text-gray-400">Time until the next auction</div>
                  <div className="mt-4 h-24 bg-[#f8ece0] rounded-lg flex items-center justify-center">
                    <Image 
                      src="/patterns/auction.png" 
                      alt="Auction visualization" 
                      width={80} 
                      height={80}
                    />
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="bg-[#2a3a2a] rounded-lg p-4">
                <ul className="space-y-4">
                  {groupData.recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {activity.type === 'member' ? (
                          <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center">
                            <span className="text-xs">👤</span>
                          </div>
                        ) : activity.type === 'auction' ? (
                          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-xs">💰</span>
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
              
              <div className="flex mt-6 space-x-4">
                <Button>Invite Members</Button>
                <Button variant="secondary">Join Next Auction</Button>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-500/10">
                  Leave Group
                </Button>
              </div>
            </div>
          )}
          
          {activeTab !== 'overview' && (
            <div className="py-8 text-center text-gray-400">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab content would be displayed here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
