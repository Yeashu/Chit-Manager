'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { 
  Auction,
  AuctionWithBids,
  CreateAuctionFormData,
  ActionResponse,
  Bid
} from '@/types'

/**
 * Create a new auction for a chit fund group
 */
export async function createAuction(
  groupId: string,
  formData: CreateAuctionFormData
): Promise<ActionResponse<Auction>> {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Authentication required' }
    }
    
    // Validate that the group exists and user has admin permission
    const { data: groupData } = await supabase
      .from('chit_groups')
      .select(`
        id, 
        status, 
        created_by,
        group_members!inner(role)
      `)
      .eq('id', groupId)
      .eq('group_members.user_id', user.id)
      .eq('group_members.role', 'admin')
      .single()
      
    if (!groupData) {
      return { success: false, error: 'Group not found or you do not have admin permissions' }
    }

    if (groupData.status !== 'active') {
      return { success: false, error: 'Group must be active to create auctions' }
    }

    // Create the auction with admin as default winner
    const { data: auction, error } = await supabase
      .from('auctions')
      .insert({
        group_id: groupId,
        round_number: formData.round_number,
        auction_date: formData.auction_date,
        deadline: formData.deadline,
        status: 'open',
        winner_id: groupData.created_by, // Set group admin as default winner
        winner_bid: '0' // Default bid amount for admin
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/GroupDetail/${groupId}`)
    revalidatePath('/Auctions')

    return {
      success: true,
      data: auction,
      message: 'Auction created successfully'
    }
  } catch (error) {
    console.error('Error creating auction:', error)
    return { success: false, error: 'Failed to create auction' }
  }
}

/**
 * Get details of a specific auction including bids
 */
export async function getAuctionDetails(
  auctionId: string
): Promise<ActionResponse<AuctionWithBids>> {
  try {
    const supabase = await createClient()
    
    // Get auction details with bids and user profiles
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select(`
        *,
        winner:user_profile(name, email),
        chit_groups(name, monthly_contribution),
        bids(
          id,
          bid_amount,
          created_at,
          bidder:user_profile(name, email)
        )
      `)
      .eq('id', auctionId)
      .single()

    if (auctionError) throw auctionError

    if (!auction) {
      return {
        success: false,
        error: 'Auction not found'
      }
    }

    // Transform data to match AuctionWithBids interface
    const transformedBids = (auction.bids || []).map((bid: any) => ({
      id: bid.id,
      auction_id: auctionId,
      bid_amount: bid.bid_amount,
      placed_at: bid.created_at,
      bidder_name: bid.bidder?.name,
      bidder_email: bid.bidder?.email
    }))

    const auctionWithBids: AuctionWithBids = {
      ...auction,
      bids: transformedBids,
      winner_name: auction.winner?.name,
      winner_email: auction.winner?.email,
      group_name: auction.chit_groups?.name,
      group_contribution: auction.chit_groups?.monthly_contribution
    }

    return {
      success: true,
      data: auctionWithBids
    }
  } catch (error) {
    console.error('Error getting auction details:', error)
    return { success: false, error: 'Failed to get auction details' }
  }
}

/**
 * Get all auctions for a group
 */
export async function getGroupAuctions(
  groupId: string
): Promise<ActionResponse<Auction[]>> {
  try {
    const supabase = await createClient()
    
    const { data: auctions, error } = await supabase
      .from('auctions')
      .select(`
        *,
        winner:user_profile(name, email)
      `)
      .eq('group_id', groupId)
      .order('auction_date', { ascending: true })

    if (error) throw error

    const transformedAuctions = auctions.map(auction => ({
      ...auction,
      winner_name: auction.winner?.name,
      winner_email: auction.winner?.email
    }))

    return {
      success: true,
      data: transformedAuctions
    }
  } catch (error) {
    console.error('Error getting group auctions:', error)
    return { success: false, error: 'Failed to get group auctions' }
  }
}

/**
 * Place a bid in an auction
 */
export async function placeBid(
  auctionId: string,
  bidAmount: number
): Promise<ActionResponse<Bid>> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }
    
    // Validate auction status
    const { data: auction } = await supabase
      .from('auctions')
      .select('status, group_id')
      .eq('id', auctionId)
      .single()

    if (!auction) {
      return { success: false, error: 'Auction not found' }
    }

    if (auction.status !== 'open') {
      return { success: false, error: 'Auction is not open for bidding' }
    }

    // Place the bid
    const { data: bid, error } = await supabase
      .from('bids')
      .insert({
        auction_id: auctionId,
        user_id: user.id,
        bid_amount: bidAmount.toString() // Convert to text as per schema
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/GroupDetail/${auction.group_id}`)
    revalidatePath('/Auctions')

    return {
      success: true,
      data: bid,
      message: 'Bid placed successfully'
    }
  } catch (error) {
    console.error('Error placing bid:', error)
    return { success: false, error: 'Failed to place bid' }
  }
}

/**
 * Helper: Distribute profit among group members (except winner) after auction closes
 */
