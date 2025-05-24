'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import FilterButtons from '@/components/FilterButtons';
import CountdownTimer from '@/components/CountdownTimer';
import AuctionTable from '@/components/AuctionTable';
import Calendar from '@/components/Calendar';
import Button from '@/components/Button';

type FilterType = 'all' | 'completed' | 'upcoming';

const filterOptions = [
  { id: 'all' as const, label: 'All' },
  { id: 'completed' as const, label: 'Completed' },
  { id: 'upcoming' as const, label: 'Upcoming' },
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
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedDate, setSelectedDate] = useState<number | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<{ month: number; year: number } | undefined>();
  
  // Separate state for each calendar
  const [calendar1, setCalendar1] = useState({ month: 'July', year: 2024 });
  const [calendar2, setCalendar2] = useState({ month: 'August', year: 2024 });

  // Mock countdown data (would be calculated in a real app)
  const countdown = {
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 18,
  };
  
  // Extract auction dates for calendar highlighting - fixed to work with month numbers
  const getAuctionDatesForMonth = (month: number, year: number) => {
    return mockAuctions
      .filter(auction => {
        const auctionDate = new Date(auction.date);
        return auctionDate.getMonth() === month && auctionDate.getFullYear() === year;
      })
      .map(auction => new Date(auction.date).getDate());
  };

  const handleDateSelect = (date: number, month: number, year: number) => {
    setSelectedDate(date);
    setSelectedMonth({ month, year });
  };

  const handleCalendar1Change = (month: number, year: number) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    setCalendar1({ month: monthNames[month], year });
    setSelectedDate(undefined);
  };

  const handleCalendar2Change = (month: number, year: number) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    setCalendar2({ month: monthNames[month], year });
    setSelectedDate(undefined);
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId as FilterType);
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
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <AuctionTable records={mockAuctions} filter={activeFilter} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Auction Schedule</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Calendar 
                month={calendar1.month}
                year={calendar1.year}
                selectedDate={selectedMonth?.month === (new Date(`${calendar1.month} 1, ${calendar1.year}`).getMonth()) && selectedMonth?.year === calendar1.year ? selectedDate : undefined}
                highlightedDates={getAuctionDatesForMonth(new Date(`${calendar1.month} 1, ${calendar1.year}`).getMonth(), calendar1.year)}
                onDateSelect={(date) => handleDateSelect(date, new Date(`${calendar1.month} 1, ${calendar1.year}`).getMonth(), calendar1.year)}
                onMonthChange={handleCalendar1Change}
              />
              <Calendar 
                month={calendar2.month}
                year={calendar2.year}
                selectedDate={selectedMonth?.month === (new Date(`${calendar2.month} 1, ${calendar2.year}`).getMonth()) && selectedMonth?.year === calendar2.year ? selectedDate : undefined}
                highlightedDates={getAuctionDatesForMonth(new Date(`${calendar2.month} 1, ${calendar2.year}`).getMonth(), calendar2.year)}
                onDateSelect={(date) => handleDateSelect(date, new Date(`${calendar2.month} 1, ${calendar2.year}`).getMonth(), calendar2.year)}
                onMonthChange={handleCalendar2Change}
              />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Selected Date Details</h2>
            <div className="bg-[#2a3a2a] p-4 rounded-lg">
              {selectedDate && selectedMonth ? (
                <div>
                  <p className="text-green-400 mb-2">
                    Selected: {selectedDate}/{selectedMonth.month + 1}/{selectedMonth.year}
                  </p>
                  {(() => {
                    const selectedDateString = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
                    const auctionForDate = mockAuctions.find(auction => auction.date === selectedDateString);
                    return auctionForDate ? (
                      <div>
                        <p><strong>Round:</strong> {auctionForDate.round}</p>
                        <p><strong>Winner:</strong> {auctionForDate.winner}</p>
                        <p><strong>Bid Amount:</strong> {auctionForDate.bidAmount}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400">No auction scheduled for this date</p>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-gray-400">Select a date to view auction details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
