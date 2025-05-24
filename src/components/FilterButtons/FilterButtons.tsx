import React from 'react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterButtonsProps {
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  options,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex space-x-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onFilterChange(option.id)}
          className={`px-4 py-1.5 rounded-md transition-colors ${
            activeFilter === option.id
              ? 'bg-[#2a3a2a] text-white'
              : 'bg-transparent text-gray-400 hover:bg-[#2a3a2a] hover:text-white'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