async function distributeProfitAfterAuction(auctionId: string) {
  const supabase = await createClient();

  // Fetch auction with group info
  const { data: auction, error: auctionError } = await supabase
    .from('auctions')
    .select(`*, chit_groups!auctions_group_id_fkey(monthly_contribution, total_members)`)
    .eq('id', auctionId)
    .single();

  if (auctionError || !auction || !auction.group_id || !auction.winner_id || !auction.winner_bid) {
    console.error('Profit distribution: Invalid auction or missing data');
    return;
  }

  // Parse all values as numbers
  const monthlyContribution = Number(auction.chit_groups.monthly_contribution);
  const totalMembers = Number(auction.chit_groups.total_members);
  const winnerBid = Number(auction.winner_bid);
  const totalContributions = monthlyContribution * totalMembers;
  const profit = (totalContributions - winnerBid) / totalMembers;

  // Debug log
  console.log('[Profit Distribution]', {
    monthlyContribution,
    totalMembers,
    winnerBid,
    totalContributions,
    profit
  });

  if (profit <= 0 || totalMembers < 1) {
    // Nothing to distribute
    return;
  }

  // Get all group members (including the winner)
  const { data: members, error: membersError } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', auction.group_id);

  if (membersError || !members) {
    console.error('Profit distribution: Could not fetch group members');
    return;
  }

  if (members.length === 0) return;

  const share = profit / totalMembers;
  const now = new Date().toISOString();

  // Insert a profit payment for each member (including the winner)
  const profitPayments = members.map((member: any) => ({
    paid_at: now,
    user_id: member.user_id,
    group_id: auction.group_id,
    auction_id: auctionId,
    amount: share,
    type: 'payout',
    status: 'completed',
  }));

  // Insert a separate payment for the winner's bid
  const winnerPayment = {
    paid_at: now,
    user_id: auction.winner_id,
    group_id: auction.group_id,
    auction_id: auctionId,
    amount: winnerBid,
    type: 'winner',
    status: 'completed',
  };

  const { error: paymentError } = await supabase
    .from('payments')
    .insert([...profitPayments, winnerPayment]);

  if (paymentError) {
    console.error('Profit distribution: Error inserting payments', paymentError);
  }
}

/**
 * Close an auction and declare the winner
 */
export async function closeAuction(
  auctionId: string
): Promise<ActionResponse<Auction>> {
  try {
    const supabase = await createClient()

    // Get auction with bids and profiles
    const { data: auction } = await supabase
      .from('auctions')
      .select(`
        *,
        bids(
          id,
          bid_amount,
          user_id,
          bidder:user_profile(name, email)
        )
      `)
      .eq('id', auctionId)
      .single()

    if (!auction) {
      return { success: false, error: 'Auction not found' }
    }

    if (auction.status !== 'open') {
      return { success: false, error: 'Auction is not open' }
    }

    // Find winning bid (lowest amount)
    const winningBid = auction.bids.reduce((lowest: any, current: any) => 
      !lowest || parseInt(current.bid_amount) < parseInt(lowest.bid_amount) ? current : lowest
    , null)

    // Update auction status and winner
    const { data: updatedAuction, error } = await supabase
      .from('auctions')
      .update({
        status: 'closed',
        winner_id: winningBid?.user_id,
        winner_bid: winningBid?.bid_amount
      })
      .eq('id', auctionId)
      .select(`
        *,
        winner:user_profile(name, email)
      `)
      .single()

    if (error) throw error

    const transformedAuction = {
      ...updatedAuction,
      winner_name: updatedAuction.winner?.name,
      winner_email: updatedAuction.winner?.email
    }

    revalidatePath(`/GroupDetail/${auction.group_id}`)
    revalidatePath('/Auctions')

    // Distribute profit among group members (except winner)
    await distributeProfitAfterAuction(auctionId);

    return {
      success: true,
      data: transformedAuction,
      message: 'Auction closed successfully'
    }
  } catch (error) {
    console.error('Error closing auction:', error)
    return { success: false, error: 'Failed to close auction' }
  }
}

/**
 * Get all auctions for the current user across all groups
 */
export async function getUserAuctions(): Promise<ActionResponse<Auction[]>> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }
    
    // Get all auctions for groups where the user is a member
    const { data: auctions, error } = await supabase
      .from('auctions')
      .select(`
        *,
        winner:user_profile(name, email),
        chit_groups!inner(
          id,
          name,
          group_members!inner(user_id)
        )
      `)
      .eq('chit_groups.group_members.user_id', user.id)
      .order('auction_date', { ascending: false })

    if (error) throw error

    // Transform auctions to include winner details
    const transformedAuctions = auctions.map(auction => ({
      ...auction,
      winner_name: auction.winner?.name,
      winner_email: auction.winner?.email
    }))

    return {
      success: true,
      data: transformedAuctions
    }
  } catch (error) {
    console.error('Error getting user auctions:', error)
    return { success: false, error: 'Failed to get user auctions' }
  }
}

/**
 * Get all auctions for a specific group
 */
export async function fetchGroupAuctions(
  groupId: string
): Promise<ActionResponse<Auction[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('group_id', groupId)
      .order('round_number', { ascending: true });

    if (error) {
      console.error('Error fetching auctions:', error);
      return { success: false, error: 'Failed to fetch auctions' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return { success: false, error: 'Failed to fetch auctions' };
  }
}