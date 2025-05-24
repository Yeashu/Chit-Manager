'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import FilterButtons from '@/components/FilterButtons';
import CountdownTimer from '@/components/CountdownTimer';
import Calendar from '@/components/Calendar';
import Button from '@/components/Button';
import PlaceBidModal from '@/components/PlaceBidModal';
import { getUserAuctions, getAuctionDetails } from '@/lib/actions/auctionActions';
import type { Auction } from '@/types';

type FilterType = 'all' | 'completed' | 'upcoming' | 'open';

const filterOptions = [
  { id: 'all' as const, label: 'All' },
  { id: 'upcoming' as const, label: 'Upcoming' },
  { id: 'open' as const, label: 'Open' },
  { id: 'completed' as const, label: 'Completed' },
];

export default function Auctions() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedDate, setSelectedDate] = useState<number | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<{ month: number; year: number } | undefined>();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placeBidModalOpen, setPlaceBidModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  
  // Separate state for each calendar
  const [calendar1, setCalendar1] = useState({ month: 'July', year: 2024 });
  const [calendar2, setCalendar2] = useState({ month: 'August', year: 2024 });

  // Load auctions on component mount
  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserAuctions();
      if (response.success && response.data) {
        setAuctions(response.data);
      } else {
        setError(response.error || 'Failed to load auctions');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Filter auctions based on status
  const filteredAuctions = auctions.filter(auction => {
    if (activeFilter === 'all') return true;
    return auction.status === activeFilter;
  });

  // Get next upcoming auction for countdown
  const upcomingAuction = auctions
    .filter(auction => auction.status === 'scheduled' || auction.status === 'open')
    .sort((a, b) => new Date(a.auction_date).getTime() - new Date(b.auction_date).getTime())[0];

  // Calculate countdown for next auction
  const getCountdown = () => {
    if (!upcomingAuction) return null;
    
    const now = new Date().getTime();
    const auctionTime = new Date(upcomingAuction.auction_date).getTime();
    const timeDiff = auctionTime - now;
    
    if (timeDiff <= 0) return null;
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  const countdown = getCountdown();
  
  // Extract auction dates for calendar highlighting
  const getAuctionDatesForMonth = (month: number, year: number) => {
    return auctions
      .filter((auction: Auction) => {
        const auctionDate = new Date(auction.auction_date);
        return auctionDate.getMonth() === month && auctionDate.getFullYear() === year;
      })
      .map((auction: Auction) => new Date(auction.auction_date).getDate());
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

  const handlePlaceBid = (auctionId: string) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (auction) {
      setSelectedAuction(auction);
      setPlaceBidModalOpen(true);
    }
  };

  const handleBidSuccess = () => {
    setPlaceBidModalOpen(false);
    setSelectedAuction(null);
    loadAuctions(); // Refresh auctions
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  return (
    <div className="flex min-h-screen bg-[#1c2c1c] text-white">
      <Sidebar activeItem="auctions" />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Auctions</h1>
        
        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading auctions...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Upcoming Auction Countdown */}
            {upcomingAuction && countdown && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Next Auction: Round {upcomingAuction.round_number}</h2>
                <CountdownTimer 
                  days={countdown.days}
                  hours={countdown.hours}
                  minutes={countdown.minutes}
                  seconds={countdown.seconds}
                />
              </div>
            )}
            
            {/* Auction History */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Auction History</h2>
                <FilterButtons 
                  options={filterOptions}
                  activeFilter={activeFilter}
                  onFilterChange={handleFilterChange}
                />
              </div>
              
              {/* Custom Auction Table */}
              <div className="bg-[#2a3a2a] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#1c2c1c]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Round</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Winner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Winning Bid</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {filteredAuctions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                            No auctions found
                          </td>
                        </tr>
                      ) : (
                        filteredAuctions.map((auction) => (
                          <tr key={auction.id} className="hover:bg-[#1c2c1c]">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              Round {auction.round_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {formatDate(auction.auction_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                auction.status === 'closed' ? 'bg-gray-500 text-gray-100' :
                                auction.status === 'open' ? 'bg-green-500 text-green-100' :
                                auction.status === 'scheduled' ? 'bg-blue-500 text-blue-100' :
                                'bg-yellow-500 text-yellow-100'
                              }`}>
                                {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {auction.winner_id ? 'Winner determined' : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {auction.winner_bid ? formatCurrency(auction.winner_bid) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {auction.status === 'open' && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handlePlaceBid(auction.id)}
                                >
                                  Place Bid
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Calendar and Selected Date Details */}
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
                        const auctionForDate = auctions.find((auction: Auction) => {
                          const auctionDate = new Date(auction.auction_date).toISOString().split('T')[0];
                          return auctionDate === selectedDateString;
                        });
                        return auctionForDate ? (
                          <div>
                            <p><strong>Round:</strong> {auctionForDate.round_number}</p>
                            <p><strong>Status:</strong> {auctionForDate.status}</p>
                            {auctionForDate.winner_bid && (
                              <p><strong>Winning Bid:</strong> {formatCurrency(auctionForDate.winner_bid)}</p>
                            )}
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
          </>
        )}
      </div>

      {/* Place Bid Modal */}
      {placeBidModalOpen && selectedAuction && (
        <PlaceBidModal
          auctionId={selectedAuction.id}
          roundNumber={selectedAuction.round_number}
          deadline={selectedAuction.deadline}
          isOpen={placeBidModalOpen}
          onClose={() => setPlaceBidModalOpen(false)}
          onBidPlaced={handleBidSuccess}
        />
      )}
    </div>
  );
}
