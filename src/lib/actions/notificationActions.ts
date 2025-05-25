'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { 
  Notification,
  NotificationWithContext,
  ActionResponse
} from '@/types'

/**
 * Create a group invitation notification
 */
export async function createInvitation(
  groupId: string,
  invitedUserId: string
): Promise<ActionResponse<Notification>> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Create notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        group_id: groupId,
        invited_by_id: user.id,
        invited_user_id: invitedUserId,
        status: 'pending'
        // type: 'group_invite' // <-- Remove this line if the 'type' column does not exist
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/notifications')
    return {
      success: true,
      data: notification,
      message: 'Invitation sent successfully'
    }
  } catch (error) {
    console.error('Error creating invitation:', error)
    return { success: false, error: 'Failed to send invitation' }
  }
}

/**
 * Get notifications for the current user
 */
export async function getUserNotifications(): Promise<ActionResponse<NotificationWithContext[]>> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get notifications with all context using the new user_profile table
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select(`
        *,
        chit_groups(name),
        inviter:user_profile!notifications_invited_by_id_fkey(name, email),
        invited_user:user_profile!notifications_invited_user_id_fkey(name, email)
      `)
      .eq('invited_user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    if (!notifications || notifications.length === 0) {
      return {
        success: true,
        data: []
      }
    }

    // Transform data to match NotificationWithContext type
    const notificationsWithContext = notifications.map((notification: any) => ({
      ...notification,
      group_name: notification.chit_groups?.name,
      inviter_name: notification.inviter?.name,
      inviter_email: notification.inviter?.email,
      invited_user_name: notification.invited_user?.name,
      invited_user_email: notification.invited_user?.email
    }))

    return {
      success: true,
      data: notificationsWithContext
    }
  } catch (error) {
    console.error('Error getting notifications:', error)
    return { success: false, error: 'Failed to get notifications' }
  }
}

/**
 * Update notification status
 */
export async function updateNotificationStatus(
  notificationId: string,
  status: Notification['status']
): Promise<ActionResponse<Notification>> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Update notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .update({ status })
      .eq('id', notificationId)
      .eq('invited_user_id', user.id) // Ensure user owns the notification
      .select()
      .single()

    if (error) throw error

    revalidatePath('/notifications')
    return {
      success: true,
      data: notification,
      message: 'Notification updated successfully'
    }
  } catch (error) {
    console.error('Error updating notification:', error)
    return { success: false, error: 'Failed to update notification' }
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  notificationId: string
): Promise<ActionResponse<{ deleted: boolean }>> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Delete notification
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('invited_user_id', user.id) // Ensure user owns the notification

    if (error) throw error

    revalidatePath('/notifications')
    return {
      success: true,
      data: { deleted: true },
      message: 'Notification deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return { success: false, error: 'Failed to delete notification' }
  }
}