import { createClient } from '@supabase/supabase-js';
import { CreateGroupFormData, ChitGroup } from '@/types/chit';

// Add debugging for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase environment variables. 
    NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'set' : 'missing'}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'set' : 'missing'}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createGroup(formData: CreateGroupFormData): Promise<{ data: ChitGroup | null; error: string | null }> {
  try {
    // 1. Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: 'Authentication required' };
    }

    // 2. Validate input data
    if (!formData.name || !formData.monthly_contribution || !formData.total_members || !formData.duration_months) {
      return { data: null, error: 'Missing required fields' };
    }

    if (formData.monthly_contribution <= 0 || formData.total_members < 2 || formData.duration_months <= 0) {
      return { data: null, error: 'Invalid input values' };
    }

    // 3. Insert into chit_groups table
    const { data: group, error: groupError } = await supabase
      .from('chit_groups')
      .insert({
        name: formData.name,
        description: formData.description || null,
        monthly_contribution: formData.monthly_contribution,
        total_members: formData.total_members,
        duration_months: formData.duration_months,
        status: 'pending',
        created_by: user.id
      })
      .select()
      .single();

    if (groupError) {
      return { data: null, error: groupError.message };
    }

    // 4. Insert into group_members table
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        user_id: user.id,
        group_id: group.id,
        role: 'admin'
      });

    if (memberError) {
      // If member insertion fails, we should delete the created group
      await supabase.from('chit_groups').delete().eq('id', group.id);
      return { data: null, error: memberError.message };
    }

    return { data: group, error: null };
  } catch (error) {
    console.error('Error creating group:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
} 