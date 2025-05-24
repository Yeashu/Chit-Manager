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

    // Create the auction
    const { data: auction, error } = await supabase
      .from('auctions')
      .insert({
        group_id: groupId,
        round_number: formData.round_number,
        auction_date: formData.auction_date,
        deadline: formData.deadline,
        status: 'scheduled'
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
    
    // Get auction details
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select(`
        *,
        bids:bids(
          id,
          user_id,
          bid_amount,
          created_at,
          users!bids_user_id_fkey(email, full_name)
        )
      `)
      .eq('id', auctionId)
      .single()

    if (auctionError) throw auctionError

    // Transform bids data to match BidWithBidder interface
    const transformedBids = auction.bids.map((bid: any) => ({
      id: bid.id,
      auction_id: auctionId,
      user_id: bid.user_id,
      bid_amount: bid.bid_amount,
      placed_at: bid.placed_at,
      bidder_email: bid.users.email,
      bidder_name: bid.users.full_name
    }))

    const auctionWithBids: AuctionWithBids = {
      ...auction,
      bids: transformedBids
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
      .select('*')
      .eq('group_id', groupId)
      .order('auction_date', { ascending: true })

    if (error) throw error

    return {
      success: true,
      data: auctions
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

    // Get auction with lowest bid
    const { data: auction } = await supabase
      .from('auctions')
      .select(`
        *,
        bids:bids(
          id,
          user_id,
          bid_amount
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
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/GroupDetail/${auction.group_id}`)
    revalidatePath('/Auctions')

    return {
      success: true,
      data: updatedAuction,
      message: 'Auction closed successfully'
    }
  } catch (error) {
    console.error('Error closing auction:', error)
    return { success: false, error: 'Failed to close auction' }
  }
}