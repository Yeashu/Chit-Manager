// Database Types
export interface ChitGroup {
  id: string;
  name: string;
  description?: string;
  monthly_contribution: number;
  total_members: number;
  duration_months: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
}

export interface ChitGroupWithCreator extends ChitGroup {
  creator_email?: string;
  creator_name?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface Member {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  status: 'invited' | 'active' | 'inactive';
  invited_by?: string;
  invited_at?: string;
  joined_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MemberWithUser extends Member {
  user: {
    id: string;
    name?: string;
    email: string;
  };
  invited_by_user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface Auction {
  id: string;
  group_id: string;
  round_number: number;
  auction_date: string;
  deadline: string;
  status: 'scheduled' | 'open' | 'closed' | 'cancelled';
  winner_id?: string;
  winner_bid?: number;
  winner_name?: string;
  winner_email?: string;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  auction_id: string;
  user_id: string;
  bid_amount: number;
  placed_at: string;
}

export interface BidWithBidder extends Bid {
  bidder_email: string;
  bidder_name?: string;
}

export interface AuctionWithBids extends Auction {
  bids: BidWithBidder[];
  group_name?: string;
  group_contribution?: string;
  group_total_members?: number;
}

export interface Payment {
  id: string;
  user_id: string;
  group_id: string;
  auction_id?: string;
  amount: number;
  type: 'contribution' | 'payout' | 'received';
  status: 'pending' | 'completed' | 'failed';
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentWithDetails extends Payment {
  group_name: string;
  auction_round?: number;
  user_email?: string;
  user_name?: string;
}

export interface Notification {
  id: string;
  group_id: string;
  invited_by_id: string;
  invited_user_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'read';
  type: 'group_invite' | 'system_alert';
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationWithContext extends Notification {
  group_name: string;
  inviter_email?: string;
  inviter_name?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface ApiSuccessResponse {
  success: boolean;
  error: string | null;
}

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Input Types
export interface CreateGroupFormData {
  name: string;
  description?: string;
  monthly_contribution: number;
  total_members: number;
  duration_months: number;
}

export interface UpdateGroupFormData {
  name?: string;
  description?: string;
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
}

export interface CreateAuctionFormData {
  round_number: number;
  auction_date: string;
  deadline: string;
}

export interface RecordPaymentFormData {
  user_id: string;
  group_id: string;
  auction_id?: string;
  amount: number;
  type: 'contribution' | 'payout' | 'received';
  status: 'pending' | 'completed' | 'failed';
  paid_at?: string;
}