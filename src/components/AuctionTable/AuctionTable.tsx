import React from 'react';
import Button from '../Button';

interface AuctionRecord {
  round: string;
  winner: string;
  bidAmount: string;
  date: string;
}

interface AuctionTableProps {
  records: AuctionRecord[];
  filter?: 'all' | 'completed' | 'upcoming';
}

const AuctionTable: React.FC<AuctionTableProps> = ({
  records,
  filter = 'all',
}) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-3 text-gray-400">Round</th>
            <th className="text-left p-3 text-gray-400">Winner</th>
            <th className="text-left p-3 text-gray-400">Bid Amount</th>
            <th className="text-left p-3 text-gray-400">Date</th>
            <th className="text-right p-3 text-gray-400"></th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="p-3">{record.round}</td>
              <td className="p-3">{record.winner}</td>
              <td className="p-3">{record.bidAmount}</td>
              <td className="p-3">{record.date}</td>
              <td className="p-3 text-right">
                <Button variant="secondary" size="sm">
                  Join Live Auction
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuctionTable;
