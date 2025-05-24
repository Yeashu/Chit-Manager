'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { 
  Payment,
  PaymentWithDetails,
  RecordPaymentFormData,
  ActionResponse
} from '@/types'

/**
 * Record a new payment (contribution or payout)
 */
export async function recordPayment(
  formData: RecordPaymentFormData
): Promise<ActionResponse<Payment>> {
  try {
    const supabase = await createClient()
    
    // Get current user for validation
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate the group membership
    const { data: member } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', formData.group_id)
      .eq('user_id', formData.user_id)
      .single()

    if (!member) {
      return { success: false, error: 'User is not a member of this group' }
    }

    // Create the payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        user_id: formData.user_id,
        group_id: formData.group_id,
        auction_id: formData.auction_id,
        amount: formData.amount.toString(), // Convert to text as per schema
        type: formData.type,
        status: formData.status,
        paid_at: formData.paid_at || new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/GroupDetail/${formData.group_id}`)
    revalidatePath('/payments')

    return {
      success: true,
      data: payment,
      message: 'Payment recorded successfully'
    }
  } catch (error) {
    console.error('Error recording payment:', error)
    return { success: false, error: 'Failed to record payment' }
  }
}

/**
 * Get payment history for a user
 */
export async function getUserPayments(
  userId: string
): Promise<ActionResponse<PaymentWithDetails[]>> {
  try {
    const supabase = await createClient()
    
    // Get payments with group and user details
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        chit_groups!payments_group_id_fkey(name),
        auctions!payments_auction_id_fkey(round_number),
        user_profile!payments_user_id_fkey(email, name)
      `)
      .eq('user_id', userId)
      .order('paid_at', { ascending: false })

    if (error) throw error

    // Transform data to match PaymentWithDetails interface
    const transformedPayments: PaymentWithDetails[] = payments.map((payment: any) => ({
      ...payment,
      group_name: payment.chit_groups?.name,
      auction_round: payment.auctions?.round_number,
      user_email: payment.user_profile?.email,
      user_name: payment.user_profile?.name
    }))

    return {
      success: true,
      data: transformedPayments
    }
  } catch (error) {
    console.error('Error getting user payments:', error)
    return { success: false, error: 'Failed to get payment history' }
  }
}

/**
 * Get all payments for a group
 */
export async function getGroupPayments(
  groupId: string
): Promise<ActionResponse<PaymentWithDetails[]>> {
  try {
    const supabase = await createClient()
    
    // Get payments with user details
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        chit_groups!payments_group_id_fkey(name),
        auctions!payments_auction_id_fkey(round_number),
        user_profile!payments_user_id_fkey(email, name)
      `)
      .eq('group_id', groupId)
      .order('paid_at', { ascending: false })

    if (error) throw error

    // Transform data to match PaymentWithDetails interface
    const transformedPayments: PaymentWithDetails[] = payments.map((payment: any) => ({
      ...payment,
      group_name: payment.chit_groups?.name,
      auction_round: payment.auctions?.round_number,
      user_email: payment.user_profile?.email,
      user_name: payment.user_profile?.name
    }))

    return {
      success: true,
      data: transformedPayments
    }
  } catch (error) {
    console.error('Error getting group payments:', error)
    return { success: false, error: 'Failed to get group payments' }
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: Payment['status']
): Promise<ActionResponse<Payment>> {
  try {
    const supabase = await createClient()
    
    // Get current user for validation
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get payment details
    const { data: payment } = await supabase
      .from('payments')
      .select('group_id')
      .eq('id', paymentId)
      .single()

    if (!payment) {
      return { success: false, error: 'Payment not found' }
    }

    // Verify user is an admin of the group
    const { data: member } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', payment.group_id)
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single()

    if (!member) {
      return { success: false, error: 'Only group admins can update payment status' }
    }

    // Update payment status
    const { data: updatedPayment, error } = await supabase
      .from('payments')
      .update({ 
        status,
        paid_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/GroupDetail/${payment.group_id}`)
    revalidatePath('/payments')

    return {
      success: true,
      data: updatedPayment,
      message: 'Payment status updated successfully'
    }
  } catch (error) {
    console.error('Error updating payment status:', error)
    return { success: false, error: 'Failed to update payment status' }
  }
}

/**
 * Process auction winner payout
 */
export async function processAuctionPayout(
  auctionId: string
): Promise<ActionResponse<Payment>> {
  try {
    const supabase = await createClient()
    
    // Get auction details with group info
    const { data: auction } = await supabase
      .from('auctions')
      .select(`
        *,
        chit_groups!auctions_group_id_fkey(monthly_contribution, total_members)
      `)
      .eq('id', auctionId)
      .single()

    if (!auction || !auction.winner_id || !auction.winner_bid) {
      return { success: false, error: 'Invalid auction or no winner declared' }
    }

    // Calculate payout amount (total contributions minus winning bid)
    const totalAmount = parseInt(auction.chit_groups.monthly_contribution) * auction.chit_groups.total_members
    const payoutAmount = totalAmount - parseInt(auction.winner_bid)

    // Record the payout
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        user_id: auction.winner_id,
        group_id: auction.group_id,
        auction_id: auctionId,
        amount: payoutAmount.toString(),
        type: 'payout',
        status: 'completed',
        paid_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/GroupDetail/${auction.group_id}`)
    revalidatePath('/payments')
    revalidatePath('/Auctions')

    return {
      success: true,
      data: payment,
      message: 'Auction payout processed successfully'
    }
  } catch (error) {
    console.error('Error processing auction payout:', error)
    return { success: false, error: 'Failed to process auction payout' }
  }
}