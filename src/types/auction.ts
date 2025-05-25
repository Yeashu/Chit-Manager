export interface Bid {
  id: string;
  auction_id: string;
  bidder_name?: string;
  bidder_email?: string;
  bid_amount: string;
  placed_at: string;
}

export interface AuctionWithBids {
  id: string;
  group_id: string;
  round_number: number;
  auction_date: string;
  deadline: string;
  status: 'open' | 'closed';
  winner_id?: string;
  winner_bid?: string;
  winner_name?: string;
  winner_email?: string;
  payout_status?: string;
  bids?: Bid[];
  group_name?: string;
  group_contribution?: number;
  group_total_members?: number;
}
