import React, { useState, useEffect } from 'react';

interface CalendarProps {
  month?: string;
  year?: number;
  selectedDate?: number;
  highlightedDates?: number[];
  onDateSelect?: (date: number) => void;
  onMonthChange?: (month: number, year: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  month: initialMonth,
  year: initialYear,
  selectedDate,
  highlightedDates = [],
  onDateSelect,
  onMonthChange,
}) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function getMonthNumber(monthName: string): number {
    return monthNames.findIndex(name => name.toLowerCase() === monthName.toLowerCase());
  }

  // Use props directly instead of state to avoid conflicts
  const currentMonth = initialMonth ? getMonthNumber(initialMonth) : new Date().getMonth();
  const currentYear = initialYear || new Date().getFullYear();

  // Calculate days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Calculate the starting day of the month (0 = Sunday, 6 = Saturday)
  const startDay = new Date(currentYear, currentMonth, 1).getDay();
  
  // Generate days array
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Generate empty cells for the start of the month
  const emptyCells = Array.from({ length: startDay }, (_, i) => null);
  
  // All cells including empty ones
  const allCells = [...emptyCells, ...days];
  
  // Week days
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    let newMonth = currentMonth;
    let newYear = currentYear;
    
    if (direction === 'next') {
      newMonth += 1;
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
    } else {
      newMonth -= 1;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
    }
    
    onMonthChange?.(newMonth, newYear);
  };

  return (
    <div className="w-full bg-[#2a3a2a] p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <button 
          className="text-gray-400 hover:text-white p-1"
          onClick={() => navigateMonth('prev')}
        >
          &#8249;
        </button>
        <h3 className="text-lg font-medium text-white">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button 
          className="text-gray-400 hover:text-white p-1"
          onClick={() => navigateMonth('next')}
        >
          &#8250;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center text-sm text-gray-400 mb-2 font-medium">
            {day}
          </div>
        ))}
        
        {allCells.map((day, index) => (
          <div 
            key={index} 
            className={`
              aspect-square flex items-center justify-center rounded-full text-sm transition-colors
              ${day === selectedDate ? 'bg-green-500 text-white font-bold' : ''}
              ${day && highlightedDates.includes(day) ? 'bg-green-600/30 text-green-300 ring-1 ring-green-500' : ''}
              ${day ? 'cursor-pointer hover:bg-gray-600 text-gray-200' : ''}
              ${!day ? 'text-transparent' : ''}
            `}
            onClick={() => day && onDateSelect?.(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
