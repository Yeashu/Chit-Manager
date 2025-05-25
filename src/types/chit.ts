export interface ChitGroup {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  monthly_contribution: number;
  total_members: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  duration_months: number;
  created_by: string;
}

export interface GroupMember {
  id: string;
  created_at: string;
  user_id: string;
  group_id: string;
  role: 'admin' | 'member';
}

export interface Notification {
  id: string;
  created_at: string;
  group_id: string;
  invited_by_id: string;
  invited_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Auction {
  id: string;
  created_at: string;
  group_id: string;
  round_number: number;
  auction_date: string;
  deadline: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  winner_id: string | null;
  winner_bid: string | null;
}

export interface Bid {
  id: string;
  created_at: string;
  auction_id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Payment {
  id: string;
  paid_at: string;
  user_id: string;
  group_id: string;
  auction_id: string | null;
  amount: number;
  type: 'contribution' | 'payout' | 'refund' | 'received'; // Added 'received'
  status: 'pending' | 'completed' | 'failed';
}

export interface CreateGroupFormData {
  name: string;
  description?: string;
  monthly_contribution: number;
  total_members: number;
  duration_months: number;
}