'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Member, MemberWithUser, ActionResponse } from '@/types';

/**
 * Invite a member to join a group
 */
export async function inviteMemberToGroup(
  groupId: string,
  email: string
): Promise<ActionResponse<{ invitationId: string }>> {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // Check if the current user is an admin of the group
    const { data: currentMember, error: memberError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !currentMember) {
      return { success: false, error: 'You are not a member of this group' };
    }

    if (currentMember.role !== 'admin') {
      return { success: false, error: 'Only group admins can invite members' };
    }

    // Check if user with this email exists
    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !targetUser) {
      return { success: false, error: 'User with this email does not exist' };
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', targetUser.id)
      .single();

    if (existingMember) {
      return { success: false, error: 'User is already a member of this group' };
    }

    // Create invitation (add as member)
    const { data: invitation, error: inviteError } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: targetUser.id,
        role: 'member'
      })
      .select('id')
      .single();

    if (inviteError || !invitation) {
      return { success: false, error: 'Failed to send invitation' };
    }

    revalidatePath(`/GroupDetail/${groupId}`);
    return { 
      success: true, 
      data: { invitationId: invitation.id },
      message: 'Invitation sent successfully'
    };
  } catch (error) {
    console.error('Error inviting member:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get all members of a group
 */
export async function getGroupMembers(groupId: string): Promise<ActionResponse<MemberWithUser[]>> {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // Check if the current user is a member of the group
    const { data: currentMember, error: memberError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !currentMember) {
      return { success: false, error: 'You are not a member of this group' };
    }

    // Get all members with user details
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select(`
        *,
        users!group_members_user_id_fkey (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });

    if (membersError) {
      return { success: false, error: 'Failed to fetch group members' };
    }

    // Transform the data to match our type
    const transformedMembers = (members || []).map(member => ({
      id: member.id,
      group_id: member.group_id,
      user_id: member.user_id,
      role: member.role,
      status: 'active' as const,
      joined_at: member.joined_at,
      created_at: member.created_at || member.joined_at,
      updated_at: member.updated_at || member.joined_at,        user: {
          id: member.users.id,
          full_name: member.users.full_name,
          email: member.users.email,
          avatar_url: member.users.avatar_url
        }
    }));

    return { 
      success: true, 
      data: transformedMembers,
      message: 'Members fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching group members:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Remove a member from a group
 */
export async function removeMemberFromGroup(
  groupId: string,
  memberId: string
): Promise<ActionResponse<{ removedMemberId: string }>> {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // Check if the current user is an admin of the group
    const { data: currentMember, error: memberError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !currentMember) {
      return { success: false, error: 'You are not a member of this group' };
    }

    if (currentMember.role !== 'admin') {
      return { success: false, error: 'Only group admins can remove members' };
    }

    // Get the member to be removed
    const { data: memberToRemove, error: memberToRemoveError } = await supabase
      .from('group_members')
      .select('user_id, role')
      .eq('id', memberId)
      .eq('group_id', groupId)
      .single();

    if (memberToRemoveError || !memberToRemove) {
      return { success: false, error: 'Member not found' };
    }

    // Prevent removing another admin
    if (memberToRemove.role === 'admin' && memberToRemove.user_id !== user.id) {
      return { success: false, error: 'Cannot remove another admin from the group' };
    }

    // Remove the member
    const { error: removeError } = await supabase
      .from('group_members')
      .delete()
      .eq('id', memberId)
      .eq('group_id', groupId);

    if (removeError) {
      return { success: false, error: 'Failed to remove member' };
    }

    revalidatePath(`/GroupDetail/${groupId}`);
    return { 
      success: true, 
      data: { removedMemberId: memberId },
      message: 'Member removed successfully'
    };
  } catch (error) {
    console.error('Error removing member:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update a member's role in a group
 */
export async function updateMemberRole(
  groupId: string,
  memberId: string,
  newRole: 'admin' | 'member'
): Promise<ActionResponse<Member>> {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // Check if the current user is an admin of the group
    const { data: currentMember, error: memberError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !currentMember) {
      return { success: false, error: 'You are not a member of this group' };
    }

    if (currentMember.role !== 'admin') {
      return { success: false, error: 'Only group admins can update member roles' };
    }

    // Update the member's role
    const { data: updatedMember, error: updateError } = await supabase
      .from('group_members')
      .update({ role: newRole })
      .eq('id', memberId)
      .eq('group_id', groupId)
      .select('*')
      .single();

    if (updateError || !updatedMember) {
      return { success: false, error: 'Failed to update member role' };
    }

    // Transform to match our Member type
    const transformedMember: Member = {
      id: updatedMember.id,
      group_id: updatedMember.group_id,
      user_id: updatedMember.user_id,
      role: updatedMember.role,
      status: 'active',
      joined_at: updatedMember.joined_at,
      created_at: updatedMember.created_at || updatedMember.joined_at,
      updated_at: updatedMember.updated_at || new Date().toISOString()
    };

    revalidatePath(`/GroupDetail/${groupId}`);
    return { 
      success: true, 
      data: transformedMember,
      message: `Member role updated to ${newRole}`
    };
  } catch (error) {
    console.error('Error updating member role:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Leave a group (for non-admin members)
 */
export async function leaveGroup(groupId: string): Promise<ActionResponse<{ leftGroup: boolean }>> {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // Get the current member
    const { data: currentMember, error: memberError } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !currentMember) {
      return { success: false, error: 'You are not a member of this group' };
    }

    // Prevent admin from leaving if they're the only admin
    if (currentMember.role === 'admin') {
      const { data: adminCount, error: adminCountError } = await supabase
        .from('group_members')
        .select('id', { count: 'exact' })
        .eq('group_id', groupId)
        .eq('role', 'admin');

      if (adminCountError || (adminCount && adminCount.length <= 1)) {
        return { success: false, error: 'Cannot leave group as the only admin. Transfer ownership first.' };
      }
    }

    // Remove the member
    const { error: removeError } = await supabase
      .from('group_members')
      .delete()
      .eq('id', currentMember.id);

    if (removeError) {
      return { success: false, error: 'Failed to leave group' };
    }

    revalidatePath('/MyGroups');
    return { 
      success: true, 
      data: { leftGroup: true },
      message: 'Successfully left the group'
    };
  } catch (error) {
    console.error('Error leaving group:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}