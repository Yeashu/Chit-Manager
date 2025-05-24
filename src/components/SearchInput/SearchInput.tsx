import React from 'react';
import { IconSearch } from '@tabler/icons-react';

interface SearchInputProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search',
  onChange,
  value = '',
  className = '',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <IconSearch size={18} stroke={1.5} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-[#2a3a2a] text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
      />
    </div>
  );
};

export default SearchInput;
