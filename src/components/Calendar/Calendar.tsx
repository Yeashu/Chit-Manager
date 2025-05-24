import React from 'react';

interface CalendarProps {
  month: string;
  year: number;
  selectedDate?: number;
  highlightedDates?: number[];
  onDateSelect?: (date: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  month,
  year,
  selectedDate,
  highlightedDates = [],
  onDateSelect,
}) => {
  // Mock days for display (would be calculated in a real implementation)
  const daysInMonth = 30; // Example, would be calculated based on month and year
  const startDay = 0; // Sunday (0) to Saturday (6)
  
  // Generate days array
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Generate empty cells for the start of the month
  const emptyCells = Array.from({ length: startDay }, (_, i) => null);
  
  // All cells including empty ones
  const allCells = [...emptyCells, ...days];
  
  // Week days
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button className="text-gray-400">
          &lt;
        </button>
        <h3 className="text-lg font-medium">{month} {year}</h3>
        <button className="text-gray-400">
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center text-sm text-gray-400 mb-2">
            {day}
          </div>
        ))}
        
        {allCells.map((day, index) => (
          <div 
            key={index} 
            className={`
              aspect-square flex items-center justify-center rounded-full text-sm
              ${day === selectedDate ? 'bg-green-500 text-white' : ''}
              ${day && highlightedDates.includes(day) ? 'bg-[#2a3a2a] text-white' : ''}
              ${day ? 'cursor-pointer hover:bg-gray-700' : ''}
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
