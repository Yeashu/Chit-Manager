import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GroupCardProps {
  id: string;
  name: string;
  memberCount: number;
  nextAuctionDate: string;
  imagePattern: 'pattern1' | 'pattern2' | 'pattern3' | 'pattern4' | 'pattern5';
}

const GroupCard: React.FC<GroupCardProps> = ({
  id,
  name,
  memberCount,
  nextAuctionDate,
  imagePattern = 'pattern1',
}) => {
  // Map of pattern image paths
  const patternImages = {
    pattern1: '/patterns/pattern1.png',
    pattern2: '/patterns/pattern2.png',
    pattern3: '/patterns/pattern3.png',
    pattern4: '/patterns/pattern4.png',
    pattern5: '/patterns/pattern5.png',
  };

  return (
    <Link href={`/GroupDetail/${id}`}>
      <div className="bg-[#f8f4ed] rounded-lg p-4 w-full max-w-[230px] cursor-pointer hover:shadow-md transition-shadow duration-200">
        <div className="w-full h-40 mb-4 rounded-md overflow-hidden relative">
          <Image
            src={patternImages[imagePattern]}
            alt={`${name} pattern`}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="text-[#1c2c1c]">
          <h3 className="font-semibold text-lg mb-1">{name}</h3>
          <p className="text-sm text-gray-600 mb-1">{memberCount} members</p>
          <p className="text-sm text-gray-600">Next auction: {nextAuctionDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
