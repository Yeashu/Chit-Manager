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
    
    // Validate that the group exists and user has permission
    const { data: group } = await supabase
      .from('chit_groups')
      .select('id, status, created_by')
      .eq('id', groupId)
      .single()
      
    if (!group) {
      return { success: false, error: 'Group not found' }
    }

    if (group.status !== 'active') {
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
        winner_id: group.created_by, // Set group admin as default winner
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
    const transformedBids = (auction.bids || []).map((bid: Bid) => ({
      id: bid.id,
      amount: bid.bid_amount,
      userId: bid.user_id,
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
    const winningBid = auction.bids.reduce((lowest: Bid | null, current: Bid) =>
      !lowest || current.bid_amount < lowest.bid_amount ? current : lowest
    , null)

    // Calculate total pool (sum of all contributions for this auction)
    const { data: group } = await supabase
      .from('chit_groups')
      .select('monthly_contribution, total_members')
      .eq('id', auction.group_id)
      .single()

    if (!group) {
      return { success: false, error: 'Group not found' }
    }

    const totalPool = group.monthly_contribution * group.total_members
    const winnerId = winningBid?.user_id
    const winnerBid = winningBid?.bid_amount || 0
    const profitPool = totalPool - winnerBid

    // Get all group members except the winner
    const { data: members } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', auction.group_id)

    if (!members) {
      return { success: false, error: 'No members found in the group' }
    }

    const eligibleMembers = members.filter((m: { user_id: string }) => m.user_id !== winnerId)
    const profitPerMember = eligibleMembers.length > 0 ? profitPool / eligibleMembers.length : 0

    // Insert profit payments for each eligible member
    const profitInserts = eligibleMembers.map((member: { user_id: string }) => ({
      user_id: member.user_id,
      group_id: auction.group_id,
      auction_id: auctionId,
      amount: profitPerMember,
      type: 'received', // Mark as profit
      status: 'completed',
      paid_at: new Date().toISOString()
    }))

    if (profitInserts.length > 0) {
      const { error: insertError } = await supabase.from('payments').insert(profitInserts)
      if (insertError) {
        throw insertError
      }
    }

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
      return { success: false, data: [], error: 'Failed to fetch auctions' }; // Added `success` property
    }

    return { success: true, data, error: undefined };
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return { success: false, data: [], error: 'Failed to fetch auctions' }; // Added `success` property
  }
}