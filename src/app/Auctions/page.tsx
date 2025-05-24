'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import FilterButtons from '@/components/FilterButtons';
import CountdownTimer from '@/components/CountdownTimer';
import AuctionTable from '@/components/AuctionTable';
import Calendar from '@/components/Calendar';
import Button from '@/components/Button';

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'upcoming', label: 'Upcoming' },
];

// Mock data for auctions
const mockAuctions = [
  {
    round: 'Round 1',
    winner: 'Sarah Miller',
    bidAmount: '$1,200',
    date: '2024-07-15',
  },
  {
    round: 'Round 2',
    winner: 'David Lee',
    bidAmount: '$1,150',
    date: '2024-07-22',
  },
  {
    round: 'Round 3',
    winner: 'Emily Chen',
    bidAmount: '$1,300',
    date: '2024-07-29',
  },
  {
    round: 'Round 4',
    winner: 'Michael Brown',
    bidAmount: '$1,250',
    date: '2024-08-05',
  },
  {
    round: 'Round 5',
    winner: 'Jessica Wilson',
    bidAmount: '$1,100',
    date: '2024-08-12',
  },
];

export default function Auctions() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Mock countdown data (would be calculated in a real app)
  const countdown = {
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 18,
  };
  
  return (
    <div className="flex min-h-screen bg-[#1c2c1c] text-white">
      <Sidebar activeItem="auctions" />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Auctions</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Auction</h2>
          <CountdownTimer 
            days={countdown.days}
            hours={countdown.hours}
            minutes={countdown.minutes}
            seconds={countdown.seconds}
          />
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Auction History</h2>
            <FilterButtons 
              options={filterOptions}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
          
          <AuctionTable records={mockAuctions} filter={activeFilter as any} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Auction Schedule</h2>
            <div className="grid grid-cols-2 gap-4">
              <Calendar 
                month="July" 
                year={2024} 
                selectedDate={5} 
                highlightedDates={[15, 22, 29]} 
              />
              <Calendar 
                month="August" 
                year={2024} 
                highlightedDates={[5, 12]} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
