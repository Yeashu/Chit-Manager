import React from 'react';
import Image from 'next/image';

interface MemberCardProps {
  name?: string;
  email: string;
  trustScore: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
}

const MemberCard: React.FC<MemberCardProps> = ({
  name,
  email,
  trustScore,
  paymentStatus,
}) => {
  const getPaymentStatusColor = () => {
    switch (paymentStatus) {
      case 'Paid':
        return 'text-green-500';
      case 'Pending':
        return 'text-yellow-500';
      case 'Overdue':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-[#2a3424] flex items-center justify-center text-2xl">
        {(name || email).charAt(0).toUpperCase()}
      </div>
      <h3 className="mt-2 font-medium text-sm md:text-base">{name || email}</h3>
      <p className="text-xs md:text-sm text-gray-600">Trust Score: {trustScore}</p>
      <p className={`text-xs md:text-sm ${getPaymentStatusColor()}`}>
        Payment Status: {paymentStatus}
      </p>
    </div>
  );
};

export default MemberCard;
